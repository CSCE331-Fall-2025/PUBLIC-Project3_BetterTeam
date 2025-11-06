import { React } from 'react'
import GuestHeader from '../../components/GuestHeaderComponents/GuestHeader.tsx'

const page = {
    name: 'Menu-Board',
    user: 'Any',
};

function MenuBoard() {
    return(
        <GuestHeader name={page.name}/>
    );
}

export default MenuBoard;