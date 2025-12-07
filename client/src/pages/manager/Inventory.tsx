import { useState, useEffect, useRef } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend
} from 'chart.js';
import type {ChartArea, ChartData } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import './Inventory.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const API_BASE = import.meta.env.VITE_API_BASE;

export interface Inventory {
    inventory_id: number,
    item: string,
    current_inventory: number,
    target_inventory: number,
}

const MAX_TARGET_INVENTORY = 10000;
const MAX_CURRENT_INVENTORY = 12000;
const MAX_CURRENT_MULT = 1.2;

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 206, 86, 1)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 1)');

    return gradient;
};

function Inventory() {

    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [selectedInventoryID, setSelectedInventoryID] = useState<number | null>(null);
    const [editedInventory, setEditedInventory] = useState<{item: string, current_inventory: number, target_inventory: number} | null>(null);
    const [newInventory, setNewInventory] = useState<Omit<Inventory, 'inventory_id'>>({
        item: '',
        current_inventory: 0,
        target_inventory: 1000,
    })

    const chartRef = useRef<ChartJS>(null);
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: [],
    });

    // hook that fetches the data
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch(`${API_BASE}/api/manager/inventory`);

                if(!response.ok){
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch inventory: ${errorText}`);
                }

                // this parses the json and converts it into an inventory array
                const data:Inventory[] = await response.json();

                setInventory(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchInventory();
    }, []);

    useEffect(() => {
        const chart = chartRef.current;

        if(!chart){
            return;
        }

        const calculatedData: ChartData<'line'> = {
            labels: inventory.map(i => i.item),
            datasets: [
                {
                    label: 'Current Quantity',
                    data: inventory.map(i => i.current_inventory),
                    borderColor: createGradient(chart.ctx, chart.chartArea),
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 2,
                    tension: 0.25,
                },
                {
                    label: 'Reccomended Quantity',
                    data: inventory.map(i => i.target_inventory),
                    borderColor: 'rgba(133, 38, 38, 0.3)',
                    backgroundColor: 'rgba(150, 31, 31, 0.1)',
                    borderWidth: 2,
                    borderDash: [5,5],
                },
            ],
        };
        setChartData(calculatedData);
    }, [inventory]);

    const selectedInventory = inventory.find(i => i.inventory_id === selectedInventoryID);

    const handleInventorySelect = (id: number) => {
        const inventoryEdit = inventory.find(i => i.inventory_id === id);

        if(inventoryEdit){
            setSelectedInventoryID(id);
            setEditedInventory({
                item: inventoryEdit.item,
                current_inventory: inventoryEdit.current_inventory,
                target_inventory: inventoryEdit.target_inventory,
            });
        } else{
            setSelectedInventoryID(null);
            setEditedInventory(null);
        }
    };

    const inventoryColumns: ColumnDefinition<Inventory>[] = [
        {header: 'Inventory Id', accessor: (i) => i.inventory_id },
        {header: 'Inventory Name', accessor: (i) => i.item },
        {header: 'Current Quantity', accessor: (i) => i.current_inventory },
        {header: 'Reccomended Quantity', accessor: (i) => i.target_inventory },
    ];

    const handleFieldChange = (field: 'item' | 'current_inventory' | 'target_inventory', newValue: string ) => {
        if(!editedInventory) return;

        let finalValue: string | number = newValue;

        if(typeof newValue === 'string' && field === 'item' ){
            finalValue = newValue.trim();
        }

        if( (field === 'current_inventory' || field === 'target_inventory') && typeof newValue === 'string'){
            if(!/^\d*$/.test(newValue)){
                return;
            }
            finalValue = parseInt(newValue) || 0;

            if(field === 'current_inventory' && finalValue > MAX_CURRENT_INVENTORY){
                alert(`Current inventory cannot exceed ${MAX_CURRENT_INVENTORY}.`);
                finalValue = MAX_CURRENT_INVENTORY;
            }

            if(field === 'target_inventory' && finalValue > MAX_TARGET_INVENTORY){
                alert(`Target inventory cannot exceed ${MAX_TARGET_INVENTORY}.`);
                finalValue = MAX_TARGET_INVENTORY;
            }
        }

        setEditedInventory(prev => {
            if(!prev) return null;

            return({
                ...prev,
                [field]: finalValue,
            });
        });
    };

    const handleUpdate = async () => {
        if(!selectedInventoryID || !editedInventory){
            alert('No selected inventory to change');
            return;
        }

        if(!editedInventory.item || editedInventory.current_inventory <= 0 || editedInventory.target_inventory <=0 || editedInventory.item.length > 255){
            alert('Please enter a valid name and current and target inventories.');
            return;
        }

        const maxCurrent = editedInventory.target_inventory * MAX_CURRENT_MULT;
        if(editedInventory.current_inventory > maxCurrent){
            const confirm = window.confirm(
                `Warning: Current inventory (${editedInventory.current_inventory}) is significantly higher than the target (${editedInventory.target_inventory}).` + 
                `This might lead to overstocking. Max reccomended is ${maxCurrent.toFixed(0)}. Do you wish to proceed?`
            );
            if(!confirm){
                return;
            }
        }

        try{
            const response = await fetch(`${API_BASE}/api/manager/inventory/${selectedInventoryID}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editedInventory), 
            });

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to update inventory: ${errorText}`);
            }

            setInventory(prevInventory =>
                prevInventory.map(i => 
                    i.inventory_id === selectedInventoryID ? { ...i, ...editedInventory } : i
                )
            );

            setSelectedInventoryID(null);
            setEditedInventory(null);

            alert('Inventory updated successfully.');

        } catch(error){
            console.error('Update Error: ', error);
            alert('Error updating inventory.');
        }
    };

    const handleDeletion = async () => {
        if (!window.confirm('Delete this inventory?')) {
            alert('inventory saved...');
        } else{
            if(!selectedInventoryID || !editedInventory){
                alert('No selected inventory to delete.');
                return;
            }

            try{
                const response = await fetch(`${API_BASE}/api/manager/inventory/${selectedInventoryID}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if(!response.ok){
                    const errorText = await response.text();
                    throw new Error(`Failed to delete inventory: ${errorText}`);
                }

                setInventory(prevInventory =>
                    prevInventory.filter(i => i.inventory_id !== selectedInventoryID)
                );

                setSelectedInventoryID(null);
                setEditedInventory(null);

                alert('Inventory deleted successfully.');

            } catch(error){
                console.error('Deletion Error: ', error);
                alert('Error deleting inventory.');
            }
        }
    };

    const handleAddFieldChange = (field: keyof Omit<Inventory, 'inventory_id'>, value: string | number) => {

        let finalValue: string | number = value;

        if(typeof value === 'string' && field === 'item'){
            finalValue = value.trim();
        }

        if( (field === 'current_inventory' || field === 'target_inventory') && typeof value === 'string'){
            if(!/^\d*$/.test(value)){
                return;
            }
            finalValue = parseInt(value) || 0;

            if(field === 'current_inventory' && finalValue > MAX_CURRENT_INVENTORY){
                alert(`Current inventory cannot exceed ${MAX_CURRENT_INVENTORY}.`);
                finalValue = MAX_CURRENT_INVENTORY;
            }

            if(field === 'target_inventory' && finalValue > MAX_TARGET_INVENTORY){
                alert(`Target inventory cannot exceed ${MAX_TARGET_INVENTORY}.`);
                finalValue = MAX_TARGET_INVENTORY;
            }
        }

        setNewInventory(prev => ({
            ...prev,
            [field]: finalValue,
        }));
    };

    const handleAdd = async () => {
        if(!newInventory.item || newInventory.current_inventory <= 0 || newInventory.target_inventory <=0 || newInventory.item.length > 255){
            alert('Please enter a valid name and current and target inventories.');
            return;
        }

        if(inventory.find(i => i.item === newInventory.item)){
            alert('Please enter a unique name.');
            return;
        }


        const maxCurrent = newInventory.target_inventory * MAX_CURRENT_MULT;
        if(newInventory.current_inventory > maxCurrent){
            const confirm = window.confirm(
                `Warning: Current inventory (${newInventory.current_inventory}) is significantly higher than the target (${newInventory.target_inventory}).` + 
                `This might lead to overstocking. Max reccomended is ${maxCurrent.toFixed(0)}. Do you wish to proceed?`
            );
            if(!confirm){
                return;
            }
        }

        try{
            const response = await fetch(`${API_BASE}/api/manager/inventory`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newInventory), 
            });

            if(!response.ok){
                const errorText = await response.text();
                throw new Error(`Failed to add inventory: ${errorText}`);
            }

            const addedInventory: Inventory = await response.json();

            setInventory(prevInventory => [...prevInventory, addedInventory]);

            setNewInventory({ item: '', current_inventory: 0, target_inventory: 1000 });

            alert(`Added ${addedInventory.item} successfully`);

        } catch(error){
            console.error('Add Error: ', error);
            alert('Error adding inventory.');
        }
    };

	return(
		<div className='inventory'>
            <div className='inventoryDisplays'>
                <div className='inventoryChart'>
                    <Chart ref={chartRef} type='line' data={chartData} />
                </div>
                <div className='tableContainer'>
                    <Table data={inventory} columns={inventoryColumns}/>
                </div>
            </div>
            <div className='textContainer'>
                <div className='editContainer'>
                    <h2>Edit Inventory</h2>
                    <select onChange={(i) => handleInventorySelect(Number(i.target.value))} value={selectedInventoryID ?? ''}>
                        <option value='' disabled>Select Inventory</option>
                        {inventory.map(i => (
                            <option key={i.inventory_id} value={i.inventory_id}>
                                {i.item}
                            </option>
                        ))}
                    </select>
                    {selectedInventory && editedInventory && (
                        <>
                            <h3>Name</h3>
                            <Textbox 
                                value={editedInventory.item} 
                                onChange={(newItem) => handleFieldChange('item', newItem)} 
                                placeholder='Enter new ingredient name here...'
                            />
                            <h3>Current Inventory</h3>
                            <Textbox 
                                value={String(editedInventory.current_inventory)} 
                                onChange={(newCurrentInventory) => handleFieldChange('current_inventory', newCurrentInventory)} 
                                placeholder='Enter current inventory here...'
                            />
                            <h3>Target Inventory</h3>
                            <Textbox 
                                value={String(editedInventory.target_inventory)} 
                                onChange={(newTargetInventory) => handleFieldChange('target_inventory', newTargetInventory)} 
                                placeholder='Enter target inventory here...'
                            />
                            <button onClick={handleUpdate} className='man-btn'>Update Inventory</button>
                            <button onClick={handleDeletion} className='man-btn'>Remove from Inventory</button>
                        </>
                    )}
                </div>
                <div className='addContainer'>
                    <h2>Add new Inventory</h2>
                    <h3>Name</h3>
                    <Textbox 
                        value={newInventory.item}
                        onChange={(newItem) => handleAddFieldChange('item', newItem)} 
                        placeholder='Enter ingredient name here...'
                    />
                    <h3>Current Inventory</h3>
                    <Textbox 
                        value={String(newInventory.current_inventory)}
                        onChange={(newCurrentInventory) => handleAddFieldChange('current_inventory', newCurrentInventory)} 
                        placeholder='Enter current inventory here...'
                    />
                    <h3>Target Inventory</h3>
                    <Textbox 
                        value={String(newInventory.target_inventory)}
                        onChange={(newTargetInventory) => handleAddFieldChange('target_inventory', newTargetInventory)} 
                        placeholder='Enter target inventory here...'
                    />
                    <button onClick={handleAdd} className='man-btn'>Add to Inventory</button>
                </div>
            </div>
		</div>
	);
}

export default Inventory;
