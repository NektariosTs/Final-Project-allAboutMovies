import React from "react";
import { FaSun } from "react-icons/fa";
import Container from "../Container";
import { Link } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  return (
    <div className="bg-bordeaux shadow-sm shadow-gray-500">
      <Container className="p-1">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img className="h-10" src="./movies.png" alt="movies.logo" />
          </Link>

          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <FaSun className="text-secondary" />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-red-950 text-xs outline-none"
                placeholder="Search"
              />
            </li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="font-sherif text-amber-50"
              >
                Log out
              </button>
            ) : (
              <Link className="font-sherif text-amber-50" to="/auth/signIn">
                Login
              </Link>
            )}
          </ul>
        </div>
      </Container>
    </div>
  );
}
