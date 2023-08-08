import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks";

export default function Navbar() {
  const { handleLogout } = useAuth();
  return (
    //side Navbar
    <nav className="w-48 min-h-screen bg-bordeaux shadow-sm shadow-gray-500">
      <div className="flex flex-col justify-between pl-5 h-screen sticky top-0">
        <ul>
          <li>
            <Link to="/">
              <img src="./allAboutMovies.png" alt="logo" className="h-14 p-2" />
            </Link>
          </li>

          <li>
            <NavItem to="/">Home</NavItem>
          </li>
          <li>
            <NavItem to="/movies">Movies</NavItem>
          </li>
          <li>
            <NavItem to="/actors">ACtors</NavItem>
          </li>
        </ul>

        <div className="flex flex-col items-start">
          <span className="font-serif text-white text-xl">Admin</span>
          <button
            onClick={handleLogout}
            className="flex items-center text-dark-subtle hover:text-white transition space-x-1"
          >
            <FiLogOut />
            <span> Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
//component for the links in the navbar
const NavItem = ({ children, to }) => {
  return (
    <NavLink
      className={({ isActive }) => (isActive ? "text-white" : " text-gray-400")}
      to={to}
    >
      {children}
    </NavLink>
  );
};
