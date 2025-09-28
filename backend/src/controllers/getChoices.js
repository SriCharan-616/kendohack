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
      maxEvents = 10,
      timePeriod = "",
      characterTitle = "",
      currentLocation = "",
      characterAge = "",
      keyRelationships = "",
      availableResources = "",
      externalPressures = ""
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

    // Generate randomization factors for variety
    const randomSeed = Math.random().toFixed(6);
    const focusAspects = ['military', 'diplomatic', 'economic', 'personal', 'religious', 'political', 'social'];
    const decisionStyles = ['cautious', 'bold', 'calculated', 'impulsive', 'collaborative'];
    const timePressures = ['immediate', 'moderate', 'extended'];
    const emotionalStates = ['confident', 'anxious', 'determined', 'conflicted', 'pragmatic'];
    
    const primaryFocus = focusAspects[Math.floor(Math.random() * focusAspects.length)];
    const decisionStyle = decisionStyles[Math.floor(Math.random() * decisionStyles.length)];
    const timePressure = timePressures[Math.floor(Math.random() * timePressures.length)];
    const emotionalState = emotionalStates[Math.floor(Math.random() * emotionalStates.length)];

    // Create comprehensive prompt
    const prompt = `
==================================================
HISTORICAL DECISION GENERATOR - UNIVERSAL PROMPT
==================================================

SYSTEM ROLE: You are an advanced historical simulation AI that generates realistic decision scenarios for any historical figure.

CHARACTER CONTEXT:
- Name: ${name}
- Time Period: ${timePeriod || "Ancient/Medieval/Modern Era"}
- Position/Title: ${characterTitle || "Historical Figure"}
- Current Location: ${currentLocation || "Unknown"}
- Current Age: ${characterAge || "Unknown"}

CURRENT SITUATION:
Previous Events Timeline: ${prevText}
Current Critical Event: ${currText}
Event Number: ${eventNumber} (higher numbers = later in timeline)

CHARACTER STATE:
Current Stats: ${JSON.stringify(currentStats)}
Current Personality: ${currentPersonality}
Key Relationships: ${keyRelationships || "Various political and personal connections"}
Available Resources: ${availableResources || "Standard resources for the era"}
External Pressures: ${externalPressures || "Political and social pressures of the time"}

RANDOMIZATION FACTORS (to ensure variety):
- Decision Seed: ${randomSeed}
- Primary Focus: ${primaryFocus}
- Decision Style: ${decisionStyle}
- Time Pressure: ${timePressure}
- Emotional State: ${emotionalState}

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

DECISION IMPACT GUIDELINES:
- Each choice must logically affect the character's stats based on likely consequences
- Personality changes should reflect the psychological impact of the decision
- Consider immediate, short-term, and potential long-term effects
- Stats should change by realistic increments (typically 1-15 points per decision)

TIMELINE PROGRESSION:
- If this event number is >= ${maxEvents - 2}, consider setting end: true
- Ensure decisions maintain historical pacing appropriate to the era
- Each choice should advance the timeline logically

OUTPUT FORMAT (STRICT JSON):
{
  "choice1": {
    "title": "Concise decision title (max 8 words)",
    "description": "Detailed explanation of ${name}'s decision, motivations, and reasoning (2-3 sentences)",
    "event": "Immediate consequences and reactions to this decision (2-3 sentences)",
    "new_stats": ${JSON.stringify(currentStats)},
    "new_personality": "How this decision changes or reinforces ${name}'s character traits and worldview (1-2 sentences)"
  },
  "choice2": {
    "title": "Different decision title",
    "description": "Alternative decision explanation (2-3 sentences)",
    "event": "Different consequences (2-3 sentences)",
    "new_stats": ${JSON.stringify(currentStats)},
    "new_personality": "Different personality impact (1-2 sentences)"
  },
  "choice3": {
    "title": "Bold decision title",
    "description": "Creative alternative explanation (2-3 sentences)",
    "event": "Bold consequences (2-3 sentences)",
    "new_stats": ${JSON.stringify(currentStats)},
    "new_personality": "Bold personality impact (1-2 sentences)"
  },
  "end": ${eventNumber >= maxEvents - 2 ? 'true' : 'false'}
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
9. Adapt all decisions to fit ${name}'s actual historical context

HISTORICAL AUTHENTICITY CHECKLIST:
✓ Decisions reflect available technology and knowledge of the era
✓ Social, political, and cultural constraints of the time period considered
✓ Character's known traits, beliefs, and limitations incorporated
✓ Consequences align with realistic cause-and-effect for that era
✓ Language and concepts appropriate to the historical context

Remember: You are ${name}. Think from their perspective, with their knowledge, values, and constraints. Make decisions they would realistically consider given their situation and the world they lived in.
`;

    console.log("Enhanced Prompt to Nuclia:", prompt);
    
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
      
      // Fallback: try to create a basic response structure
      const fallbackChoices = {
        choice1: {
          title: `${name}'s Historical Decision`,
          description: `${name} makes a decision based on historical precedent.`,
          event: `The decision has immediate consequences for ${name}.`,
          new_stats: currentStats,
          new_personality: currentPersonality
        },
        choice2: {
          title: `${name}'s Alternative Path`,
          description: `${name} considers an alternative approach.`,
          event: `This alternative creates different outcomes.`,
          new_stats: currentStats,
          new_personality: currentPersonality
        },
        choice3: {
          title: `${name}'s Bold Move`,
          description: `${name} takes a revolutionary approach.`,
          event: `This bold decision changes everything.`,
          new_stats: currentStats,
          new_personality: currentPersonality
        },
        end: eventNumber >= maxEvents - 2
      };
      
      return res.status(500).json({
        error: 'Nuclia answer not valid JSON, using fallback',
        rawAnswer: answerText,
        fallback: fallbackChoices
      });
    }

    // ✅ Ensure structure and validate
    if (!choices.choice1 || !choices.choice2 || !choices.choice3) {
      console.error('Invalid structure returned:', choices);
      return res.status(500).json({ 
        error: 'Invalid structure - missing required choices', 
        raw: choices,
        expected: 'choice1, choice2, choice3 objects'
      });
    }

    // Validate each choice has required fields
    const requiredFields = ['title', 'description', 'event', 'new_stats', 'new_personality'];
    for (let i = 1; i <= 3; i++) {
      const choice = choices[`choice${i}`];
      for (const field of requiredFields) {
        if (!choice[field]) {
          console.warn(`Missing field ${field} in choice${i}`);
          // Provide default values
          choice[field] = choice[field] || `Default ${field} for choice ${i}`;
        }
      }
    }

    // Ensure end field exists
    if (typeof choices.end === 'undefined') {
      choices.end = eventNumber >= maxEvents - 2;
    }

    console.log('Successfully processed choices:', JSON.stringify(choices, null, 2));
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

// Helper function to extract character context from timeline structure
export function extractCharacterContext(timeline, currentEventId) {
  const currentEvent = timeline.events.find(e => e.id === currentEventId);
  const previousEvents = timeline.events.filter(e => e.id < currentEventId);
  
  if (!currentEvent) {
    throw new Error(`Event with id ${currentEventId} not found in timeline`);
  }
  
  return {
    name: timeline.characterName || "Unknown Character",
    currentEvent: currentEvent,
    previousEvents: previousEvents,
    currentStats: currentEvent.stats || {},
    currentPersonality: currentEvent.personality || "",
    eventNumber: currentEvent.id || 0,
    maxEvents: Math.max(...timeline.events.map(e => e.id)) || 10,
    timePeriod: timeline.timePeriod || "",
    characterTitle: timeline.characterTitle || "",
    currentLocation: timeline.currentLocation || "",
    characterAge: currentEvent.age || "",
    keyRelationships: timeline.keyRelationships || "",
    availableResources: timeline.availableResources || "",
    externalPressures: timeline.externalPressures || ""
  };
}
