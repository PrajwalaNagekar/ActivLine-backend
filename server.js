import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import app from './server.js';
import { initializeSocketIO } from './socket/chat.socket.js';
import { restoreScheduledJobs } from './jobs/autoResumeScheduler.js';
import { restoreAgScheduledJobs } from './jobs/agAutoResumeScheduler.js';

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        initializeSocketIO(io);



        const port = process.env.PORT
        server.listen(port, '0.0.0.0', () => {
            console.log(`🚀!! Server running on http://0.0.0.0:${port} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        });
    } catch (err) {
        console.error('Server startup failed:', err);
        process.exit(1);
    }
};
startServer();
