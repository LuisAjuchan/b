
import { createContext, useState, useContext } from "react";

const NotificationContext = createContext();
export const notificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type },
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
