import type { ReactNode } from "react";
import "./form.css"


interface Props {
    children: ReactNode;
}


export default function Error( {children}: Props ) {
    return <div className="field-error">
        {children}
    </div>
}