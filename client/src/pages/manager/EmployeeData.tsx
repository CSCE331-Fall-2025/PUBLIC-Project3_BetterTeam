import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import './EmployeeData.css'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'

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
    const [selectedEmployeeID, setSelectedEmployeeID] = useState<number | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<{name: string, ismanager: boolean, wage: number} | null>(null);
    const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'employee_id'>>({
        name: '',
        ismanager: false,
        wage: 0,
    })

    // hook that fetches the data
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // sends a fetch request to the backend route
                const response = await fetch(`${API_BASE}/api/manager/employee`);

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
            const response = await fetch(`${API_BASE}/api/manager/employee/${selectedEmployeeID}`, {
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

    const handleDeletion = async () => {
        if (!window.confirm('Delete this employee?')) {
            alert('employee saved...');
        } else{
            alert('Yeah lets delete this guy, lets delete this guy with database calls.');
            if(!selectedEmployeeID || !editedEmployee){
                alert('No selected employee to delete.');
                return;
            }

            try{
                const response = await fetch(`${API_BASE}/api/manager/employee/${selectedEmployeeID}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                });

                if(!response.ok){
                    throw new Error('Failed to delete employee');
                }

                setEmployees(prevEmployees =>
                    prevEmployees.filter(e => e.employee_id !== selectedEmployeeID)
                );

                setSelectedEmployeeID(null);
                setEditedEmployee(null);

                alert('Employee deleted successfully.');

            } catch(error){
                console.error('Deletion Error: ', error);
                alert('Error deleting employee.');
            }
        }
    };

    const handleAddFieldChange = (field: keyof Omit<Employee, 'employee_id'>, value: string | boolean | number) => {

        let finalValue: string | boolean | number = value;

        if(field === 'wage' && typeof value === 'string'){
            finalValue = parseFloat(value) || 0;
        }

        setNewEmployee(prev => ({
            ...prev,
            [field]: finalValue,
        }));
    };

    const handleAdd = async () => {
        if(!newEmployee.name || newEmployee.wage <= 0){
            alert('Please enter a valid name and wage.');
            return;
        }

        try{
            const response = await fetch(`${API_BASE}/api/manager/employee`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newEmployee), 
            });

            if(!response.ok){
                throw new Error('Failed to add employee');
            }

            const addedEmployee: Employee = await response.json();

            setEmployees(prevEmployees => [...prevEmployees, addedEmployee]);

            setNewEmployee({ name: '', ismanager: false, wage: 0 });

            alert(`Added ${addedEmployee.name} successfully`);

        } catch(error){
            console.error('Add Error: ', error);
            alert('Error adding employee.');
        }
    };

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
            <div className='textContainer'>
                <div className='editContainer'>
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
                            <button onClick={handleDeletion}>KILL</button>
                        </>
                    )}
                </div>
                <div className='addContainer'>
                    <Textbox 
                        value={newEmployee.name}
                        onChange={(newName) => handleAddFieldChange('name', newName)} 
                        placeholder='Enter name here...'
                    />
                    <Textbox 
                        value={String(newEmployee.wage)}
                        onChange={(newWage) => handleAddFieldChange('wage', newWage)} 
                        placeholder='Enter wage here...'
                    />
                    <select
                        value={String(newEmployee.ismanager)}
                        onChange={(e) => handleAddFieldChange('ismanager', e.target.value === 'true')}
                    >
                        <option value='' disabled>Is Manager?</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <button onClick={handleAdd}>Add Employee</button>
                </div>
            </div>
		</div>
	);
}

export default EmployeeData;
