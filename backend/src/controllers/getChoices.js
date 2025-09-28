import fetch from 'node-fetch';
import 'dotenv/config';

const BACKEND = process.env.BACKEND;
const KB_ID = process.env.KNOWLEDGE_BOX_ID;
const KB_TOKEN = process.env.KB_TOKEN;

export default async function getChoices(req, res) {
  try {
    let { 
      name, 
      currentEvent, 
      previousEvents, 
      currentStats = {}, 
      currentPersonality = "", 
      eventNumber = 0, 
      maxEvents = 0,
      timePeriod = "",
      characterAge = ""
    } = req.body;

    // Ensure we send strings to the prompt
    const prevText = (previousEvents || [])
      .map(ev => {
        if (typeof ev === 'string') return ev;
        if (ev.title && ev.event) return `${ev.id || eventNumber - 1}. ${ev.title}: ${ev.event}`;
        return ev.title || ev.event || JSON.stringify(ev);
      })
      .join(' | ');
    
    const currText = typeof currentEvent === 'string'
      ? currentEvent
      : `${eventNumber}. ${currentEvent?.title || 'Current Event'}: ${currentEvent?.event || currentEvent?.description || JSON.stringify(currentEvent)}`;

  const end = maxEvents - eventNumber ;

    // Create comprehensive prompt
    const prompt = `
HISTORICAL DECISION GENERATOR - UNIVERSAL PROMPT
SYSTEM ROLE: You are an advanced historical simulation AI that generates realistic decision scenarios for any historical figure.

CHARACTER CONTEXT:
- Name: ${name}
- Time Period: ${timePeriod || "Ancient/Medieval/Modern Era"}
- Current Age: ${characterAge || "Unknown"}

CURRENT SITUATION:
Previous Events Timeline: ${prevText}
Current Critical Event: ${currText}
Event Number: ${eventNumber} 
In ${end} number of events the character will reach their end. Give according
to that.

CHARACTER STATE:
Current Stats: ${JSON.stringify(currentStats)}
Current Personality: ${currentPersonality}


TASK REQUIREMENTS:
Generate exactly 3 distinct decision paths for ${name} at this critical moment:

CHOICE 1 - HISTORICAL ACCURACY:
- If this is a documented historical moment, provide the actual decision made
- If undocumented, provide the most historically plausible decision
- Must align with known historical patterns and character behavior

CHOICE 2 - PLAUSIBLE ALTERNATIVE:
- A realistic alternative that fits the time period, culture, and available options
- Should consider what other leaders of that era might have done
- Must be achievable with the resources and knowledge available then

CHOICE 3 - BOLD ALTERNATIVE:
- A creative but still historically possible decision
- Can deviate significantly from history but must be plausible for the era
- Should consider the character's unique traits and circumstances

OUTPUT FORMAT (STRICT JSON):
{
  "choice1": {
    "title": "Concise decision title (max 8 words)",
    "description": "explanation of ${name}'s decision, motivations, and reasoning (1 short sentences)",
    "event": "Immediate consequences and reactions to this decision (1 short sentence)",
    "new_age": "new age different from current event age",
    "new_year": "new year different from current event year",
    "new_stats": {...}(new stats based on this choice),
    "new_personality": "How this decision changes or reinforces ${name}'s character traits and worldview (1-2 sentences)"
  },
  "choice2": {
    same format as choice 1 but with a different, plausible decision
  },
  "choice3": {
    same format as choice 2 but with a more radical decision
  },
  "end": ${eventNumber == maxEvents + 1  ? 'true' : 'false'}
}

CRITICAL INSTRUCTIONS:
1. Each choice MUST be meaningfully different from the others
2. Consider ${name}'s current personality when crafting decisions
3. All stats changes must be justified by the decision's likely consequences
4. Descriptions should capture the character's voice and thinking process
5. Events should feel authentic to the historical period
6. NO placeholder text - provide complete, specific content for every field
7. Ensure JSON is properly formatted with no syntax errors
8. DO NOT mention Lincoln specifically unless the character IS Lincoln

HISTORICAL AUTHENTICITY CHECKLIST:
✓ Decisions reflect available technology and knowledge of the era
✓ Social, political, and cultural constraints of the time period considered
✓ Consequences align with realistic cause-and-effect for that era
✓ Language and concepts appropriate to the historical context

`;

    console.log(prompt);
    
    const url = `${BACKEND}/v1/kb/${KB_ID}/ask`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NUCLIA-SERVICEACCOUNT': `Bearer ${KB_TOKEN}`,
      },
      body: JSON.stringify({
        query: prompt,
        max_answer_length: 1000, // Increased for more detailed responses
        temperature: 0.7, // Increased for more creative variety
        retrieve_count: 8, // Increased for better context
        top_k: 10, // Add top_k for better response quality
        top_p: 0.9, // Add top_p for controlled creativity
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

    // Remove markdown code blocks and clean up
    answerText = answerText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^\s*json\s*/i, '')
      .trim();

    // Extract JSON block with better error handling
    let choices;
    try {
      const start = answerText.indexOf('{');
      const end = answerText.lastIndexOf('}');
      
      if (start === -1 || end === -1 || start >= end) {
        throw new Error('No valid JSON structure found');
      }
      
      const jsonString = answerText.substring(start, end + 1);
      choices = JSON.parse(jsonString);
    } catch (err) {
      console.error('Could not parse JSON from Nuclia answer:', answerText);
      
      return res.status(500).json({
        error: 'Nuclia answer not valid JSON, using fallback',
        rawAnswer: answerText,
        fallback: fallbackChoices
      });
    }

    

    res.json(choices);
    
  } catch (err) {
    console.error('Error querying KB:', err);
    res.status(500).json({ 
      error: 'Server error', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}


