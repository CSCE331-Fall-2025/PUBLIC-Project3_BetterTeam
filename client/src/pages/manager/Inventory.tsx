// import { useState } from 'react'
// import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import './Inventory.css'

const inventoryData = {
    labels: ['Orange','Rice','Chicken'],
    datasets: [
        {
            label: 'Inventory',
            data: [200,250,100],
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 2,
        },
    ],
}

interface Inventory {
    id: number,
    inventoryName: string,
    currQuantity: number,
    recQuantity: number,
}

function Inventory() {

	function handleClickTable() {
        alert('WHAT!!! How. How did you know to click me.');
    }

	const inventoryTableData: Inventory[] = [
        { id: 1, inventoryName: 'Orange', currQuantity: 200, recQuantity: 1000},
        { id: 2, inventoryName: 'Rice', currQuantity: 250, recQuantity: 1000 },
        { id: 3, inventoryName: 'Chicken', currQuantity: 100, recQuantity: 1000},
    ];

    const inventoryColumns: ColumnDefinition<Inventory>[] = [
        {header: 'Inventory Id', accessor: (i) => i.id },
        {header: 'Inventory Name', accessor: (i) => i.inventoryName },
        {header: 'Current Quantity', accessor: (i) => i.currQuantity },
        {header: 'Reccomended Quantity', accessor: (i) => i.recQuantity },
        {
            header:'Click Inventory',
            accessor: (inventory) => (
                <button onClick={() => handleClickTable()}>
                    {inventory.inventoryName}
                </button>
            ),
        },
    ];

	return(
		<div className='inventory'>
			<div className='inventoryChart'>
				<Line data={inventoryData} />
			</div>
			<div className='tableContainer'>
				<Table data={inventoryTableData} columns={inventoryColumns}/>
			</div>
		</div>
	);
}

export default Inventory;
