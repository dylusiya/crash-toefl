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
  'Gist': `Create a TOEFL Listening Gist question with a realistic conversation. Create an original, unique conversation each time. Return only this JSON:
{
  "section": "listening",
  "type": "Gist Question", 
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between a student and [academic advisor/professor/librarian/campus staff member].",
  "transcript": "[Create a realistic 150-word conversation between a student and staff member about academic matters like course selection, research help, campus services, or academic problems. Make it completely original with specific details, names, times, and realistic dialogue.]",
  "question": "What is the main purpose of this conversation?",
  "options": ["A) [Purpose related to the conversation]", "B) [Different academic purpose]", "C) [Wrong but plausible purpose]", "D) [Unrelated academic purpose]"],
  "correctAnswer": "A"
}`,

  'Detail': `Create a TOEFL Listening Detail question with a realistic lecture. Create completely original content. Return only this JSON:
{
  "section": "listening",
  "type": "Detail Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a lecture about [create an original academic topic].",
  "transcript": "[Create an original 180-word lecture with specific facts, numbers, dates, or examples. Choose a random academic subject like biology, history, psychology, environmental science, etc. Include specific details that can be questioned.]",
  "question": "According to the professor, [ask about a specific detail from your created lecture]?",
  "options": ["A) [Correct specific detail]", "B) [Different number/fact from lecture]", "C) [Plausible but wrong detail]", "D) [Unrelated information]"],
  "correctAnswer": "A"
}`,

  'Attitude': `Create a TOEFL Listening Attitude question with clear speaker emotions. Create original dialogue. Return only this JSON:
{
  "section": "listening",
  "type": "Attitude Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between [two students/student and teacher] about [academic topic].",
  "transcript": "[Create an original conversation where one speaker clearly expresses a specific attitude (frustrated, excited, worried, disappointed, etc.) about an academic situation. Make the emotion clear through word choice and context.]",
  "question": "What is [speaker's] attitude toward [the topic discussed]?",
  "options": ["A) [Correct attitude expressed]", "B) [Opposite attitude]", "C) [Different emotion]", "D) [Neutral/unrelated emotion]"],
  "correctAnswer": "A"
}`,

  'Function': `Create a TOEFL Listening Function question about why something was said. Generate original content. Return only this JSON:
{
  "section": "listening",
  "type": "Function Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a lecture about [original academic topic].",
  "transcript": "[Create an original lecture where the professor mentions a specific example, comparison, or detail for a clear rhetorical purpose (to illustrate, to contrast, to emphasize, etc.). Make the purpose obvious.]",
  "question": "Why does the professor mention [specific detail from your lecture]?",
  "options": ["A) [Correct rhetorical purpose]", "B) [Different purpose]", "C) [Wrong interpretation]", "D) [Unrelated purpose]"],
  "correctAnswer": "A"
}`,

  'Inference': `Create a TOEFL Listening Inference question where the answer is implied. Generate fresh content. Return only this JSON:
{
  "section": "listening",
  "type": "Inference Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between [student and academic staff] about [academic topic].",
  "transcript": "[Create an original conversation that implies information without stating it directly. The conversation should suggest something about the student's situation, needs, or plans through context clues.]",
  "question": "What can be inferred about [aspect from conversation]?",
  "options": ["A) [Logical inference from context]", "B) [Too specific/not supported]", "C) [Contradicts the conversation]", "D) [Not implied by evidence]"],
  "correctAnswer": "A"
}`,

  'Connecting Info': `Create a TOEFL Listening Connecting Information question about relationships between ideas. Generate original academic content. Return only this JSON:
{
  "section": "listening",
  "type": "Connecting Information Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a lecture about [original academic topic with comparisons].",
  "transcript": "[Create an original lecture that compares and contrasts different concepts, showing both similarities and differences. Use specific examples that demonstrate relationships between ideas.]",
  "question": "According to the professor, how are [two concepts from lecture] similar?",
  "options": ["A) [Correct similarity mentioned]", "B) [Difference, not similarity]", "C) [Wrong relationship]", "D) [Unrelated comparison]"],
  "correctAnswer": "A"
}`
}

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