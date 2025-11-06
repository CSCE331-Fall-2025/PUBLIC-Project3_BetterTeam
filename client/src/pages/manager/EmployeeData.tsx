import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Employee-Data',
    user: 'Manager',
};

function EmployeeData() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default EmployeeData;