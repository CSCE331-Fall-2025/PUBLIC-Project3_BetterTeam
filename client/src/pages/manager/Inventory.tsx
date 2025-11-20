import { useState, useEffect } from 'react'
// import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import './Inventory.css'

interface Inventory {
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

    // hook that fetches the data
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch('http://localhost:4000/api/manager/inventory');

                if(!response.ok){
                    throw new Error('Failed to fetch inventory');
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

    const inventoryChartData: ChartData = {
        labels: inventory.map(i => i.item),
        datasets: [{
            label: 'Current Quantity',
            data: inventory.map(i => i.current_inventory),
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
        },],
    };

    const inventoryColumns: ColumnDefinition<Inventory>[] = [
        {header: 'Inventory Id', accessor: (i) => i.inventory_id },
        {header: 'Inventory Name', accessor: (i) => i.item },
        {header: 'Current Quantity', accessor: (i) => i.current_inventory },
        {header: 'Reccomended Quantity', accessor: (i) => i.target_inventory },
    ];

	return(
		<div className='inventory'>
			<div className='inventoryChart'>
				<Line data={inventoryChartData} />
			</div>
			<div className='tableContainer'>
				<Table data={inventory} columns={inventoryColumns}/>
			</div>
		</div>
	);
}

export default Inventory;
