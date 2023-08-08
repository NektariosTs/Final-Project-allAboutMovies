import React from "react";
//separate the code and add the FormContainer because we want cleaner code in our components so copy paste the div for background color and all the taiwind styles and i replace this FormContainer with all div
export default function FormContainer({ children }) {
  return (
    <div className="fixed inset-0 dark:bg-danger bg-white -z-10 flex justify-center items-center">
      {children}
    </div>
  );
}
