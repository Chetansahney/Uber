import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_BASE_URL, {
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.disconnect();
        };
    }, []);

    const value = useMemo(() => {
        const sendMessage = (eventName, payload) => {
            if (!socketRef.current) {
                return false;
            }
            socketRef.current.emit(eventName, payload);
            return true;
        };

        const receiveMessage = (eventName, handler) => {
            if (!socketRef.current) {
                return () => {};
            }
            socketRef.current.on(eventName, handler);
            return () => socketRef.current.off(eventName, handler);
        };

        return { sendMessage, receiveMessage };
    }, []);

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
