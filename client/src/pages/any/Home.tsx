import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Home',
    user: 'Any',
};

function Home() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default Home;