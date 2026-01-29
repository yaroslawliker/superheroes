import "./form.css"
import { capitalize } from "../utils"

interface Props {
    fieldName: string,
}

export default function InputField( { fieldName }: Props) {
    return <div>
        <div className="field-name">{  capitalize(fieldName) }</div>
        <input
            className="input-box"
            placeholder={"Enter " + fieldName.toLowerCase()}
        ></input>
    </div>
}