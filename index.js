import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import codeRoutes from './routes/code.routes.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get("/", (req, res) => {
    console.log("Hello World");
    res.send("Hello World");
});

app.use('/code', codeRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));