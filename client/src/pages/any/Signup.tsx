import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Signup',
    user: 'Any',
};

function Signup() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default Signup;