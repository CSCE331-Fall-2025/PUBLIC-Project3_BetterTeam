import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Order-Trends',
    user: 'Manager',
};

function OrderTrends() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default OrderTrends;