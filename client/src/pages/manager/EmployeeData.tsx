// import { useState } from 'react'
// import Button from '../../components/ButtonComponents/Button.tsx'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import './EmployeeData.css'

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

interface Employee {
    id: number;
    name: string;
    manager: boolean;
}

function EmployeeData() {
	const employeeTableData: Employee[] = [
        { id: 1, name: 'Michael', manager: true },
        { id: 2, name: 'Jackson', manager: false },
        { id: 3, name: 'Sepguy', manager: true },
    ];

	const employeeColumns: ColumnDefinition<Employee>[] = [
        {header: 'Employee Id', accessor: (e) => e.id },
        {header: 'Employee Name', accessor: (e) => e.name },
        {header: 'Is Manager?', accessor: (e) => (e.manager ? 'Yes' : 'No') },
    ];

	return(
		<div className='employeeData'>
			<div className='employeeChart'>
				<Line data={employeeData} />
			</div>
			<div className='tableContainer'>
				<Table data={employeeTableData} columns={employeeColumns}/>
			</div>
		</div>
	);
}

export default EmployeeData;
