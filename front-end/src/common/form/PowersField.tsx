import { useState } from "react";
import { capitalize } from "../utils";
import { type FieldValues, type ArrayPath, type PathValue, type Control, useFieldArray } from "react-hook-form";


interface Props<T extends FieldValues> {
    name: ArrayPath<T>;
    label: string;
    control: Control<T>;
    error?: string
}

interface SuperpowerItem {
    id: string;
    name: string;
}

export default function PowersField<T extends FieldValues>( { name, label, control }: Props<T>) {

    const [ power, setPower ] = useState('');

    const { fields, append, remove } = useFieldArray({
        control,
        name: name
    });

    function handleAddPower() {
        if (!power.trim()) return;   

        append({ name: power } as PathValue<T, ArrayPath<T>>[number]); 
        setPower('');
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddPower();
        }
    };
    
    return <div className="powers-field">
        <div className="field-name">{  capitalize(label) }</div>

        <div className="powers-input-bar">
            <input
                className="input-box"
                placeholder={"Enter " + label.toLowerCase()}
                value={power}
                onChange={(e) => setPower(e.target.value)}
                onKeyDown={handleKeyDown}
            ></input>
            <button className="button plus-button"
                type="button"
                onClick={handleAddPower}
            >+</button>
        </div>

        <div className="powers">
            {fields.map((field, index) => {
                const item = field as unknown as SuperpowerItem;

                return (
                    <Power 
                        key={item.id}
                        text={item.name}
                        onRemove={() => remove(index)}
                    />
                );
            })}
        </div>
        
    </div>
}


interface PowerProps {
    text: string;
    onRemove: () => void;
}

function Power( { text, onRemove }: PowerProps) {
    return <div className="power">
        <div className="power-text">{text}</div>
        <button 
            className="power-cancel-button"
            type="button"
            onClick={onRemove}
        >x</button>
    </div>
}
