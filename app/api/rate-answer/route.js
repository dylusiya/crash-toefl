import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { question, userAnswer, section } = await request.json();

    const prompts = {
      reading: `Rate this TOEFL Reading answer:

Question: ${question.question}
Correct Answer: ${question.correctAnswer}
User Answer: ${userAnswer}
Passage: ${question.passage}

Provide a detailed evaluation in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10),
  "fluency": (0-10), 
  "content": (0-10),
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "detailedFeedback": "detailed explanation of the answer quality"
}`,

      listening: `Rate this TOEFL Listening answer:

Question: ${question.question}
Correct Answer: ${question.correctAnswer}
User Answer: ${userAnswer}
Scenario: ${question.scenario}

Provide a detailed evaluation in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10),
  "fluency": (0-10),
  "content": (0-10), 
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "detailedFeedback": "detailed explanation of the answer quality"
}`,

      speaking: `Rate this TOEFL Speaking response and provide an improved version:

Question: ${question.question}
${question.reading ? `Reading: ${question.reading}` : ''}
${question.audio ? `Audio: ${question.audio}` : ''}
${question.transcript ? `Transcript: ${question.transcript}` : ''}
User Response: ${userAnswer}

Evaluate based on TOEFL Speaking criteria and provide in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10 for grammar/vocabulary),
  "fluency": (0-10 for flow and pronunciation), 
  "content": (0-10 for task completion and ideas),
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "detailedFeedback": "comprehensive feedback on delivery, language use, and topic development",
  "improvedResponse": "An enhanced version of the user's response with better grammar, vocabulary, structure, and content while maintaining the same main ideas",
  "improvementHighlights": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`,

      writing: `Rate this TOEFL Writing essay and provide an improved version:

Prompt: ${question.prompt}
${question.reading ? `Reading: ${question.reading}` : ''}
${question.audio ? `Audio: ${question.audio}` : ''}
${question.transcript ? `Transcript: ${question.transcript}` : ''}
User Essay: ${userAnswer}

Evaluate based on TOEFL Writing criteria and provide in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10 for grammar/vocabulary),
  "fluency": (0-10 for coherence and flow),
  "content": (0-10 for task response and development),
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"], 
  "detailedFeedback": "detailed feedback on organization, examples, language use, and task achievement",
  "improvedResponse": "An enhanced version of the user's essay with better organization, grammar, vocabulary, examples, and development while preserving the original ideas and structure",
  "improvementHighlights": ["specific improvement 1", "specific improvement 2", "specific improvement 3"]
}`
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = prompts[section];

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present  
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    let ratingData;
    try {
      ratingData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw text:', text);
      
      // Fallback: Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          ratingData = JSON.parse(jsonMatch[0]);
        } catch (fallbackError) {
          console.error('Fallback JSON Parse Error:', fallbackError);
          throw new Error('Invalid JSON response from AI');
        }
      } else {
        throw new Error('No JSON found in AI response');
      }
    }

    // Ensure required fields exist for all sections
    const defaultRating = {
      score: 0,
      accuracy: 0,
      fluency: 0,
      content: 0,
      strengths: [],
      improvements: [],
      detailedFeedback: "Unable to provide detailed feedback"
    };

    // Add improvedResponse fields for speaking and writing if missing
    if ((section === 'speaking' || section === 'writing') && !ratingData.improvedResponse) {
      ratingData.improvedResponse = "Improved version not available";
      ratingData.improvementHighlights = ["Please try again for improved version"];
    }

    // Merge with defaults to ensure all fields exist
    const finalRating = { ...defaultRating, ...ratingData };

    // Validate score ranges
    ['score', 'accuracy', 'fluency', 'content'].forEach(field => {
      if (finalRating[field] < 0) finalRating[field] = 0;
      if (finalRating[field] > 10) finalRating[field] = 10;
    });

    return Response.json(finalRating);

  } catch (error) {
    console.error('Error rating answer:', error);
    return Response.json(
      { error: 'Failed to rate answer', details: error.message },
      { status: 500 }
    );
  }
}