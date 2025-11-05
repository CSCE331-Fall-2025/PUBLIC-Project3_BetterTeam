import { React } from 'react'
import StaffHeader from '../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Server-Appetizer',
    user: 'Server',
};

function ServerAppetizer() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default ServerAppetizer;