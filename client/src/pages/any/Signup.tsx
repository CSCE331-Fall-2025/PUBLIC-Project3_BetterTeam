import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Signup',
    user: 'Any',
};

function Signup() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default Signup;