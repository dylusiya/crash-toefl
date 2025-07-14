import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const { section, difficulty, questionType } = await request.json();
    console.log('Generating question for:', section, difficulty, questionType);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Get random question type if not specified
    const questionTypes = {
      reading: ['Factual', 'Inference', 'Vocabulary', 'Summary', 'Insertion', 'Purpose'],
      listening: ['Gist', 'Detail', 'Function', 'Attitude', 'Inference', 'Connecting Info'],
      speaking: ['Independent', 'Integrated Academic', 'Integrated Campus', 'Integrated Lecture'],
      writing: ['Integrated', 'Independent Opinion Essay']
    };

    const selectedType = questionType || questionTypes[section][Math.floor(Math.random() * questionTypes[section].length)];

    const prompts = {
      reading: {
        'Factual': `Create a TOEFL Reading Factual question. Return only this JSON:
{
  "section": "reading",
  "type": "Factual Question",
  "difficulty": "${difficulty}",
  "passage": "A 200-word academic passage about science, history, or social studies with specific facts and details",
  "question": "According to the passage, what/when/where/how [specific factual question]?",
  "options": ["A) Specific factual answer", "B) Wrong but plausible fact", "C) Wrong but plausible fact", "D) Wrong but plausible fact"],
  "correctAnswer": "A"
}`,

        'Inference': `Create a TOEFL Reading Inference question. Return only this JSON:
{
  "section": "reading",
  "type": "Inference Question", 
  "difficulty": "${difficulty}",
  "passage": "A 200-word academic passage that implies information without stating it directly",
  "question": "What can be inferred about [topic] from the passage?",
  "options": ["A) Logical inference from the text", "B) Too extreme conclusion", "C) Contradicts the passage", "D) Not supported by evidence"],
  "correctAnswer": "A"
}`,

        'Vocabulary': `Create a TOEFL Reading Vocabulary question. Return only this JSON:
{
  "section": "reading",
  "type": "Vocabulary Question",
  "difficulty": "${difficulty}", 
  "passage": "A 200-word academic passage with an academic vocabulary word that needs to be understood in context",
  "question": "The word '[vocabulary word]' in paragraph X is closest in meaning to:",
  "options": ["A) Correct synonym", "B) Wrong but similar meaning", "C) Opposite meaning", "D) Unrelated word"],
  "correctAnswer": "A"
}`,

        'Summary': `Create a TOEFL Reading Summary question. Return only this JSON:
{
  "section": "reading",
  "type": "Summary Question",
  "difficulty": "${difficulty}",
  "passage": "A 250-word academic passage with clear main points and supporting details",
  "question": "An introductory sentence for a brief summary is provided below. Complete the summary by selecting the THREE answer choices that express the most important ideas in the passage.",
  "options": ["A) Major point from passage", "B) Major point from passage", "C) Major point from passage", "D) Minor detail", "E) Minor detail", "F) Incorrect information"],
  "correctAnswer": "A, B, C"
}`,

        'Purpose': `Create a TOEFL Reading Purpose question. Return only this JSON:
{
  "section": "reading",
  "type": "Purpose Question",
  "difficulty": "${difficulty}",
  "passage": "A 200-word academic passage with clear organizational structure and author's intent",
  "question": "Why does the author mention [specific detail/example] in paragraph X?",
  "options": ["A) To illustrate the main point", "B) To contradict previous information", "C) To introduce a new topic", "D) To provide background information"],
  "correctAnswer": "A"
}`
      },

      listening: {
        'Gist': `Create a TOEFL Listening Gist question. Return only this JSON:
{
  "section": "listening",
  "type": "Gist Question", 
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between a student and professor/staff member.",
  "transcript": "A realistic 150-word conversation with clear main purpose/topic",
  "question": "What is the main purpose of this conversation?",
  "options": ["A) Main purpose of conversation", "B) Secondary topic mentioned", "C) Unrelated purpose", "D) Opposite of actual purpose"],
  "correctAnswer": "A"
}`,

        'Detail': `Create a TOEFL Listening Detail question. Return only this JSON:
{
  "section": "listening",
  "type": "Detail Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a lecture about an academic topic.",
  "transcript": "A 180-word lecture with specific facts, dates, numbers, or examples",
  "question": "According to the professor, what/when/how [specific detail question]?",
  "options": ["A) Correct specific detail", "B) Detail from different part", "C) Similar but wrong detail", "D) Contradictory information"],
  "correctAnswer": "A"
}`,

        'Attitude': `Create a TOEFL Listening Attitude question. Return only this JSON:
{
  "section": "listening",
  "type": "Attitude Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation with clear speaker opinions/feelings.",
  "transcript": "A 160-word conversation where speaker expresses clear attitude through tone, word choice, or direct statements",
  "question": "What is the [speaker's] attitude toward [topic/situation]?",
  "options": ["A) Correct attitude (positive/negative/neutral)", "B) Opposite attitude", "C) Unrelated emotion", "D) Too extreme emotion"],
  "correctAnswer": "A"
}`
      },

      speaking: {
        'Independent': `Create a TOEFL Speaking Independent task. Return only this JSON:
{
  "section": "speaking",
  "type": "Independent Speaking Task",
  "difficulty": "${difficulty}",
  "question": "Some people prefer [option A], while others prefer [option B]. Which do you prefer and why? Use specific reasons and examples to support your answer.",
  "timeLimit": "15 seconds preparation, 45 seconds response",
  "tips": "State your preference clearly, give 2-3 reasons, include personal examples"
}`,

        'Integrated Campus': `Create a TOEFL Speaking Integrated Campus task. Return only this JSON:
{
  "section": "speaking", 
  "type": "Integrated Speaking - Campus",
  "difficulty": "${difficulty}",
  "reading": "Campus Announcement: [University policy change, new service, or campus issue - 100 words]",
  "audio": "🎧 Student conversation about the announcement",
  "transcript": "Student 1: [Opinion about the announcement with 2-3 specific reasons] Student 2: [Response or additional points]",
  "question": "The student expresses his/her opinion about [announcement topic]. State the student's opinion and explain the reasons he/she gives for holding that opinion.",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`,

        'Integrated Academic': `Create a TOEFL Speaking Integrated Academic task. Return only this JSON:
{
  "section": "speaking",
  "type": "Integrated Speaking - Academic",
  "difficulty": "${difficulty}",
  "reading": "Academic Reading: [Definition of an academic concept - 100 words]",
  "audio": "🎧 Professor's lecture with examples",
  "transcript": "Professor: [Explains the concept with 1-2 concrete examples that illustrate the definition]",
  "question": "Using the example from the lecture, explain how [concept] works.",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`
      },

      writing: {
        'Integrated': `Create a TOEFL Writing Integrated task. Return only this JSON:
{
  "section": "writing",
  "type": "Integrated Writing Task",
  "difficulty": "${difficulty}",
  "reading": "Reading Passage: [Academic topic with 3 main points supporting one side - 250 words]",
  "audio": "🎧 Professor's lecture that challenges the reading",
  "transcript": "Professor: [Systematically challenges each of the 3 points from reading with counterarguments and evidence]",
  "question": "Summarize the points made in the lecture, being sure to explain how they challenge the specific points made in the reading passage.",
  "timeLimit": "20 minutes",
  "wordLimit": "150-225 words"
}`,

        'Independent Opinion Essay': `Create a TOEFL Writing Independent task. Return only this JSON:
{
  "section": "writing",
  "type": "Independent Writing Task", 
  "difficulty": "${difficulty}",
  "prompt": "Do you agree or disagree with the following statement? [Controversial statement about education, technology, society, or personal development]. Use specific reasons and examples to support your answer.",
  "timeLimit": "30 minutes",
  "wordLimit": "300+ words",
  "tips": "Take a clear position, organize with introduction/body/conclusion, use specific examples"
}`
      }
    };

    const prompt = prompts[section][selectedType];
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);

    // Clean JSON
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```/g, '');
    
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}') + 1;
    cleanedText = cleanedText.substring(jsonStart, jsonEnd);

    const questionData = JSON.parse(cleanedText);
    return Response.json(questionData);

  } catch (error) {
    console.error('Error:', error.message);
    return Response.json({ error: 'Failed to generate question', details: error.message }, { status: 500 });
  }
}