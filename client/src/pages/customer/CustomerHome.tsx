import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Home',
    user: 'Customer',
};

function CustomerHome() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerHome;