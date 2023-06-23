import express, { Application,Router } from "express";
import { connectDatabase } from "./db";
const userRoutes = require('./routes/user.route.js')
const feedRoutes = require('./routes/feed.route.js')
const logRoutes = require('./routes/logs.route.js')
const app: Application = express();
const port = 3001;
    async function startServer() {
        const connection = await connectDatabase()
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/user', userRoutes);
        app.use('/feed', feedRoutes);
        app.use('/logs', logRoutes);
        try {
            app.listen(port, (): void => {
                console.log(`Connected successfully on port ${port}`);
            });
        } catch (error) {
            console.error(`Error occured: ${error.message}`);
        }
    }
startServer()
