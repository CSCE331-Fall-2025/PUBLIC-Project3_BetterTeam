import React, { useState } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'
import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import { Chart as ChartJS} from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import './ManagerHome.css'

// For the staff header
const page = {
    name: 'ManagerHome',
    user: 'Manager',
};


// Data for the charts
const employeeData = {
    labels: ['Michael','Jackson','Sepguy'],
    datasets: [
        {
            label: 'Sales',
            data: [150,0,750],
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 2,
        },
    ],
}

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

// // Define the type that goes into the table
interface Employee {
    id: number;
    name: string;
    manager: boolean;
}

interface Dish {
    id: number,
    dishName: string,
    category: string,
}

interface Inventory {
    id: number,
    inventoryName: string,
    currQuantity: number,
    recQuantity: number,
}

function ManagerHome() {

    const navigate = useNavigate();

    function handleXReport() {
        alert('Items sold today :');
    }

    function handleZReport() {
        alert('Total sold today :');
    }

    function handleKitchen() {
        navigate('/login');
    }

    function handleLogout() {
        navigate('/login');
    }

    function handleClickTable() {
        alert('WHAT!!! How. How did you know to click me.');
    }

    function handleClickEmployee(){
        setEmployeeVisible(true);
        setDishVisible(false);
        setInventoryVisible(false);
    }

    function handleClickDish(){
        setEmployeeVisible(false);
        setDishVisible(true);
        setInventoryVisible(false);
    }

    function handleClickInventory(){
        setEmployeeVisible(false);
        setDishVisible(false);
        setInventoryVisible(true);
    }

    const [employeeVisible, setEmployeeVisible] = useState(true);
    const [dishVisible, setDishVisible] = useState(false);
    const [inventoryVisible, setInventoryVisible] = useState(false);

    // // Actual data for the table
    const employeeTableData: Employee[] = [
        { id: 1, name: 'Michael', manager: true },
        { id: 2, name: 'Jackson', manager: false },
        { id: 3, name: 'Sepguy', manager: true },
    ];

    // // Column definition for the table
    const employeeColumns: ColumnDefinition<Employee>[] = [
        {header: 'Employee Id', accessor: (e) => e.id },
        {header: 'Employee Name', accessor: (e) => e.name },
        {header: 'Is Manager?', accessor: (e) => (e.manager ? 'Yes' : 'No') },
    ];

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
        <div className='managerHome'>
            <StaffHeader name={page.name}/>
            
            <div className = 'chartContainer'>
                {employeeVisible && (
                    <div className='lineChart'>
                    <Line
                        data={employeeData}
                    />
                </div>
                )}
                {dishVisible && (
                    <div className='lineChart'>
                    <Line
                        data={dishData}
                    />
                </div>
                )}
                {inventoryVisible && (
                    <div className='lineChart'>
                    <Line
                        data={inventoryData}
                    />
                </div>
                )}

                {employeeVisible && (
                    <div className='tableContainer'>
                    <Table data={employeeTableData} columns={employeeColumns}/>
                    </div>
                )}
                {dishVisible && (
                    <div className='tableContainer'>
                    <Table data={dishTableData} columns={dishColumns}/> 
                    </div>
                )}
                {inventoryVisible && (
                    <div className='tableContainer'>
                    <Table data={inventoryTableData} columns={inventoryColumns}/> 
                    </div>
                )}
                
            </div>

            <div className = 'buttonContainer'>
                <Button name={'X Report'} onClick={handleXReport}/>
                <Button name={'Z Report'} onClick={handleZReport}/>
                <Button name={'Kitchen'} onClick={handleKitchen}/>
                <Button name={'Logout'} onClick={handleLogout}/>
                {/* <Button name={'Price'} onClick={handleClick}/>
                <Button name={'Quantity'} onClick={handleClick}/>
                <Button name={'Add Item'} onClick={handleClick}/>
                <Button name={'Edit Item'} onClick={handleClick}/>
                <Button name={'Delete Item'} onClick={handleClick}/> */}
                <Button name={'Employee Table'} onClick={handleClickEmployee}/>
                <Button name={'Dish Table'} onClick={handleClickDish}/>
                <Button name={'Inventory Table'} onClick={handleClickInventory}/>
            </div>
        </div>
    );
}

export default ManagerHome;