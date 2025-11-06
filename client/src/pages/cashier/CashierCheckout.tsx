import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Checkout',
    user: 'Cashier',
};

function CashierCheckout() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CashierCheckout;