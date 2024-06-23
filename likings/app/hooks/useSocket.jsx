import { useEffect, useRef } from "react";
import io from "socket.io-client";

const server = process.env.NEXT_PUBLIC_SERVER_URL;

const useSocket = () => {
    // Use a ref to store the singleton socket instance
    const socketRef = useRef(null);

    // Initialize the socket only once
    if (!socketRef.current) {
        socketRef.current = io(server, {
            autoConnect: false, // Prevent auto-connection
        });
    }

    useEffect(() => {
        // Connect socket on mount
        socketRef.current.connect();

        return () => {
            // Disconnect socket on unmount
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef.current;
};

export default useSocket;
