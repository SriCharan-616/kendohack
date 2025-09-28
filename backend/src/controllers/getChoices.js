import fetch from 'node-fetch';
import 'dotenv/config';

const BACKEND = process.env.BACKEND;
const KB_ID = process.env.KNOWLEDGE_BOX_ID;
const KB_TOKEN = process.env.KB_TOKEN;

export default async function getChoices(req, res) {
  try {
    
    let { name, currentEvent, previousEvents } = req.body;
  
    // Ensure we send strings to the prompt
    const prevText = (previousEvents || [])
      .map(ev => (typeof ev === 'string' ? ev : ev.title || ev.event || JSON.stringify(ev)))
      .join(' | ');
    const currText =
      typeof currentEvent === 'string'
        ? currentEvent
        : currentEvent?.title || currentEvent?.event || JSON.stringify(currentEvent);

    const prompt = `
    you are currently this character: ${name}
We have the following historical events:
Previous events: ${prevText}
Current event: ${currText}
the number in previous events and current event is for reference of timeflow. higher the number, later the event.

Based on these,  
Generate 3 possible decisions lincoln could take now:
1. The real historical decision if plausible.
2. An alternate but plausible decision.
3. A bold creative alternate decision.

There could be an ending where it is very different from history but it must be possible. so as long as possible
the choices can be different from history.
Make sure the choices have similar timeflow as the main timeline and they must reach an end
at a similar time as main timeline. The 3 choices should have choice description, and the fields in other choices.
new stats and new personality must be changed according to the choice u give.
If this choice is the final choice in the timeline, then mark end as true. Else mark it as false. also give a title for the event
Give the answer in json format with fields exactly like:
{
  "choice1": {"title":"...", "description": "...", "event":"...", "new_stats": {...}, "new_personality" : "..."},
  "choice2": {...},
  "choice3": {...},
  "end": true/false
}
`;
    console.log("Prompt to Nuclia:", prompt);
    const url = `${BACKEND}/v1/kb/${KB_ID}/ask`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NUCLIA-SERVICEACCOUNT': `Bearer ${KB_TOKEN}`,
      },
      body: JSON.stringify({
        query: prompt,
        max_answer_length: 500,
        temperature: 0.2,
        retrieve_count: 5,
      }),
    });

    const raw = await resp.text();

    // Split each JSON object by newline and parse only valid items
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

    // Remove markdown code blocks if present
    answerText = answerText.replace(/```/g, '').trim();

    // Extract JSON block
    let choices;
    try {
      const start = answerText.indexOf('{');
      const end = answerText.lastIndexOf('}');
      choices = JSON.parse(answerText.substring(start, end + 1));
    } catch (err) {
      console.error('Could not parse JSON from Nuclia answer:', answerText);
      return res.status(500).json({
        error: 'Nuclia answer not valid JSON',
        rawAnswer: answerText,
      });
    }

    // ✅ Ensure structure
    if (!choices.choice1 || !choices.choice2 || !choices.choice3) {
      return res.status(500).json({ error: 'Invalid structure', raw: choices });
    }

    res.json(choices);
  } catch (err) {
    console.error('Error querying KB:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
