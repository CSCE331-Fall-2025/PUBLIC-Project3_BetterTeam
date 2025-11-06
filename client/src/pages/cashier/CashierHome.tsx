import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Home',
    user: 'Cashier',
};

function CashierHome() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CashierHome;