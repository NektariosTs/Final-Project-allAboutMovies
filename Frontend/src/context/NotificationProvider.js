import React, { createContext, useState } from 'react'

export const NotificationContext = createContext();

let timeoutId; // create a variable
// messages (cases) for success warning error default for the user when he tries to create to sign up
export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState("");
    const [classes, setClasses] = useState("");

    const updateNotification = (type, value) => {
        if (timeoutId) clearTimeout(timeoutId);

        switch (type) {
            case "error":
                setClasses("bg-red-500")
                break;
            case "success":
                setClasses("bg-green-500")
                break;
            case "warning":
                setClasses("bg-orange-500")
                break;
            default:
                setClasses("bg-red-500")
        }
        setNotification(value);
        timeoutId = setTimeout(() => {
            setNotification("");
        }, 3000);
     // i create the timeoutId because with this way the we clear the timeout and we don t have lag in the button choises notifications 
    };


    return (
        <NotificationContext.Provider value={{ updateNotification }}>
            {children}
            {notification && (
                <div className="fixed left-1/2 -translate-x-1/2 top-24 shadow-md shadow-gray-400 rounded">
                    <p className={classes + " text-white px-4 py-2 font-serif"}>
                        {notification}
                    </p>
                </div>
            )}
        </NotificationContext.Provider>
    );
}//maybe i will use some css styling
