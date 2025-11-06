import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Checkout',
    user: 'Customer',
};

function CustomerCheckout() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerCheckout;