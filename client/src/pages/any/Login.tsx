import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Login',
    user: 'Any',
};

function Login() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default Login;