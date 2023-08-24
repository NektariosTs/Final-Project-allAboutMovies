import React from "react";


export default function GenresSelector({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center space-x-2 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary rounded"
    >
      
      <span>Select Genres</span>
    </button>
  );
}
