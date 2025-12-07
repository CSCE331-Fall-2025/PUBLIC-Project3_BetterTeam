import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import PillBox from '../../components/MultiSelectComponents/PillBox.tsx'
import type { Options } from '../../components/MultiSelectComponents/PillBox.tsx'
import type { MultiValue } from 'react-select'; 
import type { Inventory } from './Inventory.tsx'
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

interface DishInventoryJunction {
    fk_dish: number,
    fk_inventory: number,
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

    const dishChartData: ChartData = {
        labels: dishes.map(d => d.name),
        datasets: [{
            label: 'Price',
            data: dishes.map(d => d.price),
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
        },],
    };

    const dishColumns: ColumnDefinition<Dish>[] = [
        {header: 'Dish Id', accessor: (d) => d.dish_id },
        {header: 'Dish Name', accessor: (d) => d.name },
        {header: 'Dish Price', accessor: (d) => d.price },
        {header: 'Category', accessor: (d) => d.type },
    ];

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
            alert('Yeah lets delete this dish, lets delete this dish with database calls.');
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

	return(
		<div className='orderTrends'>
            <div className='dishDisplays'>
                <div className='dishChart'>
                    <Line data={dishChartData} />
                </div>
                <div className='tableContainer'>
                    <Table data={dishes} columns={dishColumns}/>
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
