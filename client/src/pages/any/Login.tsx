import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Login',
    user: 'Any',
};

function Login() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default Login;