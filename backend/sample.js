import fetch from 'node-fetch';
import 'dotenv/config';

const BACKEND = process.env.BACKEND;
const KB_ID = process.env.KNOWLEDGE_BOX_ID;
const KB_TOKEN = process.env.KB_TOKEN;

// Question to ask
const question = "Summarize the key events from the uploaded history file";

async function askKB() {
  try {
    const url = `${BACKEND}/v1/kb/${KB_ID}/ask`; // POST endpoint
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NUCLIA-SERVICEACCOUNT': `Bearer ${KB_TOKEN}`
      },
      body: JSON.stringify({
        query: question,
        max_answer_length: 500,
        temperature: 0.2,
        retrieve_count: 5
      })
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Response not JSON:", text);
      return;
    }

    console.log("Answer:", data.answer || "No answer found");
    console.log("Sources:", data.sources || []);

  } catch (err) {
    console.error("Error querying KB:", err);
  }
}

askKB();
