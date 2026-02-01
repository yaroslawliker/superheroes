import type { ReactNode } from "react"


interface Props {
    children: ReactNode
}

export default function SubmitButton( { children }: Props ) {
    return <button type="submit" className="button submit-button">
        {children}
    </button>


}