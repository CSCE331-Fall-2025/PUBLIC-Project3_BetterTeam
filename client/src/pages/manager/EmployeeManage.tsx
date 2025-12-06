import { useState, useEffect } from 'react'
import Table, { type ColumnDefinition } from '../../components/TableComponents/Table.tsx'
import Textbox from '../../components/TextboxComponents/Textbox.tsx'
import './EmployeeManage.css'

const API_BASE = import.meta.env.VITE_API_BASE;

interface Employee {
    employee_id: number;
    name: string;
    ismanager: boolean;
    wage: number;
    email: string;
    password: string;
}

function EmployeeManage() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployeeID, setSelectedEmployeeID] = useState<number | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<{name: string, ismanager: boolean, wage: number} | null>(null);
    const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'employee_id'>>({
        name: '',
        ismanager: false,
        wage: 0,
        email: '',
        password: '',
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

    const employeeColumns: ColumnDefinition<Employee>[] = [
        {header: 'Employee Id', accessor: (e) => e.employee_id },
        {header: 'Employee Name', accessor: (e) => e.name },
        {header: 'Is Manager?', accessor: (e) => (e.ismanager ? 'Yes' : 'No') },
        {header: 'Wage', accessor: (e) => e.wage},
        {header: 'Email', accessor: (e) => e.email},
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
            alert('Deleting employee.');
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
        if(!newEmployee.email || !newEmployee.email.includes('@') || !newEmployee.email.includes('.')){
            alert('Please enter a valid email.')
            return;
        }
        if(!newEmployee.password){
            alert('Please enter a valid password.')
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

            setNewEmployee({ name: '', ismanager: false, wage: 0, email: '', password: ''});

            alert(`Added ${addedEmployee.name} successfully`);

        } catch(error){
            console.error('Add Error: ', error);
            alert('Error adding employee.');
        }
    };

    return(
        <div className='employeeData'>
            <div className='employeeDisplays'>
                <div className='tableContainer'>
                    <Table data={employees} columns={employeeColumns}/>
                </div>
            </div>
            <div className='textContainer'>
                <div className='editContainer'>
                    <h2>Edit Employee</h2>
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
                            <h3>Name</h3>
                            <Textbox 
                                value={editedEmployee.name} 
                                onChange={(newName) => handleFieldChange('name', newName)} 
                                placeholder='Enter new name here...'
                            />
                            <h3>Wage</h3>
                            <Textbox 
                                value={String(editedEmployee.wage)} 
                                onChange={(newWage) => handleFieldChange('wage', newWage)} 
                                placeholder='Enter new wage here...'
                            />
                            <h3>Are they a manager?</h3>
                            <select
                                value={String(editedEmployee.ismanager)}
                                onChange={(e) => handleFieldChange('ismanager', e.target.value === 'true')}
                            >
                                <option value='' disabled>Is Manager?</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                            <div>
                                <button onClick={handleUpdate}>Update Employee</button>
                                <button onClick={handleDeletion}>Fire Employee</button>
                            </div>
                        </>
                    )}
                </div>
                <div className='addContainer'>
                    <h2>Add new Employee</h2>
                    <h3>Name</h3>
                    <Textbox 
                        value={newEmployee.name}
                        onChange={(newName) => handleAddFieldChange('name', newName)} 
                        placeholder='Enter name here...'
                    />
                    <h3>Wage</h3>
                    <Textbox 
                        value={String(newEmployee.wage)}
                        onChange={(newWage) => handleAddFieldChange('wage', newWage)} 
                        placeholder='Enter wage here...'
                    />
                    <h3>Are they a manager?</h3>
                    <select
                        value={String(newEmployee.ismanager)}
                        onChange={(e) => handleAddFieldChange('ismanager', e.target.value === 'true')}
                    >
                        <option value='' disabled>Is Manager?</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                    <h3>Email</h3>
                    <Textbox 
                        value={newEmployee.email}
                        onChange={(newEmail) => handleAddFieldChange('email', newEmail)} 
                        placeholder='Enter email here...'
                    />
                    <h3>Password</h3>
                    <Textbox 
                        value={String(newEmployee.password)}
                        onChange={(newPass) => handleAddFieldChange('password', newPass)} 
                        placeholder='Enter password here...'
                    />
                    <div>
                        <button onClick={handleAdd}>Add Employee</button>
                    </div>
                </div>
            </div>
		</div>
    )
}

export default EmployeeManage;
