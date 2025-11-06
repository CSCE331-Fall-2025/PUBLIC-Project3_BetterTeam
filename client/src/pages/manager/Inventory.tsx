import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Inventory',
    user: 'Manager',
};

function Inventory() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default Inventory;