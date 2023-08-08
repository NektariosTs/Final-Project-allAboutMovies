import React from "react";

//title component for cleaner code 
export default function Title({ children }) {
  return (
    <h1 className="text-xl  dark:text-white text-secondary font-serif text-center">{children}</h1>
  );
}
