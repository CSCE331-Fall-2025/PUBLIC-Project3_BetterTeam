import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import './Inventory.css'

const API_BASE = import.meta.env.VITE_API_BASE;

export interface Inventory {
    inventory_id: number,
    item: string,
    current_inventory: number,
    target_inventory: number,
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

function Inventory() {

    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [selectedInventoryID, setSelectedInventoryID] = useState<number | null>(null);
    const [editedInventory, setEditedInventory] = useState<{item: string, current_inventory: number, target_inventory: number} | null>(null);
    const [newInventory, setNewInventory] = useState<Omit<Inventory, 'inventory_id'>>({
        item: '',
        current_inventory: 0,
        target_inventory: 1000,
    })

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

    const inventoryChartData: ChartData = {
        labels: inventory.map(i => i.item),
        datasets: [{
            label: 'Current Quantity',
            data: inventory.map(i => i.current_inventory),
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
        },
        {
            label: 'Reccomended Quantity',
            data: inventory.map(i => i.target_inventory),
            borderColor: 'rgba(133, 38, 38, 1)',
            backgroundColor: 'rgba(150, 31, 31, 0.5)',
            borderWidth: 2,
        },],
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

        if( (field === 'current_inventory' || field === 'target_inventory') && typeof newValue === 'string'){
            finalValue = parseFloat(newValue) || 0;
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
            alert('Yeah lets delete this item, lets delete this item with database calls.');
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

        if( (field === 'current_inventory' || field === 'target_inventory') && typeof value === 'string'){
            finalValue = parseFloat(value) || 0;
        }

        setNewInventory(prev => ({
            ...prev,
            [field]: finalValue,
        }));
    };

    const handleAdd = async () => {
        if(!newInventory.item || newInventory.current_inventory <= 0 || newInventory.target_inventory <=0 ){
            alert('Please enter a valid name and current and target inventories.');
            return;
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

            setNewInventory({ item: '', current_inventory: 0, target_inventory: 0 });

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
                    <Line data={inventoryChartData} />
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
                            <button onClick={handleUpdate}>Update Inventory</button>
                            <button onClick={handleDeletion}>Remove from Inventory</button>
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
                    <button onClick={handleAdd}>Add to Inventory</button>
                </div>
            </div>
		</div>
	);
}

export default Inventory;
