import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSun } from "react-icons/fa";
import { useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";
import { useNavigate } from "react-router-dom";

export default function Header({ onAddMovieClick, onAddActorClick }) {
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTheme } = useTheme();

  const navigate = useNavigate();

  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];

  //as soon as we press enter inside the search form it will grab this query and if there is no query will return otherwise will want to navigate to this search component where we will add this route ("/search?title=" + query);
  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;

    navigate("/search?title=" + query);
  };

  return (
    <div className="flex items-center justify-between relative">
      <AppSearchForm
        onSubmit={handleSearchSubmit}
        placeholder="Search movies.."
      />

      <div className="flex items-center space-x-3">
        <button onClick={toggleTheme} className="dark:text-white text-danger">
          <FaSun size={24} />
        </button>
        {/* we using this button to display and hide this options*/}
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle  dark:text-dark-subtle text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>
        {/* we rendering this component because of two options component */}
        <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        />
      </div>
    </div>
  );
}

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerID = useRef();
  // we sue the handleClose function inside the useEffect and we use some animation-scale , so we go with the if statement and if is not visible return the lower code .
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id } = e.target;
      if (parentElement.id === containerID || id === containerID) return;

      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };
    //we use addEventListener because if we click around in the page the create button close automatically
    document.addEventListener("click", handleClose);
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);
  // closing the option of add movie and add actor
  const handleClick = (fn) => {
    fn();
    onClose();
  };

  if (!visible) return null; //if its false return the entire component
  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 top-12 z-50 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={(e) => {
        if (e.target.classList.contains("animate-scale-reverse")) onClose();
        e.target.classList.remove("animate-scale");
      }}
    >
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
