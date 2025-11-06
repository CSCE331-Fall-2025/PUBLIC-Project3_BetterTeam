import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Appetizer',
    user: 'Cashier',
};

function CashierAppetizer() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CashierAppetizer;