import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Entree/Side',
    user: 'Cashier',
};

function CashierDish() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CashierDish;
