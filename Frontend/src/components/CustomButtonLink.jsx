import React from "react";

export default function CustomButtonLink({ label, clickable = true , onClick }) {
  const className = clickable
    ? "text-primary dark:text-white hover:underline"
    : "text-primary dark:text-white cursor-default";
  return (
    <button onClick={onClick} className={className} type="button">
      {label}
    </button>
  );
}
