import { useContext } from "react"
import { ThemeContext } from "../context/ThemeChanger"
import { NotificationContext } from "../context/NotificationProvider";
import { AuthContext } from "../context/AuthProvider";

export const useTheme = () => useContext(ThemeContext);
export const useNotification = () => useContext(NotificationContext);
export const useAuth= () => useContext(AuthContext);
