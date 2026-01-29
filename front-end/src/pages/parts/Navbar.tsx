import { Link } from "react-router-dom"
import "./parts.css"


export default function Navbar() {

    return <nav className="navbar">
        <ul>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/create">Create a new hero</Link></li>
            <li><Link to="/">Heroes</Link></li>
        </ul>
    </nav>

}