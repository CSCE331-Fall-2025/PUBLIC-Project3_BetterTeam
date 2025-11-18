// import { useState } from 'react'
// import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import './OrderTrends.css'

const dishData = {
    labels: ['Orange Chicken','Fried Rice','Seasonal'],
    datasets: [
        {
            label: 'Dish',
            data: [100,200,300],
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 2,
        },
        {
            label: 'Dish 2',
            data: [50,250,75],
            borderColor: 'rgba(125, 150, 75, 1)',
            backgroundColor: 'rgba(255,25,150,0.5)',
            borderWidth: 2,
        },
    ],
}

interface Dish {
    id: number,
    dishName: string,
    category: string,
}

function OrderTrends() {

	function handleClickTable() {
        alert('WHAT!!! How. How did you know to click me.');
    }

	const dishTableData: Dish[] = [
        { id: 1, dishName: 'Orange Chicken', category: 'Entree'},
        { id: 2, dishName: 'Fried Rice', category: 'Side' },
        { id: 3, dishName: 'Seasonal Item', category: 'Seasonal'},
    ];

    const dishColumns: ColumnDefinition<Dish>[] = [
        {header: 'Dish Id', accessor: (d) => d.id },
        {header: 'Dish Name', accessor: (d) => d.dishName },
        {header: 'Category', accessor: (d) => d.category },
        {
            header:'Click Dish',
            accessor: (dish) => (
                <button onClick={() => handleClickTable()}>
                    {dish.dishName}
                </button>
            ),
        },
    ];
	return(
		<div className='orderTrends'>
			<div className='dishChart'>
				<Line data={dishData} />
			</div>
			<div className='tableContainer'>
				<Table data={dishTableData} columns={dishColumns}/>
			</div>
		</div>
	);
}

export default OrderTrends;
