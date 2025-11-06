import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Appetizer',
    user: 'Customer',
};

function CustomerAppetizer() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerAppetizer;