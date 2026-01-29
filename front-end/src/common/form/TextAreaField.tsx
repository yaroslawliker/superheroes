import "../form/form.css"
import { capitalize } from "../utils"


interface Props {
    fieldName: string
}

export default function TextAreField( {fieldName}: Props ) {
    return <div>
        <div className="field-name">{  capitalize(fieldName) }</div>
        <textarea
            className="input-box text-area"
            placeholder={"Enter " + fieldName.toLowerCase()}
        ></textarea>
    </div>
}