import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './connection.js';
import codeRoutes from './routes/code.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT;

// The main function responsible for starting the server.
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

    } catch (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
}

// Middleware setup for parsing JSON, handling cookies, and enabling CORS.
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://ai-code-reviewer-eight-smoky.vercel.app",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get("/", (req, res) => {
    console.log("Hello World");
    res.send("Hello World");
});

// The routes for code review, authentication and user management.
app.use('/code', codeRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

startServer();