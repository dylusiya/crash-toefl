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

    // Authentic TOEFL question types from official practice test
    const questionTypes = {
      reading: ["Factual", "Inference", "Vocabulary", "Summary", "Purpose"],
      listening: ["Gist", "Detail", "Function", "Attitude", "Inference", "Connecting Info"],
      speaking: ["Independent", "Integrated Campus", "Integrated Academic", "Summary"],
      writing: ["Integrated", "Academic Discussion"],
    };

    const selectedType =
      questionType ||
      questionTypes[section][
        Math.floor(Math.random() * questionTypes[section].length)
      ];

    const prompts = {
      reading: {
        Factual: `Create a TOEFL Reading Factual question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "reading",
  "type": "Factual",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 300-400 word academic passage about science, history, politics, or environment. Include specific facts, dates, processes, and details that can be directly questioned. Write at university level with complex sentence structures.]",
  "question": "According to paragraph [1-4], [specific topic from passage] [effects/affects/influences] [something] primarily by",
  "options": [
    "[Complete answer choice that directly states what the passage says - MAKE THIS THE CORRECT ANSWER]",
    "[Plausible but incorrect interpretation of the information]", 
    "[Different detail from passage that doesn't answer the question]",
    "[Information not mentioned in the passage]"
  ],
  "correctAnswer": "A"
}`,

        Inference: `Create a TOEFL Reading Inference question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "reading",
  "type": "Inference", 
  "difficulty": "${difficulty}",
  "passage": "[Write an original 300-400 word academic passage that strongly implies conclusions through evidence and context without stating them directly. Include data, examples, and patterns that lead to logical inferences.]",
  "question": "What can be inferred from paragraph [1-4] about [specific topic from passage]?",
  "options": [
    "[Logical conclusion strongly supported by evidence in the passage - MAKE THIS THE CORRECT ANSWER]",
    "[Too extreme or absolute conclusion not fully supported]", 
    "[Contradicts what the passage implies]",
    "[Not supported by any evidence in the passage]"
  ],
  "correctAnswer": "A"
}`,

        Vocabulary: `Create a TOEFL Reading Vocabulary question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "reading",
  "type": "Vocabulary",
  "difficulty": "${difficulty}", 
  "passage": "[Write an original 300-400 word academic passage that includes advanced vocabulary words used in clear context. Use words like: proliferate, substantial, facilitate, undermine, enhance, comprise, etc.]",
  "question": "The word '[specific challenging word from your passage]' in the passage is closest in meaning to",
  "options": [
    "[correct synonym - MAKE THIS THE CORRECT ANSWER]",
    "[word with similar but different meaning]", 
    "[word with opposite meaning]",
    "[completely unrelated word]"
  ],
  "correctAnswer": "A"
}`,

        Summary: `Create a TOEFL Reading Summary question using EXACT official TOEFL formats. Generate 6 answer options where EXACTLY THREE are correct (the first 3 should be correct). Return only this JSON:
{
  "section": "reading",
  "type": "Summary",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 350-450 word academic passage with 3-4 clear main points and supporting details about a complex academic topic.]",
  "question": "Directions: An introductory sentence for a brief summary of the passage is provided below. Complete the summary by selecting the THREE answer choices that express the most important ideas in the passage. Some sentences do not belong in the summary because they express ideas that are not presented in the passage or are minor ideas in the passage. This question is worth 2 points.",
  "options": [
    "[First major point that captures essential information - CORRECT]",
    "[Second major point that captures essential information - CORRECT]", 
    "[Third major point that captures essential information - CORRECT]",
    "[Minor supporting detail, not a main idea - INCORRECT]",
    "[Specific example rather than main concept - INCORRECT]",
    "[Information not presented in the passage - INCORRECT]"
  ],
  "correctAnswer": "A, B, C"
}`,

        Purpose: `Create a TOEFL Reading Purpose question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "reading",
  "type": "Purpose",
  "difficulty": "${difficulty}",
  "passage": "[Write an original 300-400 word academic passage where the author uses specific examples, analogies, or details to serve clear rhetorical purposes.]",
  "question": "Why does the author mention [specific detail/example from your passage]?",
  "options": [
    "To [correct rhetorical purpose - illustrate, support, contrast, or clarify the main point - MAKE THIS THE CORRECT ANSWER]",
    "To [incorrect but plausible purpose]", 
    "To [purpose that contradicts the passage's intent]",
    "To [completely unrelated purpose]"
  ],
  "correctAnswer": "A"
}`
      },

      listening: {
        Gist: `Create a TOEFL Listening Gist question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Gist", 
  "difficulty": "${difficulty}",
  "scenario": "Listen to a conversation between a student and [professor/academic advisor/librarian/registrar].",
  "transcript": "[Create a completely original, realistic 200-250 word conversation with natural dialogue. Include: realistic university situations (office hours, course planning, research help, academic issues), specific course names/requirements, natural speech patterns with some hesitation and informal language, clear main purpose.]",
  "question": "Why does the student go to see the [professor/advisor/etc.]?",
  "options": [
    "To [main purpose clearly stated in conversation - MAKE THIS THE CORRECT ANSWER]",
    "To [secondary topic mentioned but not main purpose]", 
    "To [different plausible academic purpose]",
    "To [unrelated academic activity]"
  ],
  "correctAnswer": "A"
}`,

        Detail: `Create a TOEFL Listening Detail question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Detail",
  "difficulty": "${difficulty}",
  "scenario": "Listen to part of a lecture in a [Biology/Chemistry/History/Psychology/Environmental Science] class.",
  "transcript": "[Create a completely original 250-300 word academic lecture with: specific facts, numbers, dates, percentages, or processes, clear examples and explanations, natural professorial speaking style, technical vocabulary appropriate to the field.]",
  "question": "According to the professor, what [specific detail question about facts, numbers, processes, or examples from lecture]?",
  "options": [
    "[Correct specific detail explicitly mentioned in lecture - MAKE THIS THE CORRECT ANSWER]",
    "[Different fact/number that was mentioned in lecture]", 
    "[Plausible but incorrect detail not mentioned]",
    "[Information clearly not mentioned in lecture]"
  ],
  "correctAnswer": "A"
}`,

        Function: `Create a TOEFL Listening Function question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Function",
  "difficulty": "${difficulty}",
  "scenario": "Listen to part of a discussion in a [subject] class.",
  "transcript": "[Create an original lecture/discussion where the professor uses a specific example, analogy, or reference for a clear rhetorical purpose - to illustrate a concept, contrast ideas, emphasize importance, etc.]",
  "question": "Why does the professor mention [specific detail from your transcript]?",
  "options": [
    "To [correct rhetorical function - illustrate, contrast, emphasize, etc. - MAKE THIS THE CORRECT ANSWER]",
    "To [different but plausible function]", 
    "To [misinterpretation of the function]",
    "To [completely unrelated function]"
  ],
  "correctAnswer": "A"
}`,

        Attitude: `Create a TOEFL Listening Attitude question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Attitude",
  "difficulty": "${difficulty}",
  "scenario": "Listen to a conversation between [two students/student and professor].",
  "transcript": "[Create an original conversation where one speaker clearly expresses attitude through word choice, tone indicators like 'unfortunately', 'excellent', 'I'm concerned that', etc. Make the emotion obvious.]",
  "question": "What is [the student's/the professor's] attitude toward [topic from conversation]?",
  "options": [
    "[Correct attitude clearly expressed in conversation - MAKE THIS THE CORRECT ANSWER]",
    "[Opposite emotional response]", 
    "[Different but related emotion]",
    "[Neutral or unrelated attitude]"
  ],
  "correctAnswer": "A"
}`,

        Inference: `Create a TOEFL Listening Inference question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Inference",
  "difficulty": "${difficulty}",
  "scenario": "Listen to a conversation between a student and [academic staff member].",
  "transcript": "[Create an original conversation that implies information through context clues - student's situation, academic standing, future plans, or needs - without stating directly.]",
  "question": "What can be inferred about [aspect related to conversation]?",
  "options": [
    "[Logical inference strongly supported by context clues - MAKE THIS THE CORRECT ANSWER]",
    "[Inference that goes too far beyond evidence]", 
    "[Contradicts what conversation implies]",
    "[Not supported by conversation evidence]"
  ],
  "correctAnswer": "A"
}`,

        "Connecting Info": `Create a TOEFL Listening Connecting Information question using EXACT official TOEFL formats. Generate 4 answer options where EXACTLY ONE is correct. Return only this JSON:
{
  "section": "listening",
  "type": "Connecting Info",
  "difficulty": "${difficulty}",
  "scenario": "Listen to part of a lecture about [topic that involves comparisons/relationships].",
  "transcript": "[Create an original lecture that clearly compares/contrasts different concepts, processes, or phenomena with specific examples showing relationships.]",
  "question": "According to the professor, how are [two concepts from lecture] similar?",
  "options": [
    "[Correct similarity/difference mentioned in lecture - MAKE THIS THE CORRECT ANSWER]",
    "[Correct information but answers wrong question]", 
    "[Incorrect relationship]",
    "[Relationship not discussed in lecture]"
  ],
  "correctAnswer": "A"
}`
      },

      speaking: {
        Independent: `Create a TOEFL Speaking Independent task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "speaking",
  "type": "Independent",
  "difficulty": "${difficulty}",
  "question": "Some people [preference/behavior A], while others [preference/behavior B]. Which do you think is better and why? Use specific reasons and examples to support your opinion.",
  "timeLimit": "15 seconds preparation, 45 seconds response",
  "tips": "Choose your position quickly, give 2-3 clear reasons with specific examples"
}`,

        "Integrated Campus": `Create a TOEFL Speaking Integrated Campus task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "speaking", 
  "type": "Integrated Campus",
  "difficulty": "${difficulty}",
  "reading": "[Create an original campus announcement/notice about: policy changes, new services, facility updates, schedule changes, etc. 80-120 words with specific details like dates, locations, requirements.]",
  "audio": "Now you will hear two students discussing the announcement.",
  "transcript": "[Create realistic student dialogue where one student expresses clear opinion (agrees/disagrees) about the announcement with 2-3 specific reasons. Include natural student speech patterns and realistic concerns/benefits.]",
  "question": "The [man/woman] expresses [his/her] opinion about the [announcement topic]. State [his/her] opinion and explain the reasons [he/she] gives for holding that opinion.",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`,

        "Integrated Academic": `Create a TOEFL Speaking Integrated Academic task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "speaking",
  "type": "Integrated Academic",
  "difficulty": "${difficulty}",
  "reading": "[Create an original academic definition/concept from psychology, business, biology, or environmental science. 80-120 words with clear definition and key characteristics.]",
  "audio": "Now you will hear part of a lecture on this topic.",
  "transcript": "[Create original lecture where professor explains the concept using 1-2 specific, detailed examples that clearly demonstrate the definition in action.]",
  "question": "Using the example from the lecture, explain what [concept from reading] is and how it affects [relevant aspect].",
  "timeLimit": "30 seconds preparation, 60 seconds response"
}`,

        "Summary": `Create a TOEFL Speaking Summary task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "speaking",
  "type": "Summary",
  "difficulty": "${difficulty}",
  "audio": "Now you will listen to a lecture. You will then be asked to summarize the lecture.",
  "transcript": "[Create original academic lecture about a specific topic from biology, psychology, history, environmental science, or business. 200-250 words with clear main points, supporting details, and examples. Include 2-3 key concepts that can be summarized.]",
  "question": "Using points and examples from the talk, explain [main topic/concept from the lecture].",
  "timeLimit": "20 seconds preparation, 60 seconds response"
}`
      },

      writing: {
        Integrated: `Create a TOEFL Writing Integrated task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "writing",
  "type": "Integrated",
  "difficulty": "${difficulty}",
  "reading": "[Create an original 250-300 word passage presenting 3 clear points about a topic like: biofuels, online education, sustainable agriculture, workplace policies, urban planning, etc. Each paragraph should present one main point with supporting details and evidence.]",
  "audio": "Now you will hear a lecture about the same topic.",
  "transcript": "[Create original lecture where professor systematically addresses each of the 3 points from reading - either challenging them with counterarguments, providing additional evidence, or offering alternative perspectives. Make the relationship between reading and lecture clear.]",
  "question": "Summarize the points made in the lecture, being sure to explain how they respond to the specific concerns presented in the reading passage.",
  "timeLimit": "3 minutes reading + listening + 20 minutes writing",
  "wordLimit": "150-225 words"
}`,

        "Academic Discussion": `Create a TOEFL Writing Academic Discussion task using EXACT official TOEFL formats. Return only this JSON:
{
  "section": "writing",
  "type": "Academic Discussion", 
  "difficulty": "${difficulty}",
  "professorQuestion": "[Create professor's discussion question about topics like: professional development, technology in education, work-life balance, environmental responsibility, social media impact, teamwork vs individual work, etc. Should be 2-3 sentences introducing the topic and asking for opinions.]",
  "studentResponses": [
    {
      "name": "[Student name like Claire, Alex, Sarah, etc.]",
      "response": "[First student's opinion with 2-3 sentences presenting one clear perspective with reasoning]"
    },
    {
      "name": "[Different student name like Paul, Marcus, Lisa, etc.]", 
      "response": "[Second student's opinion with 2-3 sentences presenting opposing or different perspective with reasoning]"
    }
  ],
  "question": "Your professor is teaching a class on [relevant subject]. Write a post responding to the professor's question. In your response, you should do the following: • Express and support your opinion. • Make a contribution to the discussion in your own words. An effective response will contain at least 100 words.",
  "timeLimit": "10 minutes",
  "wordLimit": "At least 100 words"
}`
      }
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
    
    // Add authentic TOEFL formatting and randomize answer positions
    if ((section === 'reading' || section === 'listening') && questionData.options) {
      // Clean all options first
      const cleanOptions = questionData.options.map(option => 
        option.replace(/^[A-F]\s*\)?\s*/, '').trim()
      );
      
      // For summary questions (6 options), handle differently
      if (questionData.type === 'Summary' && cleanOptions.length === 6) {
        // First 3 are correct, shuffle all 6
        const shuffled = [...cleanOptions];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Add letters A-F
        questionData.options = shuffled.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          return `${letter} ${option}`;
        });
        
        // Find positions of the first 3 original options (which were correct)
        const correctPositions = [];
        for (let i = 0; i < 3; i++) {
          const pos = shuffled.findIndex(opt => opt === cleanOptions[i]);
          if (pos !== -1) {
            correctPositions.push(String.fromCharCode(65 + pos));
          }
        }
        questionData.correctAnswer = correctPositions.join(', ');
      } else {
        // For regular 4-option questions, randomize position of correct answer
        const correctAnswerContent = cleanOptions[0]; // First option is always correct
        const randomPosition = Math.floor(Math.random() * 4);
        
        // Create new array with correct answer in random position
        const newOptions = [...cleanOptions];
        
        // Move correct answer to random position
        if (randomPosition !== 0) {
          [newOptions[0], newOptions[randomPosition]] = [newOptions[randomPosition], newOptions[0]];
        }
        
        // Add letters A-D
        questionData.options = newOptions.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          return `${letter} ${option}`;
        });
        
        // Update correct answer letter
        questionData.correctAnswer = String.fromCharCode(65 + randomPosition);
      }
    }

    return Response.json(questionData);
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json(
      { error: "Failed to generate question", details: error.message },
      { status: 500 }
    );
  }
}