import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { generate } from "./chatbot.js"

dotenv.config({
    path: './.env'
})

const app = express()

const port = process.env.PORT || 8000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("well to chatgpt")
})

app.post('/chat', async (req, res) => {
    const { message, threadId } = req.body

    if (!message || !threadId) {
        res.status(400).json({ message: 'All fields are required!' });
        return;
    }

    console.log('Message', message);

    const result = await generate(message, threadId);
    res.json({ message: result });
})


app.listen(port, () => {
    console.log(`server is running port no ${port}`);
})