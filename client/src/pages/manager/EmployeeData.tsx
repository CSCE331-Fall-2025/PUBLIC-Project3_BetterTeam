import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import './EmployeeData.css'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'

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
    const [selectedEmployeeID, setSelectedEmployeeID] = useState<number | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<{name: string, ismanager: boolean, wage: number} | null>(null);

    // hook that fetches the data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch('http://localhost:4000/api/manager/employee');

                if(!response.ok){
                    throw new Error('Failed to fetch employees');
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

    const selectedEmployee = employees.find(e => e.employee_id === selectedEmployeeID);

    const handleEmployeeSelect = (id: number) => {
        const employeeEdit = employees.find(e => e.employee_id === id);

        if(employeeEdit){
            setSelectedEmployeeID(id);
            setEditedEmployee({
                name: employeeEdit.name,
                ismanager: employeeEdit.ismanager,
                wage: employeeEdit.wage,
            });
        } else{
            setSelectedEmployeeID(null);
            setEditedEmployee(null);
        }
    };

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
        {header: 'Wage', accessor: (e) => e.wage},
    ];

    const handleFieldChange = (field: 'name' | 'wage' | 'ismanager', newValue: string | boolean) => {
        if(!editedEmployee) return;

        let finalValue: string | boolean | number = newValue;

        if(field === 'wage' && typeof newValue === 'string'){
            finalValue = parseFloat(newValue) || 0;
        }

        setEditedEmployee(prev => {
            if(!prev) return null;

            return({
                ...prev,
                [field]: finalValue,
            });
        });
    };

    const handleUpdate = async () => {
        if(!selectedEmployeeID || !editedEmployee){
            alert('No selected employee to change');
            return;
        }

        try{
            const response = await fetch(`http://localhost:4000/api/manager/employee/${selectedEmployeeID}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editedEmployee), 
            });

            if(!response.ok){
                throw new Error('Failed to update employee');
            }

            setEmployees(prevEmployees =>
                prevEmployees.map(e => 
                    e.employee_id === selectedEmployeeID ? { ...e, ...editedEmployee } : e
                )
            );

            setSelectedEmployeeID(null);
            setEditedEmployee(null);

            alert('Employee updated successfully.');

        } catch(error){
            console.error('Update Error: ', error);
            alert('Error updating employee.');
        }
    };

	return(
		<div className='employeeData'>
			<div className='employeeChart'>
				<Bar data={employeeChartData} />
			</div>
			<div className='tableContainer'>
				<Table data={employees} columns={employeeColumns}/>
			</div>
            <div className='textContainer'>
                <select onChange={(e) => handleEmployeeSelect(Number(e.target.value))} value={selectedEmployeeID ?? ''}>
                    <option value='' disabled>Select Employee</option>
                    {employees.map(e => (
                        <option key={e.employee_id} value={e.employee_id}>
                            {e.name}
                        </option>
                    ))}
                </select>
                {selectedEmployee && editedEmployee && (
                    <>
                        <p>Currently Editing {selectedEmployee.name}</p>
                        <Textbox 
                            value={editedEmployee.name} 
                            onChange={(newName) => handleFieldChange('name', newName)} 
                            placeholder='Enter new name here...'
                        />
                        <Textbox 
                            value={String(editedEmployee.wage)} 
                            onChange={(newWage) => handleFieldChange('wage', newWage)} 
                            placeholder='Enter new wage here...'
                        />
                        <select
                            value={String(editedEmployee.ismanager)}
                            onChange={(e) => handleFieldChange('ismanager', e.target.value === 'true')}
                        >
                            <option value='' disabled>Is Manager?</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        <button onClick={handleUpdate}>Update Employee</button>
                    </>
                )}
            </div>
		</div>
	);
}

export default EmployeeData;
