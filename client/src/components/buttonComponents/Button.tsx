import React, { type MouseEvent } from 'react';
import './Button.css';

interface ButtonProps{
    name:string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

function Button({name, onClick}:  ButtonProps) {
    return (
        <button id={name} onClick={onClick}>{name}</button>
    );
}

export default Button