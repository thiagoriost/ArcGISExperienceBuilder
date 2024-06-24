import React from 'react'
import { Label, Select } from 'jimu-ui'; // import components
import './style.css'


const InputSelect = ({
    dataArray=[{value:1,label:"prueba1"},{value:2,label:"prueba2"}],
    onChange,
    value=undefined,
    label="Campo",
    placeHolder=`Seleccione  ${label}...`
}) => {
  return (
    <div className="mb-1">
        
        <Label size="default"> {label} </Label>        
        <Select
            onChange={onChange}
            placeholder={placeHolder}
            value={value}
        >
            {dataArray.map(
            (option) => (
                <option value={option.value}>{option.label}</option>
            )
            )}
        </Select>
    </div>
  )
}

export default InputSelect