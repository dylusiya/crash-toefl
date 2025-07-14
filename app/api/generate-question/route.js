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
  'Gist': `Create a TOEFL Listening Gist question with a realistic conversation. Return only this JSON:
{
  "section": "listening",
  "type": "Gist Question", 
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between a student and academic advisor.",
  "transcript": "Student: Hi, I need help choosing my courses for next semester. I'm majoring in biology but I'm also interested in environmental science. Advisor: What's your long-term goal? Student: I want to get into medical school, but I also care about environmental issues. Advisor: I'd recommend taking Biology 301 first since it's required for pre-med. You could take Environmental Science 200 as an elective. That covers both your interests. Student: That sounds perfect. When are those classes offered? Advisor: Biology 301 is Tuesday and Thursday at 10 AM. Environmental Science 200 is Monday, Wednesday, Friday at 2 PM. Student: Great, I'll register for both. Thanks for your help!",
  "question": "What is the main purpose of this conversation?",
  "options": ["A) To discuss environmental science career opportunities", "B) To get advice on course selection for next semester", "C) To change majors from biology to environmental science", "D) To schedule a meeting with professors"],
  "correctAnswer": "B"
}`,

  'Detail': `Create a TOEFL Listening Detail question with a realistic lecture. Return only this JSON:
{
  "section": "listening",
  "type": "Detail Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a lecture about renewable energy.",
  "transcript": "Professor: Today we'll discuss solar panel efficiency. Modern solar panels convert about 20 to 22 percent of sunlight into electricity. This might seem low, but it's actually a huge improvement. In the 1950s, early solar panels only achieved 6 percent efficiency. The breakthrough came in the 1970s when scientists developed silicon-based cells. Currently, researchers are working on panels that could reach 30 percent efficiency within the next decade. The key is using new materials like perovskite crystals combined with traditional silicon.",
  "question": "According to the professor, what was the efficiency of solar panels in the 1950s?",
  "options": ["A) 20 to 22 percent", "B) 30 percent", "C) 6 percent", "D) The information was not provided"],
  "correctAnswer": "C"
}`,

  'Attitude': `Create a TOEFL Listening Attitude question with clear speaker emotions. Return only this JSON:
{
  "section": "listening",
  "type": "Attitude Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between two students about a group project.",
  "transcript": "Student A: So how do you feel about working with Jake on our history project? Student B: Honestly? I'm not thrilled about it. Last semester he barely contributed to our economics project. He showed up to maybe half the meetings and his research was pretty superficial. Student A: That's frustrating. Maybe he's changed though? Student B: I doubt it. I heard from Maria that he did the same thing in her psychology class. I just hope he doesn't drag our grade down this time.",
  "question": "What is Student B's attitude toward working with Jake?",
  "options": ["A) Enthusiastic and optimistic", "B) Concerned and skeptical", "C) Neutral and indifferent", "D) Angry and hostile"],
  "correctAnswer": "B"
}`,

  'Function': `Create a TOEFL Listening Function question about why something was said. Return only this JSON:
{
  "section": "listening",
  "type": "Function Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a lecture about ancient civilizations.",
  "transcript": "Professor: The Mesopotamians developed the first known writing system around 3200 BCE. Now, you might be thinking - wait, what about cave paintings? Those are much older. But here's the key difference: cave paintings told stories or recorded events, while cuneiform writing represented spoken language. It could record laws, business transactions, and even literature. This is why we consider cuneiform the first true writing system.",
  "question": "Why does the professor mention cave paintings?",
  "options": ["A) To explain how cuneiform writing developed", "B) To contrast them with true writing systems", "C) To show they were superior to cuneiform", "D) To demonstrate Mesopotamian artistic skills"],
  "correctAnswer": "B"
}`,

  'Inference': `Create a TOEFL Listening Inference question where the answer is implied. Return only this JSON:
{
  "section": "listening",
  "type": "Inference Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between a student and librarian.",
  "transcript": "Student: Excuse me, I'm looking for books about marine biology for my research paper. Librarian: Sure! What specific aspect are you focusing on? Student: I'm writing about coral reef ecosystems and how climate change affects them. Librarian: Perfect. Most of our marine biology books are on the third floor, but I'd recommend checking our digital database first. We just got access to some recent research journals that have current data on coral bleaching. Student: That sounds exactly like what I need. How do I access those? Librarian: I'll write down the database name and login information for you.",
  "question": "What can be inferred about the student's research paper?",
  "options": ["A) It focuses on general marine biology topics", "B) It requires up-to-date scientific information", "C) It's about historical ocean exploration", "D) It only needs basic textbook information"],
  "correctAnswer": "B"
}`,

  'Connecting Info': `Create a TOEFL Listening Connecting Information question about relationships between ideas. Return only this JSON:
{
  "section": "listening",
  "type": "Connecting Information Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a biology lecture about plant adaptation.",
  "transcript": "Professor: Plants have developed fascinating adaptations to survive in different environments. Take desert plants, for example. Cacti have thick, waxy stems that store water and small spines instead of leaves to reduce water loss. In contrast, rainforest plants face the opposite challenge - too much water and competition for sunlight. So they've evolved differently. Many have large, broad leaves to capture maximum sunlight, and some grow as vines to climb toward the light. Interestingly, both environments led to similar solutions in some cases. Both desert and rainforest plants often have specialized root systems - cacti have shallow, widespread roots to catch rare rainfall, while many rainforest plants have shallow roots too, but to quickly absorb nutrients from decomposing matter on the forest floor.",
  "question": "According to the professor, how are the root systems of desert and rainforest plants similar?",
  "options": ["A) Both are deep to reach groundwater", "B) Both are shallow but for different reasons", "C) Both store water in their roots", "D) Both compete for the same nutrients"],
  "correctAnswer": "B"
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