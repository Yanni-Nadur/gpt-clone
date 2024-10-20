import OpenAI from "openai";
import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const organization = process.env.ORGANIZATION;
const apiKey = process.env.API_KEY;

const openai = new OpenAI({
    organization: organization,
    apiKey: apiKey,
});

const app = express()
const port = 3080

app.use(cors());
app.use(express.json());


let conversationHistory = []; 

app.post('/', async (req, res) =>{
  const { message } = req.body;

  // Add user message to conversation history
  conversationHistory.push({ role: "user", content: message });

  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Você tem a personalidade de uma linda garota de anime chamada Shiorin." },
      ...conversationHistory // Spread the conversation history
    ],
    model: "gpt-3.5-turbo-16k",
  });

  const botMessage = response.choices[0].message.content;

  // Add bot response to conversation history
  conversationHistory.push({ role: "assistant", content: botMessage });

  res.json({
    message: botMessage,
  });
})

app.listen(port, () =>{
  console.log(`App listening at http://localhost:${port}`)
})