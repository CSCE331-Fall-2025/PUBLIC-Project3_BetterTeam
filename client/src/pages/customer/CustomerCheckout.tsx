import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Checkout',
    user: 'Customer',
};

function CustomerCheckout() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerCheckout;