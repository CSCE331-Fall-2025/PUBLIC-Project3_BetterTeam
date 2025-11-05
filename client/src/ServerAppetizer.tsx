import { React } from 'react'
import StaffHeader from './StaffHeader.tsx'
//import '../../server/ServerAppetizer.js'

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