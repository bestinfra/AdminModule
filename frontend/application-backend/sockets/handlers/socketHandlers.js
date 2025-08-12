import { getIO, emitToAll, emitToRoom, joinRoom, leaveRoom } from '../index.js';

export function handleUserAuth(socketId, userId) {
    const io = getIO();
    if (!io) return;

    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
        socket.join(`user_${userId}`);
        socket.userId = userId;
        
        console.log(`👤 User ${userId} authenticated and joined room: user_${userId}`);
        
        emitToRoom(`user_${userId}`, 'welcome', {
            message: `Welcome user ${userId}!`,
            timestamp: new Date().toISOString()
        });
    }
}

export function sendNotification(userId, notification) {
    emitToRoom(`user_${userId}`, 'notification', {
        ...notification,
        timestamp: new Date().toISOString()
    });
}

export function handleTicketUpdate(ticketId, update) {
    emitToRoom(`ticket_${ticketId}`, 'ticket_update', {
        ticketId,
        ...update,
        timestamp: new Date().toISOString()
    });
}

export function handleMeterReading(meterId, reading) {
    emitToRoom(`meter_${meterId}`, 'meter_reading', {
        meterId,
        ...reading,
        timestamp: new Date().toISOString()
    });
}

export function sendAnnouncement(announcement) {
    emitToAll('announcement', {
        ...announcement,
        timestamp: new Date().toISOString()
    });
}

export function handleUserLogout(socketId, userId) {
    const io = getIO();
    if (!io) return;

    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
        socket.leave(`user_${userId}`);
        delete socket.userId;
        
        console.log(`👤 User ${userId} logged out and left room: user_${userId}`);
    }
}

export function getUserSocketId(userId) {
    const io = getIO();
    if (!io) return null;

    for (const [socketId, socket] of io.sockets.sockets) {
        if (socket.userId === userId) {
            return socketId;
        }
    }
    return null;
}


export function isUserOnline(userId) {
    return getUserSocketId(userId) !== null;
}

export default {
    handleUserAuth,
    sendNotification,
    handleTicketUpdate,
    handleMeterReading,
    sendAnnouncement,
    handleUserLogout,
    getUserSocketId,
    isUserOnline
}; 