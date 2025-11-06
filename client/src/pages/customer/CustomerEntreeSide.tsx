import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Entree-Side',
    user: 'Customer',
};

function CustomerEntreeSide() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default CustomerEntreeSide;