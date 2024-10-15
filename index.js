import OpenAI from "openai";
import express from 'express';
import cors from 'cors'; 

const openai = new OpenAI({
    organization: "org-zGpMpkuaErkMYyszE4RidJtd",
    apiKey: "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",
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
  console.log(conversationHistory);

  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You have the personality of a cute Anime girl named Shiorin." },
      ...conversationHistory // Spread the conversation history
    ],
    model: "gpt-3.5-turbo-16k",
  });

  const botMessage = response.choices[0].message.content;

  // Add bot response to conversation history
  conversationHistory.push({ role: "assistant", content: botMessage });

  console.log(botMessage);

  res.json({
    message: botMessage,
  });
})

app.listen(port, () =>{
  console.log(`Example app listening at http://localhost:${port}`)
})