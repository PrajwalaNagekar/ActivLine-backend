import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/db/index.js';
import app from './app.js';

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



        const port = process.env.PORT
        console.log(port);

        server.listen(port, '0.0.0.0', () => {
            console.log(`🚀!! Server running on ${port} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
        });
    } catch (err) {
        console.error('Server startup failed:', err);
        process.exit(1);
    }
};
startServer();
