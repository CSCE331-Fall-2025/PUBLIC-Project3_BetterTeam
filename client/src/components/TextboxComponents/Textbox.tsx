import React from 'react';
import './Textbox.css';

interface TextProps{
    value: string;
    onChange: (newValue: string) => void;
    placeholder: string;
}

function Textbox( {value, onChange, placeholder}: TextProps ) {

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    }

    return (
        <div className='textbox'>
                <input
                type='text'
                id='inputName'
                value={value}
                onChange={handleValueChange}
                placeholder={placeholder}
                />
        </div>
    );
}

export default Textbox;
