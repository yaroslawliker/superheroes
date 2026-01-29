import "../form/form.css"
import { capitalize } from "../utils"
import type { Path, FieldValues, UseFormRegister } from "react-hook-form";
import Error from "./Error";


interface Props<T extends FieldValues> {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    error?: string
}

export default function TextAreField<T extends FieldValues>( { name, label, register, error }: Props<T>) {
    return <div>
        <div className="field-name">{  capitalize(label) }</div>
        <textarea
            {...register(name)}
            className="input-box text-area"
            placeholder={"Enter " + label.toLowerCase()}
        ></textarea>
        { error &&
            <Error>
                {error}
            </Error>
        }
    </div>
}