import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import PillBox from '../../components/MultiSelectComponents/PillBox.tsx'
import type { Options } from '../../components/MultiSelectComponents/PillBox.tsx'
import type { MultiValue } from 'react-select'; 
import type { Inventory } from './Inventory.tsx'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './OrderTrends.css'

const API_BASE = import.meta.env.VITE_API_BASE;

interface Dish {
    dish_id: number,
    name: string,
    price: number,
    type: string,
}

interface DishFormState {
    name: string,
    price: string,
    type: string,
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        borderWidth: number;
    }[];
}

export interface DishInventoryJunction {
    fk_dish: number,
    fk_inventory: number,
}

interface DishSalesData {
    name: string,
    sale_date: string,
    sales_count: number,
}

interface InventoryUsage {
    inventory_id: number,
    item: string,
    quantity_used: number,
}

const mapInventoryToOrders = (ing: Inventory): Options => {
    return{
        value: ing.inventory_id,
        label: ing.item,
    }
}

function OrderTrends() {

    // list of all dishes
    const [dishes, setDishes] = useState<Dish[]>([]);
    // dish selected to be updated
    const [selectedDishID, setSelectedDishID] = useState<number | null>(null);
    // locally stored dish with updates made
    const [editedDish, setEditedDish] = useState<DishFormState | null>(null);
    // new dish
    const [newDish, setNewDish] = useState<DishFormState>({
        name: '',
        type: 'Side',
        price: '1.00',
    })
    // list of all inventory
    const [inventory, setInventory] = useState<Options[]>([]);
    // list of all ingredients for every dish
    const [junction, setJunction] = useState<DishInventoryJunction[]>([]);
    // selected ingredients for a dish being updated
    const [selectedInventory, setSelectedInventory] = useState<MultiValue<Options>>([]);
    // selected ingredients for a new dish
    const [newInventory, setNewInventory] = useState<MultiValue<Options>>([]);
    // chart states
    const [chartDishes, setChartDishes] = useState<MultiValue<Options>>([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [displayMode, setDisplayMode] = useState<'price' | 'quantity'>('quantity');
    const [rawChartData, setRawChartData] = useState<DishSalesData[] | null>(null);

    const [invUsage, setInvUsage] = useState<InventoryUsage[]>([]);

    // hook that fetches the data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // sends a fetch request to the backend route
                const [dishRes, inventoryRes, junctionRes] = await Promise.all([
                    fetch(`${API_BASE}/api/manager/dish`),
                    fetch(`${API_BASE}/api/manager/inventory`),
                    fetch(`${API_BASE}/api/manager/dish/dishInventory`),
                ]);

                if(!dishRes.ok){
                    throw new Error('Failed to fetch dishes');
                }
                if(!inventoryRes.ok){
                    throw new Error('Failed to fetch inventory');
                }
                if(!junctionRes.ok){
                    throw new Error('Failed to fetch junction');
                }

                const dishesData: Dish[] = await dishRes.json();
                const inventoryData: Inventory[] = await inventoryRes.json();
                const junctionData: DishInventoryJunction[] = await junctionRes.json();

                // map inventory to an options array
                const optionsData: Options[] = inventoryData.map(mapInventoryToOrders);

                setDishes(dishesData);
                setInventory(optionsData);
                setJunction(junctionData);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const selectedDish = dishes.find(e => e.dish_id === selectedDishID);

    const handleDishSelect = (id: number) => {
        const dishEdit = dishes.find(d => d.dish_id === id);

        if(dishEdit){
            setSelectedDishID(id);
            setEditedDish({
                name: dishEdit.name,
                type: dishEdit.type,
                price: String(dishEdit.price),
            });

            // take the list of all dishinventory, filter for just the selected dish, and then map to turn it from fk_dish, fk_inventory to just be the inventory ids
            const ingredientIDs = junction.filter(j => j.fk_dish === id).map(j => j.fk_inventory);
            const initialIngredients = inventory.filter(i => ingredientIDs.includes(i.value));

            setSelectedInventory(initialIngredients);

        } else{
            setSelectedDishID(null);
            setEditedDish(null);;
            setSelectedInventory([]);
        }
    };

    const fetchSalesData = async() => {
        const selectedIds = chartDishes.map(d => d.value).join(',');

        if(selectedIds.length === 0 || !startDate || !endDate){
            alert('Please select at least one dish and a valid date range.');
            return;
        }

        // convert date object to YYYY-MM-DD
        const start = startDate.toISOString().split('T')[0];
        const dayAfterEnd = new Date(endDate);
        dayAfterEnd.setDate(endDate.getDate() + 1);
        const end = dayAfterEnd.toISOString().split('T')[0];

        try{
            const res = await fetch(`${API_BASE}/api/manager/dish/sales?dishIds=${selectedIds}&startDate=${start}&endDate=${end}`);

            if(!res.ok){
                throw new Error('Failed to fetch dish sales data');
            }

            const data: DishSalesData[] = await res.json();

            setRawChartData(data);

        } catch(error){
            console.error('Error fetching sales data:', error);
            alert('Could not fetch sales data.');
            setChartData(null);
        }
    }

    useEffect(() => {
        if(!rawChartData || rawChartData.length === 0){
            setChartData(null);
            return;
        }

        const dishPrices: { [dish_id: number]: number } = dishes.reduce((acc, dish) => {
            acc[dish.dish_id] = dish.price;
            return acc;
        }, {} as { [dish_id: number]: number });

        const dishOptionsMap = new Map(chartDishes.map(d => [d.label, d.value]));

        // put into chartjs format :)
        const processedData: { [date: string]: { [dishName: string]: number } } = {};
        const dishNames = new Set<string>();

        rawChartData.forEach(item => {
            if(!processedData[item.sale_date]){
                processedData[item.sale_date] = {};
            }

            const dishId = dishOptionsMap.get(item.name);
            const priceValue = dishId !== undefined ? dishPrices[dishId] : 1;
            let calculatedValue = item.sales_count;

            if(displayMode === 'price' && dishId !== undefined){
                calculatedValue = item.sales_count * priceValue;
            }

            processedData[item.sale_date][item.name] = calculatedValue;
            dishNames.add(item.name);
        });

        const uniqueDates = Object.keys(processedData).sort();
        const uniqueDishNames = Array.from(dishNames);

        const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2'];
        let colorIndex = 0;

        const newChartData: ChartData = {
            labels: uniqueDates,
            datasets: uniqueDishNames.map(name => {
                const color = colors[colorIndex % colors.length];
                colorIndex++;

                return{
                    label: name,
                    data: uniqueDates.map(date => processedData[date][name] || 0),
                    borderColor: color,
                    backgroundColor: `${color}40`,
                    borderWidth: 2,
                    fill: false,
                };
            }),
        };

        setChartData(newChartData);

    }, [rawChartData, displayMode, dishes, chartDishes])

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';

                        if(label) {
                            label += ': ';
                        }
                        if(context.parsed.y !== null){
                            if(displayMode === 'price'){
                                label += '$' + context.parsed.y.toFixed(2); 
                            } else{
                                label += Math.round(context.parsed.y);
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value: any) {
                        if(displayMode === 'price'){
                            return '$' + Number(value).toFixed(2);
                        } else{
                            return Math.round(value);
                        }
                    }
                }
            }
        }
    };

    const dishColumns: ColumnDefinition<Dish>[] = [
        {header: 'Dish Id', accessor: (d) => d.dish_id },
        {header: 'Dish Name', accessor: (d) => d.name },
        {header: 'Dish Price', accessor: (d) => d.price },
        {header: 'Category', accessor: (d) => d.type },
    ];

    useEffect(() => {
        if(!rawChartData || rawChartData.length === 0 || !junction || junction.length === 0){
            setInvUsage([]);
            return;
        }
        const inventoryMap = new Map(inventory.map(i => [i.value, i.label]));
        const usageMap = new Map<number, number>();
        const dishSalesMap = new Map<string, number>();

        rawChartData.forEach(item => {
            const total = dishSalesMap.get(item.name) || 0;
            dishSalesMap.set(item.name, total + Number(item.sales_count));
        });

        const dishIdMap = new Map(dishes.map(d => [d.name, d.dish_id]));

        dishSalesMap.forEach((salesCount, dishName) => {
            const dishId = dishIdMap.get(dishName);

            if(dishId !== undefined){
                const ingredientsForDish = junction.filter(j => j.fk_dish === dishId);

                ingredientsForDish.forEach(j => {
                    const inventoryId = j.fk_inventory;
                    const usedAmount = Number(salesCount);
                    const total = usageMap.get(inventoryId) || 0;
                    usageMap.set(inventoryId, total + usedAmount);
                });
            }
        });

        const finalUsageData: InventoryUsage[] = Array.from(usageMap.entries()).map(([id, quantity]) => ({
            inventory_id: id,
            item: inventoryMap.get(id) || `Unknown Item (${id})`,
            quantity_used: quantity,
        }));

        setInvUsage(finalUsageData);

    }, [rawChartData, junction, inventory, dishes]);

    const invUsageColumns: ColumnDefinition<InventoryUsage>[] = [
        {header: 'Inventory ID', accessor: (i) => i.inventory_id },
        {header: 'Inventory Item', accessor: (i) => i.item },
        {header: 'Total Used', accessor: (i) => i.quantity_used },
    ]

    const handleFieldChange = (field: 'name' | 'price' | 'type', newValue: string ) => {
        if(!editedDish) return;

        let finalValue: string = newValue;

        if(typeof newValue === 'string' && field === 'name'){
            finalValue = newValue.trim();
        }

        if(field === 'price'){
            // regex to check if its a valid decimal or is ending with a decimal
            if(!/^\d*(\.\d{0,2})?$/.test(newValue) && newValue !== ''){
                return;
            }
            finalValue = newValue;
        }

        setEditedDish(prev => {
            if(!prev) return null;

            return({
                ...prev,
                [field]: finalValue,
            }); 
        });
    };

    const updateIngredients = async (dishId: number, ingredients: MultiValue<Options>) => {
        const newIngredients = ingredients.map(item => item.value);

        const response = await fetch (`${API_BASE}/api/manager/dish/${dishId}/ingredients`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ newInventory: newIngredients}),
        });

        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`Failed to update dish ingredients: ${errorText}`);
        }
    }

    const handleUpdate = async () => {
        if(!selectedDishID || !editedDish){
            alert('No selected dish to change');
            return;
        }

        if(!editedDish.name || parseFloat(editedDish.price) <= 0 || editedDish.name.length > 255){
            alert('Please enter a valid name and price.');
            return;
        }

        const priceValue = parseFloat(editedDish.price);

        if(editedDish.price === '' || isNaN(priceValue) || priceValue <= 0){
            alert('Please enter a valid price greater than zero.');
            return;
        }

        try{
            const finalDish = {
                ...editedDish,
                price: parseFloat(editedDish.price) || 1,
            }
            const response = await fetch(`${API_BASE}/api/manager/dish/${selectedDishID}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(finalDish), 
            });

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to update dish: ${errorText}`);
            }

            setDishes(prevDishes =>
                prevDishes.map(d => 
                    d.dish_id === selectedDishID ? { ...d, ...finalDish } : d
                )
            );

            await updateIngredients(selectedDishID, selectedInventory);

            setSelectedDishID(null);
            setEditedDish(null);
            setSelectedInventory([]);

            alert('Dish updated successfully.');

        } catch(error){
            console.error('Update Error: ', error);
            alert('Error updating dish.');
        }
    };

    const handleDeletion = async () => {
        if (!window.confirm('Delete this dish?')) {
            alert('dish saved...');
        } else{
            if(!selectedDishID || !editedDish){
                alert('No selected dish to delete.');
                return;
            }

            try{
                const response = await fetch(`${API_BASE}/api/manager/dish/${selectedDishID}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if(!response.ok){
                    const errorText = await response.text();
                    throw new Error(`Failed to delete dish: ${errorText}`);
                }

                setDishes(prevDishes =>
                    prevDishes.filter(d => d.dish_id !== selectedDishID)
                );

                setSelectedDishID(null);
                setEditedDish(null);

                alert('Dish deleted successfully.');

            } catch(error){
                console.error('Deletion Error: ', error);
                alert('Error deleting dish.');
            }
        }
    };

    const handleAddFieldChange = (field: keyof DishFormState, value: string) => {

        let finalValue: string = value;

        if(typeof value === 'string' && field === 'name'){
            finalValue = value.trim();
        }

        if(field === 'price'){
            if(!/^\d*(\.\d{0,2})?$/.test(value) && value !== ''){
                return;
            }
            finalValue = value;
        }

        setNewDish(prev => ({
            ...prev,
            [field]: finalValue,
        }));
    };

    const handleAdd = async () => {
        if(!newDish.name || parseFloat(newDish.price) <= 0 || newDish.name.length > 255){
            alert('Please enter a valid name and price.');
            return;
        }

        if(dishes.find(d => d.name === newDish.name)){
            alert('Please enter a unique name.');
            return;
        }

        const priceValue = parseFloat(newDish.price);

        if(newDish.price === '' || isNaN(priceValue) || priceValue <= 0){
            alert('Please enter a valid price greater than zero.');
            return;
        }

        if(newInventory.length === 0){
            alert('A new dish must have at least one ingredient.');
            return;
        }

        try{
            const finalDish = {
                ...newDish,
                price: parseFloat(newDish.price),
            }
            const response = await fetch(`${API_BASE}/api/manager/dish`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(finalDish), 
            });

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to add dish: ${errorText}`);
            }

            const addedDish: Dish = await response.json();

            await updateIngredients(addedDish.dish_id, newInventory);

            const newJunctionEntries: DishInventoryJunction[] = newInventory.map(item => ({
                fk_dish: addedDish.dish_id,
                fk_inventory: item.value,
            }));

            setJunction(prevJunction => [...prevJunction, ...newJunctionEntries]);

            setDishes(prevDishes => [...prevDishes, addedDish]);
            setNewDish({ name: '', type: 'Side', price: '1.00' });
            setNewInventory([]);

            alert(`Added ${addedDish.name} successfully`);

        } catch(error){
            console.error('Add Error: ', error);
            alert('Error adding dish.');
        }
    };

    const handleUpdateIngredientChange = (selectedItems: MultiValue<Options>) => {
        setSelectedInventory(selectedItems);
    }

    const handleAddIngredientChange = (selectedItems: MultiValue<Options>) => {
        setNewInventory(selectedItems);
    }

    const handleChartDishSelection = (selectedItems: MultiValue<Options>) => {
        setChartDishes(selectedItems);
    }

    const handlePriceQuanButton = (mode: 'price' | 'quantity') => {
        setDisplayMode(mode);
    }

    const handleSelectAll = () => {
        setChartDishes(dishOptions);
    }

    const handleDeselectAll = () => {
        setChartDishes([]);
    }

    const dishOptions: Options[] = dishes.map(d => ({ value: d.dish_id, label: d.name }));

	return(
		<div className='orderTrends'>
            <div className='dishDisplays'>
                <div className='actualChart'>
                    {chartData ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <p>Select dishes, a date range, and click 'Update Chart' to view trend data.</p>
                    )}
                </div>
                <div className='dishChart'>
                    <h2>Dish Sales Trend</h2>
                    <div className='chartLayout'></div>
                    <div>
                        <label className='dateLabel'>Start Date:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date | null) => {
                                if(date){
                                    setStartDate(date);
                                }
                            }}
                            dateFormat='yyyy/MM/dd'
                        />
                    </div>
                    <div>
                        <label className='dateLabel'>End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date | null) => {
                                if(date){
                                    setEndDate(date);
                                }
                            }}
                            dateFormat='yyyy/MM/dd'
                        />
                    </div>
                </div>
                <div className='pillBoxContainer'>
                    <div className='chartPillBox'>
                        <PillBox 
                            availableOptions={dishOptions}
                            initialOptions={chartDishes}
                            placeholder='Select Dishes to Chart...'
                            onSelectionChange={handleChartDishSelection}
                        />
                    </div>                    
                    <button onClick={handleSelectAll} className='man-btn'>Select All</button>
                    <button onClick={handleDeselectAll} className='man-btn'>Deselect All</button>
                </div>
                <div className='dishChartBtnContainer'>
                    <button onClick={fetchSalesData} className='man-btn'>Update Chart</button>
                    <button onClick={() => handlePriceQuanButton('price')} className='man-btn'>Price</button>
                    <button onClick={() => handlePriceQuanButton('quantity')} className='man-btn'>Quantity</button>
                </div>
                
                <div className='tableContainer'>
                    <Table data={dishes} columns={dishColumns}/>
                    <Table data={invUsage} columns={invUsageColumns}/>
                </div>
            </div>
            <div className='textContainer'>
                <div className='editContainer'>
                    <h2>Edit Selected Dish</h2  >
                    <select onChange={(d) => handleDishSelect(Number(d.target.value))} value={selectedDishID ?? ''}>
                        <option value='' disabled>Select Dish</option>
                        {dishes.map(d => (
                            <option key={d.dish_id} value={d.dish_id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    {selectedDish && editedDish && (
                        <>
                            <h3>Name</h3>
                            <Textbox 
                                value={editedDish.name} 
                                onChange={(newName) => handleFieldChange('name', newName)} 
                                placeholder='Enter new name here...'
                            />
                            <h3>Price</h3>
                            <Textbox 
                                value={String(editedDish.price)} 
                                onChange={(newPrice) => handleFieldChange('price', newPrice)} 
                                placeholder='Enter new price here...'
                            />
                            <h3>Type</h3>
                            <select
                                value={editedDish.type}
                                onChange={(newType) => handleFieldChange('type', newType.target.value)}
                            >
                                <option value='' disabled>Type?</option>
                                <option value="Side">Side</option>
                                <option value="Entree">Entree</option>
                                <option value="App">App</option>
                                <option value="Drink">Drink</option>
                                <option value="Seasonal">Seasonal</option>
                            </select>
                            <h3>Ingredients</h3>
                            <PillBox 
                                availableOptions={inventory}
                                initialOptions={selectedInventory}
                                placeholder='Select Ingredients for Dish...'
                                onSelectionChange={handleUpdateIngredientChange}
                            />
                            <button onClick={handleUpdate} className='man-btn'>Update Dish</button>
                            <button onClick={handleDeletion} className='man-btn'>Remove Dish</button>
                        </>
                    )}
                </div>
                <div className='addContainer'>
                    <h2>Add new Dish</h2>
                    <h3>Name</h3>
                    <Textbox 
                        value={newDish.name}
                        onChange={(newName) => handleAddFieldChange('name', newName)} 
                        placeholder='Enter name here...'
                    />
                    <h3>Price</h3>
                    <Textbox 
                        value={String(newDish.price)}
                        onChange={(newPrice) => handleAddFieldChange('price', newPrice)} 
                        placeholder='Enter price here...'
                    />
                    <h3>Type</h3>
                    <select
                        value={String(newDish.type)}
                        onChange={(newType) => handleAddFieldChange('type', newType.target.value)}
                    >
                        <option value='' disabled>Type?</option>
                        <option value="Side">Side</option>
                        <option value="Entree">Entree</option>
                        <option value="App">App</option>
                        <option value="Drink">Drink</option>
                        <option value="Seasonal">Seasonal</option>
                    </select>
                    <h3>Ingredients</h3>
                    <PillBox 
                        availableOptions={inventory}
                        initialOptions={newInventory}
                        placeholder='Select Ingredients for Dish...'
                        onSelectionChange={handleAddIngredientChange}
                    />
                    <button onClick={handleAdd} className='man-btn'>Add Dish</button>
                </div>
            </div>
		</div>
	);
}

export default OrderTrends;
