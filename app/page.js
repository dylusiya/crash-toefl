'use client'
import React, { useState } from 'react';
import { Clock, BookOpen, Headphones, Mic, PenTool, Target, Zap, CheckCircle, Star, Timer, Brain, Lightbulb, Play, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [showStrategies, setShowStrategies] = useState({});
  const [practiceScore, setPracticeScore] = useState(0);

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleShowAnswer = (questionId) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleShowStrategy = (questionId) => {
    setShowStrategies(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const sections = {
    practice: {
      title: "Practice & Learn",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-600 to-purple-600"
    },
    reading: {
      title: "Reading Strategies",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-gradient-to-r from-green-600 to-teal-600"
    },
    listening: {
      title: "Listening Strategies",
      icon: <Headphones className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-600 to-indigo-600"
    },
    speaking: {
      title: "Speaking Strategies",
      icon: <Mic className="w-6 h-6" />,
      color: "bg-gradient-to-r from-orange-600 to-red-600"
    },
    writing: {
      title: "Writing Strategies",
      icon: <PenTool className="w-6 h-6" />,
      color: "bg-gradient-to-r from-pink-600 to-purple-600"
    },
    hacks: {
      title: "Pro Tips & Hacks",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-gradient-to-r from-yellow-600 to-orange-600"
    },
    overview: {
      title: "2-Day Study Plan",
      icon: <Target className="w-6 h-6" />,
      color: "bg-gradient-to-r from-purple-600 to-blue-600"
    }
  };

  // Practice Questions Data with Strategies
  const readingQuestions = [
    {
      id: "read-q1",
      type: "Detail Question",
      difficulty: "Medium",
      passage: "The Industrial Revolution, which began in Britain in the late 18th century, fundamentally transformed manufacturing processes. Before this period, goods were primarily produced by hand in homes or small workshops. The introduction of mechanized production methods and the factory system revolutionized how products were made, leading to increased efficiency and output. Steam power became a driving force, enabling the operation of heavy machinery and facilitating transportation through steamships and railways.",
      question: "According to the passage, what was the primary method of production before the Industrial Revolution?",
      options: [
        "A) Factory-based manufacturing with steam power",
        "B) Hand production in homes or small workshops", 
        "C) Mechanized production using heavy machinery",
        "D) Transportation-based manufacturing systems"
      ],
      correct: "B",
      explanation: "The passage explicitly states 'Before this period, goods were primarily produced by hand in homes or small workshops.' This directly answers the question about pre-Industrial Revolution production methods.",
      strategy: {
        title: "How to Answer Detail Questions",
        steps: [
          "1. Identify key words in the question ('primary method', 'before Industrial Revolution')",
          "2. Scan the passage for these exact keywords or synonyms",
          "3. Look for phrases like 'Before this period' which signal the answer",
          "4. Find the specific sentence: 'goods were primarily produced by hand in homes or small workshops'",
          "5. Match this information with option B - exact paraphrase"
        ],
        tips: [
          "Detail questions ask for specific information stated in the passage",
          "The answer is usually a paraphrase, not exact words from the passage",
          "Look for time indicators like 'before', 'after', 'during'",
          "Wrong answers often mix information from different parts of the passage"
        ],
        timeStrategy: "Spend 1-2 minutes max. Scan, don't read every word."
      }
    },
    {
      id: "read-q2", 
      type: "Inference Question",
      difficulty: "Hard",
      passage: "Despite its benefits, urbanization during the Industrial Revolution created significant challenges. Cities grew rapidly but lacked adequate infrastructure. Housing was often overcrowded and unsanitary, leading to health problems. However, this period also saw the emergence of a new middle class and increased economic opportunities for many people.",
      question: "What can be inferred about living conditions during early industrialization?",
      options: [
        "A) They were consistently improved for all social classes",
        "B) They were problematic but offered new economic prospects",
        "C) They were mainly beneficial for the working class",
        "D) They remained unchanged from pre-industrial times"
      ],
      correct: "B",
      explanation: "The passage mentions 'significant challenges' and 'overcrowded and unsanitary' housing, but also notes 'emergence of a new middle class and increased economic opportunities.' This suggests problems existed alongside new prospects.",
      strategy: {
        title: "How to Answer Inference Questions",
        steps: [
          "1. Understand what inference means: logical conclusion based on given information",
          "2. Read the relevant section carefully: 'significant challenges' + 'economic opportunities'",
          "3. Look for contrasting ideas: 'Despite benefits' and 'However' signal both positive and negative",
          "4. Combine the evidence: problems (overcrowded housing) + benefits (new middle class)",
          "5. Choose the option that reflects BOTH aspects, not just one"
        ],
        tips: [
          "Inference questions require you to 'read between the lines'",
          "Look for signal words: 'however', 'despite', 'although' that show contrast",
          "Avoid extreme answers (always, never, all, none)",
          "The correct answer is usually moderate and balanced"
        ],
        timeStrategy: "Spend 2-3 minutes. These need more careful analysis."
      }
    }
  ];

  const listeningQuestions = [
    {
      id: "listen-q1",
      type: "Main Purpose Question",
      difficulty: "Easy",
      audio: "🎧 Listen to the conversation between a student and advisor about course selection.",
      transcript: "Student: Hi, I'm having trouble deciding between Biology 101 and Chemistry 101 for next semester. Advisor: Well, what's your major? Student: I'm pre-med, but I'm also interested in environmental science. Advisor: Both courses would be beneficial, but I'd recommend starting with Biology 101. It provides a better foundation for medical school and covers some environmental topics too. You can take Chemistry 101 the following semester.",
      question: "What is the main purpose of this conversation?",
      options: [
        "A) To discuss environmental science career options",
        "B) To get advice on course selection for next semester",
        "C) To change majors from pre-med to environmental science", 
        "D) To schedule Chemistry 101 for the current semester"
      ],
      correct: "B",
      explanation: "The student explicitly states they're 'having trouble deciding between Biology 101 and Chemistry 101 for next semester' and seeks the advisor's recommendation.",
      strategy: {
        title: "How to Answer Main Purpose Questions",
        steps: [
          "1. Listen to the opening statement carefully - it usually reveals the purpose",
          "2. Identify the student's problem: 'having trouble deciding between' courses",
          "3. Notice what the student is asking for: advice/recommendation",
          "4. Focus on the overall goal, not specific details mentioned",
          "5. The purpose is to get course selection advice, not discuss careers or change majors"
        ],
        tips: [
          "Main purpose is usually stated in the first 1-2 sentences",
          "Focus on WHY the conversation is happening, not WHAT topics are mentioned",
          "Wrong answers often contain details mentioned but aren't the main point",
          "Listen for phrases like 'I need help with', 'I'm wondering about', 'Can you tell me'"
        ],
        timeStrategy: "Take notes on the opening - that's where the purpose is!"
      }
    },
    {
      id: "listen-q2",
      type: "Detail Question",
      difficulty: "Medium",
      audio: "🎧 Listen to a lecture about renewable energy sources.",
      transcript: "Professor: Today we'll discuss solar energy efficiency. Modern solar panels convert approximately 20-22% of sunlight into electricity. While this might seem low, it's actually a significant improvement from the 6% efficiency of early panels in the 1950s. Current research focuses on developing panels that could reach 30% efficiency within the next decade.",
      question: "According to the lecture, what was the efficiency of early solar panels?",
      options: [
        "A) 20-22%",
        "B) 30%",
        "C) 6%",
        "D) The information was not provided"
      ],
      correct: "C",
      explanation: "The professor clearly states that early panels in the 1950s had '6% efficiency,' contrasting this with modern panels' 20-22% efficiency.",
      strategy: {
        title: "How to Answer Listening Detail Questions",
        steps: [
          "1. Take notes on all numbers and percentages mentioned",
          "2. Note the time periods: 'early panels in 1950s' vs 'modern panels' vs 'future panels'",
          "3. Listen for comparison words: 'improvement from' signals the old number",
          "4. Write down: Early 1950s = 6%, Modern = 20-22%, Future = 30%",
          "5. Match the question timeframe (early panels) with your notes (6%)"
        ],
        tips: [
          "Always note numbers, dates, and percentages while listening",
          "Pay attention to time indicators: past, present, future",
          "Listen for comparison language: 'improved from', 'increased to', 'better than'",
          "Organize your notes by time periods or categories"
        ],
        timeStrategy: "Write down ALL numbers as you hear them - don't rely on memory!"
      }
    }
  ];

  const speakingQuestions = [
    {
      id: "speak-q1",
      type: "Independent Task",
      difficulty: "Medium",
      question: "Some people prefer to study alone, while others prefer to study in groups. Which do you prefer and why? Use specific reasons and examples to support your answer.",
      time: "Preparation: 15 seconds | Response: 45 seconds",
      sampleResponse: "I prefer studying in groups for several reasons. First, group study helps me understand difficult concepts better because we can explain ideas to each other. For example, when I was struggling with calculus, my study group members helped clarify complex formulas. Second, studying with others keeps me motivated and accountable. When I study alone, I sometimes get distracted or procrastinate, but in a group, I stay focused. Additionally, group discussions often reveal different perspectives that I wouldn't have considered on my own.",
      strategy: {
        title: "How to Answer Independent Speaking Questions",
        steps: [
          "1. Pick a side immediately - don't waste time deciding (choose group study)",
          "2. Plan 2-3 reasons quickly: understanding concepts, motivation, different perspectives",
          "3. Think of 1 specific example: calculus study group experience",
          "4. Use clear structure: State preference → Reason 1 + Example → Reason 2 → Conclusion",
          "5. Practice transition words: 'First', 'Second', 'For example', 'Additionally'"
        ],
        tips: [
          "Choose the side you can support with examples, not necessarily your true preference",
          "Personal experiences make the strongest examples",
          "Use the full 45 seconds - add details to reach time limit",
          "Speak clearly and at moderate pace - don't rush"
        ],
        timeStrategy: "15 sec prep: 5 sec choose side, 10 sec plan reasons and example"
      }
    },
    {
      id: "speak-q2",
      type: "Integrated Task",
      difficulty: "Hard",
      reading: "University Announcement: The library will extend its hours starting next month. Instead of closing at 10 PM, it will now remain open until midnight on weekdays. This change responds to student requests for more study time during finals period.",
      listening: "🎧 Student conversation: 'This is great news! I'm always rushing to finish my research before 10 PM. But I'm worried about safety - walking back to the dorms at midnight might not be safe, especially for students without cars.'",
      question: "The woman expresses her opinion about the library hour extension. State her opinion and explain the reasons she gives for holding that opinion.",
      sampleResponse: "The woman has mixed feelings about the library hour extension. She supports the change because she often feels rushed to complete her research before the current 10 PM closing time. However, she's concerned about safety issues, specifically that walking back to dormitories at midnight could be dangerous, particularly for students who don't have cars for transportation.",
      strategy: {
        title: "How to Answer Integrated Speaking Questions",
        steps: [
          "1. Read the announcement and note key info: library hours 10 PM → midnight",
          "2. Listen for the student's OPINION: positive ('great news') + negative (safety worry)",
          "3. Note her REASONS: rushed before 10 PM + safety concerns at midnight",
          "4. Structure: Overall opinion → Positive reason → Negative reason",
          "5. Use past tense: 'The woman said/believed/was concerned'"
        ],
        tips: [
          "Never give your own opinion - only report what the student said",
          "Include BOTH positive and negative points if the student mentions both",
          "Use phrases like 'The woman believes/argues/is concerned that'",
          "Take notes on specific reasons, not just general feelings"
        ],
        timeStrategy: "Note-taking is crucial - write down reasons while listening!"
      }
    }
  ];

  const writingQuestions = [
    {
      id: "write-q1",
      type: "Integrated Writing",
      difficulty: "Hard",
      reading: "Reading Passage: Remote work has become increasingly popular, offering employees flexibility and companies cost savings on office space. Supporters argue that remote work increases productivity, improves work-life balance, and reduces commuting stress. Companies can also hire talent from anywhere in the world.",
      listening: "🎧 Lecture: However, the professor argues that remote work has significant drawbacks. First, collaboration suffers because spontaneous discussions and brainstorming sessions are harder to achieve virtually. Second, many employees struggle with isolation and lack of social interaction, which can affect mental health. Finally, it's difficult to maintain company culture and train new employees effectively when everyone works remotely.",
      question: "Summarize the points made in the lecture, explaining how they challenge the specific points made in the reading passage.",
      sampleResponse: "The lecture challenges the reading's positive view of remote work by highlighting three main problems. First, while the reading suggests remote work benefits companies, the professor argues that collaboration becomes difficult because spontaneous discussions and brainstorming sessions are harder to achieve in virtual environments. Second, contrary to the reading's claim about improved work-life balance, the professor points out that many remote employees actually experience isolation and reduced social interaction, which negatively impacts their mental health. Finally, although the reading mentions cost savings and global hiring benefits, the professor emphasizes that maintaining company culture and effectively training new employees becomes much more challenging in remote work settings.",
      strategy: {
        title: "How to Answer Integrated Writing Questions",
        steps: [
          "1. Read the passage and identify 3 main benefits: flexibility, productivity, global hiring",
          "2. Listen to lecture and note 3 counterarguments: collaboration issues, isolation, culture problems",
          "3. Create point-by-point structure: Reading point 1 vs Lecture point 1, etc.",
          "4. Use contrast language: 'While the reading claims...the professor argues...'",
          "5. Focus on HOW the lecture challenges reading, not just what each says"
        ],
        tips: [
          "Never state your personal opinion - only summarize the conflict",
          "Use academic language: 'The professor contends/argues/challenges'",
          "Connect each lecture point to a specific reading point",
          "Aim for 280+ words in 20 minutes"
        ],
        timeStrategy: "3 min read + 2 min listen + 1 min plan + 12 min write + 2 min review"
      }
    },
    {
      id: "write-q2",
      type: "Academic Discussion",
      difficulty: "Medium",
      prompt: "Professor: Today we're discussing urban planning. Some cities are implementing car-free zones in downtown areas to reduce pollution and encourage walking. What are your thoughts on this approach?",
      student1: "Sarah: I think car-free zones are excellent! They reduce air pollution and make cities more livable. People get more exercise walking, and local businesses benefit from increased foot traffic. European cities like Copenhagen have shown this works well.",
      student2: "Mike: I'm not convinced. Car-free zones might work in small areas, but they can create traffic congestion in surrounding streets. Also, what about people with disabilities who rely on cars? And businesses might lose customers who can't easily access the area.",
      question: "In your response, you should express your own opinion and contribute to the discussion. An effective response will be 100-120 words.",
      sampleResponse: "I agree with Sarah that car-free zones offer significant benefits, but Mike raises valid concerns that need addressing. While these zones do reduce pollution and promote healthier lifestyles, cities must implement them thoughtfully. For accessibility issues, cities could provide shuttle services or designated pickup/drop-off points at zone entrances for people with disabilities. To address traffic congestion, planners should improve public transportation and create adequate parking facilities outside the zones. Copenhagen's success, as Sarah mentioned, demonstrates that with proper planning and community support, car-free zones can revitalize downtown areas while maintaining accessibility for all residents.",
      strategy: {
        title: "How to Answer Academic Discussion Questions",
        steps: [
          "1. Read all posts and identify the main positions: Sarah (pro) vs Mike (con)",
          "2. Take a position but acknowledge other viewpoints: 'I agree with Sarah, but Mike raises valid points'",
          "3. Address specific concerns raised: accessibility and traffic congestion",
          "4. Provide solutions: shuttle services, better public transport",
          "5. Reference other students' points: 'Copenhagen's success, as Sarah mentioned'"
        ],
        tips: [
          "Take a clear position but show you understand multiple perspectives",
          "Respond to specific points made by other students",
          "Provide practical solutions to problems raised",
          "Keep response between 100-120 words"
        ],
        timeStrategy: "2 min read posts + 1 min plan position + 6 min write + 1 min review"
      }
    }
  ];

  const calculateScore = () => {
    try {
      const questions = [...readingQuestions, ...listeningQuestions, ...speakingQuestions, ...writingQuestions];
      let correct = 0;
      questions.forEach(q => {
        if (selectedAnswers[q.id] === q.correct) {
          correct++;
        }
      });
      const score = Math.round((correct / questions.length) * 120);
      setPracticeScore(score);
    } catch (error) {
      console.log('Error calculating score:', error);
      setPracticeScore(0);
    }
  };

  const QuestionCard = ({ question, section }) => {
    const isAnswered = selectedAnswers[question.id];
    const showAnswer = showAnswers[question.id];
    const showStrategy = showStrategies[question.id];
    const isCorrect = selectedAnswers[question.id] === question.correct;

    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'Easy': return 'bg-green-100 text-green-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Hard': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 mb-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                {question.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </span>
            </div>
            {question.time && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                ⏰ {question.time}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Reading Passage */}
          {question.passage && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reading Passage
              </h4>
              <p className="text-gray-700 leading-relaxed">{question.passage}</p>
            </div>
          )}

          {/* Reading (for integrated tasks) */}
          {question.reading && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-800 mb-3">📖 Reading:</h4>
              <p className="text-gray-700 leading-relaxed">{question.reading}</p>
            </div>
          )}

          {/* Audio/Listening */}
          {question.audio && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                {question.audio}
              </h4>
              {question.transcript && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Transcript:</p>
                  <p className="text-gray-700 italic">{question.transcript}</p>
                </div>
              )}
            </div>
          )}

          {/* Academic Discussion Context */}
          {question.prompt && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-purple-800 mb-3">📚 Discussion Context:</h4>
              <p className="text-gray-700 mb-3 font-medium">{question.prompt}</p>
              {question.student1 && (
                <div className="mb-3 p-3 bg-white rounded border-l-4 border-blue-400">
                  <p className="text-gray-700">{question.student1}</p>
                </div>
              )}
              {question.student2 && (
                <div className="p-3 bg-white rounded border-l-4 border-green-400">
                  <p className="text-gray-700">{question.student2}</p>
                </div>
              )}
            </div>
          )}

          {/* Question */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Question:
            </h4>
            <p className="text-gray-800 font-medium">{question.question}</p>
          </div>

          {/* Multiple Choice Options */}
          {question.options && (
            <div className="mb-6">
              <h5 className="font-semibold text-gray-700 mb-3">Choose your answer:</h5>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const letter = option.charAt(0);
                  const isSelected = selectedAnswers[question.id] === letter;
                  const isCorrectOption = letter === question.correct;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(question.id, letter)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${
                        showAnswer
                          ? isCorrectOption
                            ? 'border-green-500 bg-green-50 text-green-800'
                            : isSelected
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-gray-200 bg-gray-50'
                          : isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {!showAnswer && isAnswered && (
              <button
                onClick={() => handleShowAnswer(question.id)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Show Answer
              </button>
            )}
            
            {!showStrategy && (
              <button
                onClick={() => handleShowStrategy(question.id)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Show Strategy
              </button>
            )}
          </div>

          {/* Answer & Explanation */}
          {showAnswer && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
              <div className="flex items-center mb-3">
                {isCorrect ? (
                  <span className="text-green-600 font-bold text-lg">✅ Correct!</span>
                ) : (
                  <span className="text-red-600 font-bold text-lg">❌ Incorrect</span>
                )}
                <span className="ml-3 text-gray-600 font-medium">Correct answer: {question.correct}</span>
              </div>
              <div className="bg-white p-4 rounded border">
                <h5 className="font-bold text-gray-800 mb-2">Explanation:</h5>
                <p className="text-gray-700">{question.explanation}</p>
              </div>
              
              {/* Sample Response for Speaking/Writing */}
              {question.sampleResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
                  <h5 className="font-bold text-blue-800 mb-2">💡 Sample Response:</h5>
                  <p className="text-gray-700 leading-relaxed">{question.sampleResponse}</p>
                </div>
              )}
            </div>
          )}

          {/* Strategy Section */}
          {showStrategy && question.strategy && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                {question.strategy.title}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-bold text-purple-700 mb-3 flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Step-by-Step Strategy:
                  </h5>
                  <ol className="space-y-2">
                    {question.strategy.steps.map((step, index) => (
                      <li key={index} className="text-gray-700 text-sm leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-bold text-yellow-700 mb-3 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Pro Tips:
                    </h5>
                    <ul className="space-y-1">
                      {question.strategy.tips.map((tip, index) => (
                        <li key={index} className="text-gray-700 text-sm leading-relaxed">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-red-200">
                    <h5 className="font-bold text-red-700 mb-2 flex items-center">
                      <Timer className="w-5 h-5 mr-2" />
                      Time Strategy:
                    </h5>
                    <p className="text-gray-700 text-sm">{question.strategy.timeStrategy}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPractice = () => {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-3">🧠 Practice & Learn</h2>
          <p className="text-blue-100 text-lg">Try real TOEFL questions, then learn the strategies to master them!</p>
          <div className="mt-4 bg-white bg-opacity-20 p-3 rounded-lg">
            <p className="text-sm">💡 Method: Answer questions first → See if you're right → Learn the strategy</p>
          </div>
        </div>

        {/* Score Tracker */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-purple-600 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Practice Score Tracker
            </h3>
            <button
              onClick={calculateScore}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Calculate Score
            </button>
          </div>
          {practiceScore > 0 && (
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{practiceScore}/120</div>
                <div className="text-gray-600 font-medium mb-3">Estimated TOEFL Score</div>
                <div className="text-lg font-medium text-purple-700">
                  {practiceScore >= 100 ? "🎉 Excellent! You're ready!" : 
                   practiceScore >= 80 ? "👍 Good progress! Keep practicing!" : 
                   "📚 Keep studying - you'll improve!"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reading Section */}
        <div className="bg-green-50 border-2 border-green-400 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Reading Questions
          </h3>
          <div className="mb-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">📖 Try these reading questions, then learn the strategies that guarantee correct answers!</p>
          </div>
          {readingQuestions.map(question => (
            <QuestionCard key={question.id} question={question} section="reading" />
          ))}
        </div>

        {/* Listening Section */}
        <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Headphones className="w-8 h-8 mr-3" />
            Listening Questions
          </h3>
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <p className="text-blue-800 font-medium">🎧 Practice with realistic listening scenarios, then master the note-taking strategies!</p>
          </div>
          {listeningQuestions.map(question => (
            <QuestionCard key={question.id} question={question} section="listening" />
          ))}
        </div>

        {/* Speaking Section */}
        <div className="bg-orange-50 border-2 border-orange-400 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
            <Mic className="w-8 h-8 mr-3" />
            Speaking Questions
          </h3>
          <div className="mb-4 p-4 bg-orange-100 rounded-lg">
            <p className="text-orange-800 font-medium">🎤 Practice speaking responses, then learn the templates that boost your score!</p>
          </div>
          {speakingQuestions.map(question => (
            <QuestionCard key={question.id} question={question} section="speaking" />
          ))}
        </div>

        {/* Writing Section */}
        <div className="bg-pink-50 border-2 border-pink-400 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
            <PenTool className="w-8 h-8 mr-3" />
            Writing Questions
          </h3>
          <div className="mb-4 p-4 bg-pink-100 rounded-lg">
            <p className="text-pink-800 font-medium">✍️ Try writing responses, then learn the structures that guarantee high scores!</p>
          </div>
          {writingQuestions.map(question => (
            <QuestionCard key={question.id} question={question} section="writing" />
          ))}
        </div>

        {/* How to Use Guide */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            How to Use This Practice Section
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">1️⃣</div>
              <h4 className="font-bold text-blue-700 mb-2">Try the Question</h4>
              <p className="text-gray-700 text-sm">Read/listen to the material and choose your answer. Don't peek at strategies yet!</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">2️⃣</div>
              <h4 className="font-bold text-green-700 mb-2">Check Your Answer</h4>
              <p className="text-gray-700 text-sm">Click "Show Answer" to see if you got it right and read the explanation.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">3️⃣</div>
              <h4 className="font-bold text-purple-700 mb-2">Learn the Strategy</h4>
              <p className="text-gray-700 text-sm">Click "Show Strategy" to learn step-by-step methods for similar questions.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ id, children, important = false }) => (
    <div 
      className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
        completedTasks.has(id) ? 'bg-green-50 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
      } ${important ? 'border-2 border-yellow-400' : 'border'}`}
      onClick={() => toggleTask(id)}
    >
      <CheckCircle className={`w-5 h-5 mt-0.5 ${completedTasks.has(id) ? 'text-green-600' : 'text-gray-400'}`} />
      <div className="flex-1">
        {important && <Star className="w-4 h-4 text-yellow-500 inline mr-1" />}
        <span className={completedTasks.has(id) ? 'line-through text-gray-500' : ''}>{children}</span>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🚀 TOEFL iBT 2-Day Crash Course</h2>
        <p className="text-purple-100">Master the TOEFL with practice questions + proven strategies!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
            <Timer className="w-5 h-5 mr-2" />
            Day 1: Practice & Learn
          </h3>
          <div className="space-y-3">
            <TaskItem id="day1-1" important>Try practice questions in each section</TaskItem>
            <TaskItem id="day1-2">Learn strategies for each question type</TaskItem>
            <TaskItem id="day1-3">Master time management techniques</TaskItem>
            <TaskItem id="day1-4">Memorize key templates and phrases</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Day 2: Apply & Perfect
          </h3>
          <div className="space-y-3">
            <TaskItem id="day2-1" important>Take full-length practice test</TaskItem>
            <TaskItem id="day2-2">Apply all learned strategies</TaskItem>
            <TaskItem id="day2-3">Review pro tips and hacks</TaskItem>
            <TaskItem id="day2-4">Final confidence building</TaskItem>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Why This Method Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">Practice First</div>
            <div className="text-sm text-gray-600">Try real questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">Learn Strategy</div>
            <div className="text-sm text-gray-600">Understand the method</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">Master Skills</div>
            <div className="text-sm text-gray-600">Apply to any question</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReading = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">📚 Reading Section Strategies</h2>
        <p className="text-green-100">Master every question type with proven techniques</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-green-600 mb-4">🎯 Core Strategies</h3>
          <div className="space-y-3">
            <TaskItem id="read-1" important>NEVER read the full passage first - go straight to questions</TaskItem>
            <TaskItem id="read-2">Use the "keyword scanning" technique for detail questions</TaskItem>
            <TaskItem id="read-3">Master the "elimination method" - cross out obviously wrong answers</TaskItem>
            <TaskItem id="read-4">For inference questions, choose the MOST conservative answer</TaskItem>
            <TaskItem id="read-5">Vocabulary questions: use context clues and word parts</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-red-600 mb-4">⚡ Time-Saving Hacks</h3>
          <div className="space-y-3">
            <TaskItem id="read-6" important>Spend max 18 minutes per passage (including questions)</TaskItem>
            <TaskItem id="read-7">Read question stems first, then scan for answers</TaskItem>
            <TaskItem id="read-8">Skip difficult questions and return later</TaskItem>
            <TaskItem id="read-9">Use paragraph summaries for main idea questions</TaskItem>
            <TaskItem id="read-10">For "insert text" questions, look for transition words</TaskItem>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListening = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🎧 Listening Section Strategies</h2>
        <p className="text-blue-100">Perfect note-taking and active listening techniques</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-blue-600 mb-4">📝 Note-Taking System</h3>
          <div className="space-y-3">
            <TaskItem id="listen-1" important>Develop your own abbreviation system (w/ = with, b/c = because)</TaskItem>
            <TaskItem id="listen-2">Focus on signal words: "however", "therefore", "in contrast"</TaskItem>
            <TaskItem id="listen-3">Write down examples and their purposes</TaskItem>
            <TaskItem id="listen-4">Note speaker's attitude and tone changes</TaskItem>
            <TaskItem id="listen-5">Track conversation flow and topic shifts</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-purple-600 mb-4">🧠 Active Listening Hacks</h3>
          <div className="space-y-3">
            <TaskItem id="listen-6" important>Predict what comes next based on context</TaskItem>
            <TaskItem id="listen-7">Listen for repeated information (usually important)</TaskItem>
            <TaskItem id="listen-8">Pay attention to speaker's emphasis and pauses</TaskItem>
            <TaskItem id="listen-9">Note rhetorical questions (often signal main points)</TaskItem>
            <TaskItem id="listen-10">Identify organizational patterns (cause/effect, compare/contrast)</TaskItem>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpeaking = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🎤 Speaking Section Strategies</h2>
        <p className="text-orange-100">Templates and techniques for high-scoring responses</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-orange-600 mb-4">⚡ Universal Templates</h3>
          <div className="space-y-3">
            <TaskItem id="speak-1" important>Task 1: "I believe [opinion] for two reasons. First, [reason 1] because [example]. Second, [reason 2] because [example]."</TaskItem>
            <TaskItem id="speak-2">Task 2: "The [man/woman] [agrees/disagrees] with [proposal] for two reasons. First, [reason 1]. Second, [reason 2]."</TaskItem>
            <TaskItem id="speak-3">Task 3: "The professor explains [concept] by giving [number] examples. First, [example 1]. Second, [example 2]."</TaskItem>
            <TaskItem id="speak-4">Task 4: "The professor discusses [topic]. He/She explains that [main point] and gives examples of [examples]."</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-red-600 mb-4">🎯 Scoring Hacks</h3>
          <div className="space-y-3">
            <TaskItem id="speak-5" important>Use transition words: "First", "Additionally", "For example", "In conclusion"</TaskItem>
            <TaskItem id="speak-6">Speak at moderate pace - don't rush!</TaskItem>
            <TaskItem id="speak-7">Use varied sentence structures (simple, compound, complex)</TaskItem>
            <TaskItem id="speak-8">Include specific details and examples</TaskItem>
            <TaskItem id="speak-9">Practice filler phrases: "What I mean is...", "In other words..."</TaskItem>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWriting = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">✍️ Writing Section Strategies</h2>
        <p className="text-pink-100">Structures and templates for high-scoring essays</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-pink-600 mb-4">📝 Integrated Writing Template</h3>
          <div className="space-y-3">
            <TaskItem id="write-1" important>Intro: "The reading passage discusses [topic]. The professor challenges this by [main argument]."</TaskItem>
            <TaskItem id="write-2">Body 1: "First, the reading states [point 1]. However, the professor argues [counter-argument] because [reason]."</TaskItem>
            <TaskItem id="write-3">Body 2: "Second, the passage claims [point 2]. The professor disagrees, explaining [counter-argument]."</TaskItem>
            <TaskItem id="write-4">Body 3: "Finally, the reading suggests [point 3]. The professor refutes this by [counter-argument]."</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-purple-600 mb-4">💬 Academic Discussion Strategy</h3>
          <div className="space-y-3">
            <TaskItem id="write-5" important>Read question and previous posts carefully</TaskItem>
            <TaskItem id="write-6">Take a clear position and stick to it</TaskItem>
            <TaskItem id="write-7">Respond to other students' ideas</TaskItem>
            <TaskItem id="write-8">Use academic vocabulary and formal tone</TaskItem>
            <TaskItem id="write-9">Aim for 100+ words with specific examples</TaskItem>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHacks = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">⚡ Pro Hacks & Tricks</h2>
        <p className="text-yellow-100">Secret strategies that can boost your score by 10-20 points!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">🎯 Test Day Hacks</h3>
          <div className="space-y-3">
            <TaskItem id="hack-1" important>Bring earplugs - test centers can be noisy</TaskItem>
            <TaskItem id="hack-2">Take the 10-minute break - eat snacks and stretch</TaskItem>
            <TaskItem id="hack-3">Use the scratch paper strategically for each section</TaskItem>
            <TaskItem id="hack-4">Arrive 30 minutes early to avoid stress</TaskItem>
            <TaskItem id="hack-5">Choose your seat carefully - avoid distractions</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-4">🧠 Mental Strategies</h3>
          <div className="space-y-3">
            <TaskItem id="hack-6" important>If you mess up one section, don't panic - keep going</TaskItem>
            <TaskItem id="hack-7">Use positive self-talk: "I am prepared and confident"</TaskItem>
            <TaskItem id="hack-8">Practice deep breathing between sections</TaskItem>
            <TaskItem id="hack-9">Visualize success before starting each section</TaskItem>
            <TaskItem id="hack-10">Stay hydrated but don't drink too much</TaskItem>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === key
                    ? `${section.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.icon}
                <span className="hidden sm:inline">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-600">
              Progress: {completedTasks.size}/50 tasks completed
            </div>
            <div className="text-sm font-medium text-blue-600">
              {Math.round((completedTasks.size / 50) * 100)}% Complete
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedTasks.size / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeSection === 'practice' && renderPractice()}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'reading' && renderReading()}
        {activeSection === 'listening' && renderListening()}
        {activeSection === 'speaking' && renderSpeaking()}
        {activeSection === 'writing' && renderWriting()}
        {activeSection === 'hacks' && renderHacks()}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">🚀 Ready to Crush the TOEFL?</h3>
          <p className="text-gray-300 mb-4">
            Practice with real questions, then master the strategies!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Real Practice Questions</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Step-by-Step Strategies</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Pro Tips & Hacks</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Score Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}