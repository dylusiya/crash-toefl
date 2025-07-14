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

      speaking: `Rate this TOEFL Speaking response:

Question: ${question.question}
User Response: ${userAnswer}

Evaluate based on TOEFL Speaking criteria and provide in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10 for grammar/vocabulary),
  "fluency": (0-10 for flow and pronunciation), 
  "content": (0-10 for task completion and ideas),
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "detailedFeedback": "comprehensive feedback on delivery, language use, and topic development"
}`,

      writing: `Rate this TOEFL Writing essay:

Prompt: ${question.prompt}
User Essay: ${userAnswer}

Evaluate based on TOEFL Writing criteria and provide in JSON format:
{
  "score": (0-10),
  "accuracy": (0-10 for grammar/vocabulary),
  "fluency": (0-10 for coherence and flow),
  "content": (0-10 for task response and development),
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"], 
  "detailedFeedback": "detailed feedback on organization, examples, language use, and task achievement"
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
      throw new Error('Invalid JSON response from AI');
    }

    return Response.json(ratingData);

  } catch (error) {
    console.error('Error rating answer:', error);
    return Response.json(
      { error: 'Failed to rate answer', details: error.message },
      { status: 500 }
    );
  }
}