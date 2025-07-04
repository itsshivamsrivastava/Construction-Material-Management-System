import React, { useState, useEffect } from "react";
import "./NavBar.css";
// import { Link } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";

const NavBar = () => {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // initial check

    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus); // for multi-tab support

    return () => {
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Fetch username from backend if logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      // If username is already in localStorage, use it
      if (user.username) {
        setUsername(user.username);
      } else {
        // Otherwise, fetch from backend
        fetch(`http://localhost:3000/api/auth/profile/id/${user._id}`)
          .then((res) => res.json())
          .then((data) => {
            setUsername(data.username);
          })
          .catch(() => setUsername("profile"));
      }
    }
  }, [isLoggedIn]);

  const handleClick = () => {
    setClick(!click);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/signin';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-avatar-btn')) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  const renderMobileMenuItems = () => (
    <ul className="text-center text-xl p-20 mobile-navbar-scroll">
      <Link to="/" onClick={handleClick}>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
          Home
        </li>
      </Link>
      <Link to="About" onClick={handleClick}>
        <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
          About
        </li>
      </Link>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" onClick={handleClick}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              Dashboard
            </li>
          </Link>
          <Link to={username ? `/profile/${username}` : "/profile"} onClick={handleClick}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              Profile
            </li>
          </Link>
          <Link to="/settings" onClick={handleClick}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              Settings
            </li>
          </Link>
          <li
            className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer"
            onClick={() => { handleClick(); handleLogout(); }}
          >
            Logout
          </li>
        </>
      ) : (
        <>
          <Link to="signin" onClick={handleClick}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              Sign In
            </li>
          </Link>
          <Link to="signup" onClick={handleClick}>
            <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded cursor-pointer">
              Sign Up
            </li>
          </Link>
        </>
      )}
    </ul>
  );

  const renderDesktopMenuItems = () => (
    <div className="menu lg:flex md:flex lg:flex-1 items-center font-normal hidden justify-end">
      <div className="flex items-center gap-4">
        <ul className="flex gap-8 text-[18px]">
          <Link to="/">
            <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="About">
            <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer">
              About
            </li>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard">
                <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer mr-5">
                  Dashboard
                </li>
              </Link>
              {/* <li
                className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li> */}
            </>
          ) : (
            <>
              <Link to="signin">
                <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer">
                  Sign In
                </li>
              </Link>
              <Link to="signup">
                <li className="hover:text-fuchsia-600 transition border-b-2 border-slate-900 hover:border-fuchsia-600 cursor-pointer">
                  Sign Up
                </li>
              </Link>
            </>
          )}
        </ul>
        {/* Admin Profile Dropdown */}
        {isLoggedIn && (
          <div className="relative flex items-center">
            <button
              className="profile-avatar-btn flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-blue-200 shadow hover:shadow-lg transition focus:outline-none"
              onClick={() => setProfileOpen((open) => !open)}
              aria-label="Admin profile menu"
            >
              <span style={{fontSize: '1.7rem'}} role="img" aria-label="Admin">🧑‍💼</span>
            </button>
            {profileOpen && (
              <div className="profile profile-dropdown absolute right-0 mt-50 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-blue-100 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium transition"
                  onClick={() => { setProfileOpen(false); navigate(username ? `/profile/${username}` : "/profile"); }}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700 font-medium transition"
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                >
                  Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium transition border-t border-blue-100"
                  onClick={() => { setProfileOpen(false); handleLogout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const content = (
    <>
      <div className="lg:hidden block fixed top-16 w-full left-0 right-0 bg-slate-900 transition z-50">
        {renderMobileMenuItems()}
      </div>
    </>
  );

  return (
    <nav className={`w-full ${click ? "z-50" : "z-40"}`}>
      <div className="h-10vh flex justify-between text-white bg-slate-900 lg:py-5 px-20 py-4">
        <div className="logo flex items-center flex-1">
          <span className="font-bold text-3xl">
            <a href="/">CMMS Portal</a>
          </span>
        </div>

        <div className="menu lg:flex md:flex lg: flex-1 items-center justify-end font-normal hidden">
          <div className="flex-10">{renderDesktopMenuItems()}</div>
        </div>
        <div>{click && content}</div>

        <button className="block sm:hidden transition" onClick={handleClick}>
          {click ? <FaTimes /> : <TiThMenu />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
