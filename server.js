import "dotenv/config";
import http from 'http';
import './src/config/firebase.js'; // Ensure Firebase is initialized first
// import { Server } from 'socket.io';
import connectDB from './src/db/index.js';
import app from './app.js';
import Admin from './src/models/auth/auth.model.js';
import Customer from './src/models/Customer/user.model.js';
import { initSocket } from './src/socket/index.js';

const startServer = async () => {
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            console.error("❌ FATAL: ACCESS_TOKEN_SECRET is missing in .env");
            process.exit(1);
        }
        await connectDB();

        // Sync indexes to remove the unused 'phone_1' index causing duplicate key errors
        await Admin.syncIndexes();
        await Customer.syncIndexes();

        const server = http.createServer(app);
        // const io = new Server(server, {
        //     cors: {
        //         origin: "*",
        //         methods: ["GET", "POST"],
        //         credentials: true,
        //     },
        // });

initSocket(server);

    const port = process.env.PORT || 8000;


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
