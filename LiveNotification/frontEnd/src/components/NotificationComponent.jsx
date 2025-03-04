import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on("receiveNotification", (data) => {
            setNotifications((prev) => [data, ...prev]);
        });

        return () => socket.off("receiveNotification");
    }, []);

    const sendNotification = () => {
        const newNotification = {
            message: "New order received!",
            time: new Date().toLocaleTimeString(),
        };
        socket.emit("sendNotification", newNotification);
    };

    return (
        <div>
            <button onClick={sendNotification}>Send Notification</button>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>
                        {notif.message} - {notif.time}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
