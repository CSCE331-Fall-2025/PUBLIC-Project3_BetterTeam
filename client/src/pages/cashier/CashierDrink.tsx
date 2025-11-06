import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Drink',
    user: 'Cashier',
};

function CashierDrink() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CashierDrink;