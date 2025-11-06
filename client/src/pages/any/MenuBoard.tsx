import { React } from 'react'
import StaffHeader from '../../components/StaffHeaderComponents/StaffHeader.tsx'

const page = {
    name: 'Menu-Board',
    user: 'Any',
};

function MenuBoard() {
    return(
        <StaffHeader name={page.name}/>
    );
}

export default MenuBoard;