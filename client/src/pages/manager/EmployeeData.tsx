import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import './EmployeeData.css'

const API_BASE = import.meta.env.VITE_API_BASE;

interface Employee {
    employee_id: number;
    name: string;
    ismanager: boolean;
    wage: number;
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

function EmployeeData() {

    const [employees, setEmployees] = useState<Employee[]>([]);

    // hook that fetches the data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch(`${API_BASE}/api/manager/employee`);

                if(!response.ok){
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch employees: ${errorText}`);
                }

                // this parses the json and converts it into an employee array
                const data:Employee[] = await response.json();

                setEmployees(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchEmployees();
    }, []);

    const employeeChartData: ChartData = {
        labels: employees.map(e => e.name),
        datasets: [{
            label: 'Employee Wages',
            data: employees.map(e => e.wage),
            borderColor: 'rgba(75, 75, 75, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
        },],
    };

    const employeeColumns: ColumnDefinition<Employee>[] = [
        {header: 'Employee Id', accessor: (e) => e.employee_id },
        {header: 'Employee Name', accessor: (e) => e.name },
        {header: 'Is Manager?', accessor: (e) => (e.ismanager ? 'Yes' : 'No') },
        {header: 'Wage', accessor: (e) => `$${e.wage.toFixed(2)}`},
    ];

	return(
		<div className='employeeData'>
            <div className='employeeDisplays'>
                <div className='employeeChart'>
                    <Bar data={employeeChartData} />
                </div>
                <div className='tableContainer'>
                    <Table data={employees} columns={employeeColumns}/>
                </div>
            </div>
		</div>
	);
}

export default EmployeeData;
