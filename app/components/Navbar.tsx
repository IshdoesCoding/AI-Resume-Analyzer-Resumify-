import React from 'react'
import { Link } from 'react-router';

const Navbar: () => React.JSX.Element = () => {
    return (
        <nav className = "navbar">
            <Link to="/">
            <p className="text-2xl font-bold text-gradient"> Resumify</p>
        </Link>
            <Link to="/upload">
            <p className="primary-button w-fit"> Upload Resume </p>
        </Link>
        </nav>

    )

}
export default Navbar;

