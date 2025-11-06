import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Home',
    user: 'Customer',
};

function CustomerHome() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerHome;