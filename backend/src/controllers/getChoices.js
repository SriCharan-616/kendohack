import fetch from 'node-fetch';
import 'dotenv/config';

const BACKEND = process.env.BACKEND;
const KB_ID = process.env.KNOWLEDGE_BOX_ID;
const KB_TOKEN = process.env.KB_TOKEN;

export default async function getChoices(req, res) {
  try {
    const { currentEvent, previousEvents } = req.body;

    const prompt = `
We have the following historical events:
Previous events: ${previousEvents.join(' | ')}
Current event: ${currentEvent}
the number in previous events and current event is for reference of timeflow. higher the number, later the event.
you are lincoln at the current event now.

Based on these,  
Generate 3 possible decisions lincoln could take now:
1. The real historical decision if plausible.
2. An alternate but plausible decision.
3. A bold creative alternate decision.

There could be an ending where it is very different from history but it must be possible. so as long as possible
the choices can be different from history.
.make sure the choices have similar timeflow as the main timeline and they must reach an end
at a similar time as main timeline. the 3 choices should have choice description, and the the fielsd in other choices
if this choice is the final choice in the timeline, then mark end as true. else mark it as false. give the 
answer in json format with fields:
{
  "choice1": {"description": "...", "event":"...", "new_stats": {...}, "new_personality" : "...",
  "choice2": {...},
  "choice3": {...},
  end: true/false
}
`;

    const url = `${BACKEND}/v1/kb/${KB_ID}/ask`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NUCLIA-SERVICEACCOUNT': `Bearer ${KB_TOKEN}`
      },
      body: JSON.stringify({
        query: prompt,
        max_answer_length: 500,
        temperature: 0.2,
        retrieve_count: 5
      })
    });

    const raw = await resp.text();
    // split each JSON object by newline and parse only valid items
    const lines = raw.split('\n').filter(line => line.trim());
    let answerText = '';

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj.item?.type === 'answer') {
          answerText += obj.item.text;
        }
      } catch {
        continue;
      }
    }

    // remove markdown code blocks if present
    answerText = answerText.replace(/```/g, '').trim();

    // extract JSON block
    let choices;
    try {
      const start = answerText.indexOf('{');
      const end = answerText.lastIndexOf('}');
      choices = JSON.parse(answerText.substring(start, end + 1));
    } catch (err) {
      console.error('Could not parse JSON from Nuclia answer:', answerText);
      return res.status(500).json({ error: 'Nuclia answer not valid JSON', rawAnswer: answerText });
    }

    res.json(choices);

  } catch (err) {
    console.error('Error querying KB:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
