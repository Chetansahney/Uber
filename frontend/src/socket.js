import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BASE_URL, {
    transports: ['websocket'],      // ✅ force websocket
    reconnectionAttempts: 5,        // ✅ retry on failure
    reconnectionDelay: 1000,
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id); // ✅ confirm connection
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message); // ✅ see exact error
});

export default socket;