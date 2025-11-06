import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Cater',
    user: 'Customer',
};

function CustomerCater() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerCater;