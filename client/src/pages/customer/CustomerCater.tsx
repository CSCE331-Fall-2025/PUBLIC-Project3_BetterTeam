import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Cater',
    user: 'Customer',
};

function CustomerCater() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerCater;