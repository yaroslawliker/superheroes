import { Link } from "react-router-dom"
import "./common.css"


export default function Footer() {

    return <nav className="footer">
        <div className="message">
            A web-site about superheroes.
        </div>
        <div className="message">
            <Link to="/about">About</Link>
        </div>
    </nav>

}