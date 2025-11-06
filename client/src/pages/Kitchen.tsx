import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Kitchen',
    user: 'Kitchen',
};

function Kitchen() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default Kitchen;