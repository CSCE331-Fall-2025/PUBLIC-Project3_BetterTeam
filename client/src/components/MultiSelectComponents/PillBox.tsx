import { useState, useEffect } from 'react'
import Select, { components } from 'react-select'
import type { MultiValue, OptionProps } from 'react-select'
import './PillBox.css'

export interface Options {
    value: number;
    label: string;
}

const Option = (props: OptionProps<Options, true>) => {
    return(
        <components.Option {...props}>
            <input 
                type='checkbox'
                checked={props.isSelected}
                onChange={() => null}
            />
            <label style={{marginLeft: '10px', cursor: 'pointer'}}>{props.label}</label>
        </components.Option>
    )
}

interface PillBoxProps {
    availableOptions: Options[];
    initialOptions?: MultiValue<Options>;
    label: string;
    placeholder?: string;
    onSelectionChange?: (selected: MultiValue<Options>) => void;
}

const PillBox = ({ availableOptions, initialOptions = [], label, placeholder, onSelectionChange }: PillBoxProps) => {
    
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<Options>>(initialOptions);

    useEffect(() => {
        setSelectedOptions(initialOptions);
    }, [initialOptions]);

    const handleChange = (selected: MultiValue<Options>) => {
        setSelectedOptions(selected);

        if(onSelectionChange){
            onSelectionChange(selected);
        }
    };

    return(
        <div className='pillBox'>
            <label htmlFor='Inventory Select'>{label}</label>
            <Select
            inputId='Inventory-Select'
            isMulti
            options={availableOptions}
            value={selectedOptions}
            onChange={handleChange}
            placeholder={placeholder}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option }}
            classNamePrefix='react-select'
            />
        </div>
    );
};

export default PillBox;