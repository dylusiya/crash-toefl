import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { section, difficulty, questionType } = await request.json();
    console.log("Generating question for:", section, difficulty, questionType);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Get random question type if not specified
    const questionTypes = {
      reading: [
        "Factual",
        "Inference",
        "Vocabulary",
        "Summary",
        "Insertion",
        "Purpose",
      ],
      listening: [
        "Gist",
        "Detail",
        "Function",
        "Attitude",
        "Inference",
        "Connecting Info",
      ],
      speaking: [
        "Independent",
        "Integrated Academic",
        "Integrated Campus",
        "Integrated Lecture",
      ],
      writing: ["Integrated", "Independent Opinion Essay"],
    };

    const selectedType =
      questionType ||
      questionTypes[section][
        Math.floor(Math.random() * questionTypes[section].length)
      ];

    const prompts = {
      reading: {
        Factual: `Create a TOEFL Reading Factual question with original content. Return only this JSON:
{
  "section": "reading",
  "type": "Factual Question",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 200-word academic passage about science, history, archaeology, psychology, or environmental studies. Include specific facts, dates, numbers, and details that can be questioned.]",
  "question": "According to the passage, [create a specific factual question about dates, numbers, locations, or processes mentioned in your passage]?",
  "options": ["A) [Correct fact from passage]", "B) [Wrong but plausible fact]", "C) [Different detail from passage]", "D) [Unrelated but realistic fact]"],
  "correctAnswer": "A"
}`,

        Inference: `Create a TOEFL Reading Inference question with original content. Return only this JSON:
{
  "section": "reading",
  "type": "Inference Question", 
  "difficulty": "${difficulty}",
  "passage": "[Write an original 200-word academic passage that implies information without stating it directly. The passage should suggest conclusions through evidence and context.]",
  "question": "What can be inferred about [topic from your passage] from the passage?",
  "options": ["A) [Logical inference supported by evidence]", "B) [Too extreme or absolute conclusion]", "C) [Contradicts information in passage]", "D) [Not supported by any evidence]"],
  "correctAnswer": "A"
}`,

        Vocabulary: `Create a TOEFL Reading Vocabulary question with original content. Return only this JSON:
{
  "section": "reading",
  "type": "Vocabulary Question",
  "difficulty": "${difficulty}", 
  "passage": "[Write an original 200-word academic passage that includes a challenging vocabulary word used in context. Choose words like 'proliferate', 'substantiate', 'mitigate', 'facilitate', etc.]",
  "question": "The word '[choose specific vocab word from your passage]' in the passage is closest in meaning to:",
  "options": ["A) [Correct synonym]", "B) [Similar but incorrect meaning]", "C) [Opposite meaning]", "D) [Completely unrelated word]"],
  "correctAnswer": "A"
}`,

        Summary: `Create a TOEFL Reading Summary question with original content. Return only this JSON:
{
  "section": "reading",
  "type": "Summary Question",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 250-word academic passage with 3-4 clear main points and supporting details about a scientific, historical, or social topic.]",
  "question": "An introductory sentence for a brief summary is provided below. Complete the summary by selecting the THREE answer choices that express the most important ideas in the passage.",
  "options": ["A) [First major point from passage]", "B) [Second major point from passage]", "C) [Third major point from passage]", "D) [Minor supporting detail]", "E) [Specific example, not main idea]", "F) [Information not in passage]"],
  "correctAnswer": "A, B, C"
}`,

        Purpose: `Create a TOEFL Reading Purpose question with original content. Return only this JSON:
{
  "section": "reading",
  "type": "Purpose Question",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 200-word academic passage where the author uses a specific example, analogy, or detail to serve a clear rhetorical purpose.]",
  "question": "Why does the author mention [specific detail/example from your passage]?",
  "options": ["A) [Correct rhetorical purpose - to illustrate, support, or clarify the main point]", "B) [To contradict previous information]", "C) [To introduce unrelated topic]", "D) [To provide unnecessary background]"],
  "correctAnswer": "A"
}`,
      },

      listening: {
        Gist: `Create a TOEFL Listening Gist question with completely original content. Return only this JSON:
{
  "section": "listening",
  "type": "Gist Question", 
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between a student and [academic advisor/professor/librarian/registrar].",
  "transcript": "[Create a completely original, realistic 150-word conversation between a student and university staff member. Topics could include: course selection, research assistance, library resources, academic planning, study abroad, internships, graduation requirements, etc. Include specific details like course names, times, requirements, and realistic dialogue.]",
  "question": "What is the main purpose of this conversation?",
  "options": ["A) [Main purpose based on your conversation]", "B) [Secondary topic mentioned in conversation]", "C) [Different academic purpose]", "D) [Unrelated academic activity]"],
  "correctAnswer": "A"
}`,

        Detail: `Create a TOEFL Listening Detail question with original content. Return only this JSON:
{
  "section": "listening",
  "type": "Detail Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a lecture about [choose: biology, chemistry, history, psychology, environmental science, archaeology, or astronomy].",
  "transcript": "[Create a completely original 180-word lecture with specific facts, numbers, dates, percentages, or examples. Include concrete details that can be questioned, such as years, statistics, scientific processes, historical events, or research findings.]",
  "question": "According to the professor, [ask about a specific detail from your lecture - numbers, dates, processes, or examples]?",
  "options": ["A) [Correct specific detail from lecture]", "B) [Different number/fact mentioned in lecture]", "C) [Plausible but incorrect detail]", "D) [Information not mentioned in lecture]"],
  "correctAnswer": "A"
}`,

        Function: `Create a TOEFL Listening Function question with original content. Return only this JSON:
{
  "section": "listening",
  "type": "Function Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a lecture about [create original academic topic].",
  "transcript": "[Create an original lecture where the professor mentions a specific example, makes a comparison, or references something for a clear rhetorical purpose. The purpose should be obvious - to illustrate a point, to contrast concepts, to emphasize importance, etc.]",
  "question": "Why does the professor mention [specific detail from your lecture]?",
  "options": ["A) [Correct rhetorical purpose]", "B) [Different but plausible purpose]", "C) [Misinterpretation of purpose]", "D) [Unrelated purpose]"],
  "correctAnswer": "A"
}`,

        Attitude: `Create a TOEFL Listening Attitude question with original content. Return only this JSON:
{
  "section": "listening",
  "type": "Attitude Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between [two students/student and professor] about [academic topic].",
  "transcript": "[Create an original conversation where one speaker clearly expresses a specific attitude - frustrated, excited, concerned, skeptical, enthusiastic, disappointed, etc. Make the emotion clear through word choice, tone indicators, and context.]",
  "question": "What is [speaker's name/the student's/the professor's] attitude toward [topic discussed in conversation]?",
  "options": ["A) [Correct attitude clearly expressed]", "B) [Opposite emotional response]", "C) [Different but related emotion]", "D) [Neutral or unrelated feeling]"],
  "correctAnswer": "A"
}`,

        Inference: `Create a TOEFL Listening Inference question with original content. Return only this JSON:
{
  "section": "listening",
  "type": "Inference Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to a conversation between [student and academic staff] about [academic matter].",
  "transcript": "[Create an original conversation that implies information through context clues rather than stating it directly. The conversation should suggest something about the student's situation, academic status, plans, or needs through indirect evidence.]",
  "question": "What can be inferred about [aspect related to conversation]?",
  "options": ["A) [Logical inference supported by context clues]", "B) [Too specific, not clearly implied]", "C) [Contradicts conversation implications]", "D) [Not supported by conversation evidence]"],
  "correctAnswer": "A"
}`,

        "Connecting Info": `Create a TOEFL Listening Connecting Information question with original content. Return only this JSON:
{
  "section": "listening",
  "type": "Connecting Information Question",
  "difficulty": "${difficulty}",
  "scenario": "🎧 Listen to part of a lecture about [create topic involving comparisons or relationships].",
  "transcript": "[Create an original lecture that compares and contrasts different concepts, processes, or phenomena. Include clear similarities and differences between at least two related topics, with specific examples demonstrating the relationships.]",
  "question": "According to the professor, how are [two concepts from your lecture] similar/different?",
  "options": ["A) [Correct relationship mentioned in lecture]", "B) [Difference instead of similarity, or vice versa]", "C) [Incorrect relationship]", "D) [Relationship not discussed in lecture]"],
  "correctAnswer": "A"
}`
      },

      speaking: {
        Independent: `Create a TOEFL Speaking Independent task with original content. Return only this JSON:
{
  "section": "speaking",
  "type": "Independent Speaking Task",
  "difficulty": "${difficulty}",
  "question": "[Create an original opinion question about preferences, experiences, or choices. Topics could include: study methods, technology use, travel, work environments, social activities, learning styles, etc. Format: 'Some people prefer X, while others prefer Y. Which do you prefer and why?']",
  "timeLimit": "15 seconds preparation, 45 seconds response",
  "tips": "State your preference clearly, give 2-3 reasons, include personal examples"
}`,

        "Integrated Campus": `Create a TOEFL Speaking Integrated Campus task with original content. Return only this JSON:
{
  "section": "speaking", 
  "type": "Integrated Speaking - Campus",
  "difficulty": "${difficulty}",
  "reading": "[Create an original campus announcement about a policy change, new service, facility update, or campus issue. Make it 80-100 words with specific details.]",
  "audio": "🎧 Student conversation about the announcement",
  "transcript": "[Create original dialogue where a student expresses clear opinion about the announcement with 2-3 specific reasons. Include realistic student concerns or benefits.]",
  "question": "The student expresses his/her opinion about [announcement topic]. State the student's opinion and explain the reasons he/she gives for holding that opinion.",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`,

        "Integrated Academic": `Create a TOEFL Speaking Integrated Academic task with original content. Return only this JSON:
{
  "section": "speaking",
  "type": "Integrated Speaking - Academic",
  "difficulty": "${difficulty}",
  "reading": "[Create an original academic definition of a concept from psychology, business, biology, or environmental science. Make it 80-100 words with clear definition.]",
  "audio": "🎧 Professor's lecture with examples",
  "transcript": "[Create original lecture where professor explains the concept with 1-2 specific, concrete examples that clearly illustrate the definition.]",
  "question": "Using the example(s) from the lecture, explain how [concept from reading] works.",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`,
      },

      writing: {
        Integrated: `Create a TOEFL Writing Integrated task with original content. Return only this JSON:
{
  "section": "writing",
  "type": "Integrated Writing Task",
  "difficulty": "${difficulty}",
  "reading": "[Create an original 200-250 word passage about an academic topic with 3 clear main points supporting one position. Topics could include: environmental policies, educational methods, technology impacts, workplace practices, etc.]",
  "audio": "🎧 Professor's lecture that challenges the reading",
  "transcript": "[Create original lecture where professor systematically challenges each of the 3 main points from the reading with counterarguments and evidence. Make the opposition clear and specific.]",
  "question": "Summarize the points made in the lecture, being sure to explain how they challenge the specific points made in the reading passage.",
  "timeLimit": "20 minutes",
  "wordLimit": "150-225 words"
}`,

        "Independent Opinion Essay": `Create a TOEFL Writing Independent task with original content. Return only this JSON:
{
  "section": "writing",
  "type": "Independent Writing Task", 
  "difficulty": "${difficulty}",
  "prompt": "[Create an original opinion prompt with a controversial statement about education, technology, society, work, or personal development. Format: 'Do you agree or disagree with the following statement? [Statement]. Use specific reasons and examples to support your answer.']",
  "timeLimit": "30 minutes",
  "wordLimit": "300+ words",
  "tips": "Take a clear position, organize with introduction/body/conclusion, use specific examples"
}`,
      },
    };

    const prompt = prompts[section][selectedType];
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response:", text);

    // Clean JSON
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/\n?```/g, "");

    const jsonStart = cleanedText.indexOf("{");
    const jsonEnd = cleanedText.lastIndexOf("}") + 1;
    cleanedText = cleanedText.substring(jsonStart, jsonEnd);

    const questionData = JSON.parse(cleanedText);
    return Response.json(questionData);
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json(
      { error: "Failed to generate question", details: error.message },
      { status: 500 }
    );
  }
}