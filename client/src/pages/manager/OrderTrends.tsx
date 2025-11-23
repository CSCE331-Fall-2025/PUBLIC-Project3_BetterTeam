import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import './OrderTrends.css'

interface Dish {
    dish_id: number,
    name: string,
    price: number,
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

function OrderTrends() {

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedDishID, setSelectedDishID] = useState<number | null>(null);
    const [editedDish, setEditedDish] = useState<{name: string, type: string, price: number} | null>(null);
    const [newDish, setNewDish] = useState<Omit<Dish, 'dish_id'>>({
        name: '',
        type: 'Side',
        price: 1,
    })

    // hook that fetches the data
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch('http://localhost:4000/api/manager/dish');

                if(!response.ok){
                    throw new Error('Failed to fetch dishes');
                }

                // this parses the json and converts it into an inventory array
                const data:Dish[] = await response.json();

                setDishes(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchDishes();
    }, []);

    const selectedDish = dishes.find(e => e.dish_id === selectedDishID);

    const handleDishSelect = (id: number) => {
        const dishEdit = dishes.find(d => d.dish_id === id);

        if(dishEdit){
            setSelectedDishID(id);
            setEditedDish({
                name: dishEdit.name,
                type: dishEdit.type,
                price: dishEdit.price,
            });
        } else{
            setSelectedDishID(null);
            setEditedDish(null);
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

        let finalValue: string | number = newValue;

        if(field === 'price' && typeof newValue === 'string'){
            finalValue = parseFloat(newValue) || 1;
        }

        setEditedDish(prev => {
            if(!prev) return null;

            return({
                ...prev,
                [field]: finalValue,
            });
        });
    };

    const handleUpdate = async () => {
        if(!selectedDishID || !editedDish){
            alert('No selected dish to change');
            return;
        }

        try{
            const response = await fetch(`http://localhost:4000/api/manager/dish/${selectedDishID}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editedDish), 
            });

            if(!response.ok){
                throw new Error('Failed to update dish');
            }

            setDishes(prevDishes =>
                prevDishes.map(d => 
                    d.dish_id === selectedDishID ? { ...d, ...editedDish } : d
                )
            );

            setSelectedDishID(null);
            setEditedDish(null);

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
                const response = await fetch(`http://localhost:4000/api/manager/dish/${selectedDishID}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if(!response.ok){
                    throw new Error('Failed to delete dish');
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

    const handleAddFieldChange = (field: keyof Omit<Dish, 'dish_id'>, value: string | number) => {

        let finalValue: string | number = value;

        if(field === 'price' && typeof value === 'string'){
            finalValue = parseFloat(value) || 1;
        }

        setNewDish(prev => ({
            ...prev,
            [field]: finalValue,
        }));
    };

    const handleAdd = async () => {
        if(!newDish.name || newDish.price <= 0){
            alert('Please enter a valid name and price.');
            return;
        }

        try{
            const response = await fetch('http://localhost:4000/api/manager/dish', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newDish), 
            });

            if(!response.ok){
                throw new Error('Failed to add dish');
            }

            const addedDish: Dish = await response.json();

            setDishes(prevDishes => [...prevDishes, addedDish]);

            setNewDish({ name: '', type: 'Side', price: 1 });

            alert(`Added ${addedDish.name} successfully`);

        } catch(error){
            console.error('Add Error: ', error);
            alert('Error adding dish.');
        }
    };

	return(
		<div className='orderTrends'>
			<div className='dishChart'>
				<Line data={dishChartData} />
			</div>
			<div className='tableContainer'>
				<Table data={dishes} columns={dishColumns}/>
			</div>
            <div className='textContainer'>
                <div className='editContainer'>
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
                            <p>Currently Editing {selectedDish.name}</p>
                            <Textbox 
                                value={editedDish.name} 
                                onChange={(newName) => handleFieldChange('name', newName)} 
                                placeholder='Enter new name here...'
                            />
                            <Textbox 
                                value={String(editedDish.price)} 
                                onChange={(newPrice) => handleFieldChange('price', newPrice)} 
                                placeholder='Enter new price here...'
                            />
                            <select
                                value={editedDish.type}
                                onChange={(newType) => handleFieldChange('type', newType.target.value)}
                            >
                                <option value='' disabled>Type?</option>
                                <option value="Side">Side</option>
                                <option value="Entree">Entree</option>
                                <option value="App">App</option>
                                <option value="Drink">Drink</option>
                            </select>
                            <button onClick={handleUpdate}>Update Dish</button>
                            <button onClick={handleDeletion}>Remove Dish</button>
                        </>
                    )}
                </div>
                <div className='addContainer'>
                    <Textbox 
                        value={newDish.name}
                        onChange={(newName) => handleAddFieldChange('name', newName)} 
                        placeholder='Enter name here...'
                    />
                    <Textbox 
                        value={String(newDish.price)}
                        onChange={(newPrice) => handleAddFieldChange('price', newPrice)} 
                        placeholder='Enter price here...'
                    />
                    <select
                        value={String(newDish.type)}
                        onChange={(newType) => handleAddFieldChange('type', newType.target.value)}
                    >
                        <option value='' disabled>Type?</option>
                        <option value="Side">Side</option>
                        <option value="Entree">Entree</option>
                        <option value="App">App</option>
                        <option value="Drink">Drink</option>
                    </select>
                    <button onClick={handleAdd}>Add Dish</button>
                </div>
            </div>
		</div>
	);
}

export default OrderTrends;
