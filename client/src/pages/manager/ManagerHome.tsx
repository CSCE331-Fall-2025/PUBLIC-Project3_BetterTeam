import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Home',
    user: 'Manager',
};

function ManagerHome() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default ManagerHome;