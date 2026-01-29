import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

import "./form.css"
import { capitalize } from "../utils"
import Error from "./Error";

interface Props<T extends FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    error?: string
}

export default function InputField<T extends FieldValues>( { name, label, register, error }: Props<T>) {
    return <div>
        <div className="field-name">{ capitalize(label) }</div>
        <input
            {...register(name)}
            className="input-box"
            placeholder={"Enter " + label.toLowerCase()}
        ></input>
        { error &&
            <Error>
                {error}
            </Error>
        }
    </div>
}