import React from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'
import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'

const page = {
    name: 'Home',
    user: 'Manager',
};

// Define the type that goes into the table
interface Test {
    id: number;
    name: string;
    manager: boolean;
}

interface TestTwo {
    id: number,
    dishName: string,
    category: string,
}

function ManagerHome() {
    function handleClick() {
        alert('The clicker friend');
    }

    function handleClick2() {
        alert('That one friend that\'s too button');
    }

    function handleClick3() {
        alert('Okay you can stop clicking now');
    }

    function handleClick4() {
        alert('I said stop clicking buddy.');
    }

    function handleClickTable() {
        alert('WHAT!!! How. How did you know to click me.');
    }

    // Actual data for the table
    const testData: Test[] = [
        { id: 1, name: 'Michael', manager: true },
        { id: 2, name: 'Jackson', manager: false },
        { id: 3, name: 'Sepguy', manager: true },
    ];

    // Column definition for the table
    const testColumns: ColumnDefinition<Test>[] = [
        {header: 'Employee Id', accessor: (t) => t.id },
        {header: 'Employee Name', accessor: (t) => t.name },
        {header: 'Is Manager?', accessor: (t) => (t.manager ? 'Yes' : 'No') },
    ];

    const testTwoData: TestTwo[] = [
        { id: 1, dishName: 'Orange Chicken', category: 'Entree'},
        { id: 2, dishName: 'Fried Rice', category: 'Side' },
        { id: 3, dishName: 'Seasonal Item', category: 'Seasonal'},
    ];

    const testTwoColumns: ColumnDefinition<TestTwo>[] = [
        {header: 'Dish Id', accessor: (tt) => tt.id },
        {header: 'Dish Name', accessor: (tt) => tt.dishName },
        {header: 'Category', accessor: (tt) => tt.category },
        {
            header:'Click Test',
            accessor: (test) => (
                <button onClick={() => handleClickTable()}>
                    {test.dishName}
                </button>
            ),
        },
    ];

    return(
        <>
            <StaffHeader name={page.name}/>
            <Button name={'X Report'} onClick={handleClick}/>
            <Button name={'Z Report'} onClick={handleClick2}/>
            <Button name={'Kitchen'} onClick={handleClick3}/>
            <Button name={'Logout'} onClick={handleClick4}/>
            <Button name={'Price'} onClick={handleClick4}/>
            <Button name={'Quantity'} onClick={handleClick4}/>
            <Button name={'Add Item'} onClick={handleClick4}/>
            <Button name={'Edit Item'} onClick={handleClick4}/>
            <Button name={'Delete Item'} onClick={handleClick4}/>
            <Table data={testData} columns={testColumns}/>
            <Table data={testTwoData} columns={testTwoColumns}/>
        </>
    );
}

export default ManagerHome;