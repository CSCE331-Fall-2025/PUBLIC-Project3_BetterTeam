import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Entree-Side',
    user: 'Customer',
};

function CustomerEntreeSide() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default CustomerEntreeSide;