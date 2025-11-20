import { useState, useEffect } from 'react'
// import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
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

	return(
		<div className='orderTrends'>
			<div className='dishChart'>
				<Line data={dishChartData} />
			</div>
			<div className='tableContainer'>
				<Table data={dishes} columns={dishColumns}/>
			</div>
		</div>
	);
}

export default OrderTrends;
