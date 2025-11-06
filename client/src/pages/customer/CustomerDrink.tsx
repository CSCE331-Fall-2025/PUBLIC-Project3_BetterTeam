import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Drink',
    user: 'Customer',
};

function CustomerDrink() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerDrink;