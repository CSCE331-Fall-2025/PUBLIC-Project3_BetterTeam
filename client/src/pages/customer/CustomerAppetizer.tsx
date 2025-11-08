import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Appetizer',
    user: 'Customer',
};

function CustomerAppetizer() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerAppetizer;