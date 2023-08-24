import React from "react";
import { FaSun } from "react-icons/fa";
import Container from "../Container";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();
  const handleSearchSubmit = (query) => {
    navigate("/movie/search?title=" + query);
  };

  return (
    <div className="bg-bordeaux shadow-sm shadow-gray-500">
      <Container className="p-1">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img className="h-10" src="./movies.png" alt="movies.logo" />
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2">
            <li>
              <button
                onClick={toggleTheme}
                className="dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <FaSun className="text-secondary" />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                inputClassName="border-dark-subtle text-white focus:border-white sm:w-auto w-40"
                onSubmit={handleSearchSubmit}
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
