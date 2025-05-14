import React from 'react';
import './NavBar.css';
import { Link } from 'react-scroll';

const NavBar = () => {
    return (
        <div className='bg-slate-900 p-5 text-white'>
            <div className="logo font-bold text-2xl">
                <a href="/">CMMS</a>
            </div>

            <div className="menu">
                <ul>
                    <Link to='Home'>
                        <li>Home</li>
                    </Link>
                    <Link to='About'>
                        <li>About</li>
                    </Link>
                    <Link to='Dashboard'>
                        <li>Dashboard</li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;