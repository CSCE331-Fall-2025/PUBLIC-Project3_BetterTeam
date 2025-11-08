import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Drink',
    user: 'Customer',
};

function CustomerDrink() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerDrink;