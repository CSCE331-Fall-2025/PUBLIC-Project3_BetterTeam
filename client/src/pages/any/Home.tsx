import React from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Home',
    user: 'Any',
};

function Home() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default Home;