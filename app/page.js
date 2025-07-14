'use client'
// Copy the entire React component code from the artifact here
import React, { useState } from 'react';
import { Clock, BookOpen, Headphones, Mic, PenTool, Target, Zap, CheckCircle, Star, Timer, Brain, Lightbulb } from 'lucide-react';

import React, { useState } from 'react';
import { Clock, BookOpen, Headphones, Mic, PenTool, Target, Zap, CheckCircle, Star, Timer, Brain, Lightbulb } from 'lucide-react';

const TOEFLCrashCourse = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const sections = {
    overview: {
      title: "2-Day TOEFL Crash Course",
      icon: <Target className="w-6 h-6" />,
      color: "bg-gradient-to-r from-purple-600 to-blue-600"
    },
    reading: {
      title: "Reading Section",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-gradient-to-r from-green-600 to-teal-600"
    },
    listening: {
      title: "Listening Section",
      icon: <Headphones className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-600 to-indigo-600"
    },
    speaking: {
      title: "Speaking Section",
      icon: <Mic className="w-6 h-6" />,
      color: "bg-gradient-to-r from-orange-600 to-red-600"
    },
    writing: {
      title: "Writing Section",
      icon: <PenTool className="w-6 h-6" />,
      color: "bg-gradient-to-r from-pink-600 to-purple-600"
    },
    hacks: {
      title: "Pro Hacks & Tricks",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-gradient-to-r from-yellow-600 to-orange-600"
    }
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
        <p className="text-purple-100">Master the TOEFL with proven strategies, insider tips, and time-saving hacks!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center">
            <Timer className="w-5 h-5 mr-2" />
            Day 1: Foundation & Strategy
          </h3>
          <div className="space-y-3">
            <TaskItem id="day1-1" important>Complete Reading section strategies & practice</TaskItem>
            <TaskItem id="day1-2">Master Listening techniques & note-taking</TaskItem>
            <TaskItem id="day1-3">Learn Speaking templates & practice responses</TaskItem>
            <TaskItem id="day1-4">Study Writing structures & time management</TaskItem>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Day 2: Practice & Polish
          </h3>
          <div className="space-y-3">
            <TaskItem id="day2-1" important>Take full-length practice test</TaskItem>
            <TaskItem id="day2-2">Review mistakes & apply hacks</TaskItem>
            <TaskItem id="day2-3">Final speaking practice with timing</TaskItem>
            <TaskItem id="day2-4">Memorize key templates & vocabulary</TaskItem>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Quick Score Boosters
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+5-10</div>
            <div className="text-sm text-gray-600">Reading Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+3-8</div>
            <div className="text-sm text-gray-600">Speaking Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">+7-12</div>
            <div className="text-sm text-gray-600">Writing Score</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReading = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">📚 Reading Section Mastery</h2>
        <p className="text-green-100">54-72 minutes • 3-4 passages • 10 questions each</p>
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

      <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-blue-800 mb-4">🔥 Question Type Hacks</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Detail Questions (30%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Look for paraphrased information</li>
              <li>• Answer is usually in 1-2 sentences</li>
              <li>• Don't choose exact text matches</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Inference Questions (25%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Choose logical conclusions only</li>
              <li>• Avoid extreme language (always, never)</li>
              <li>• Look for implied connections</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Vocabulary Questions (20%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Replace word in sentence</li>
              <li>• Use prefix/suffix knowledge</li>
              <li>• Consider connotation (positive/negative)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Summary Questions (15%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Focus on main ideas only</li>
              <li>• Avoid specific details</li>
              <li>• Choose 3 of 6 options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderListening = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🎧 Listening Section Mastery</h2>
        <p className="text-blue-100">41-57 minutes • 3-4 lectures • 2-3 conversations • 5-6 questions each</p>
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

      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">🎯 Question Type Strategies</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Main Idea (25%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Listen to introduction carefully</li>
              <li>• Focus on thesis statement</li>
              <li>• Avoid specific details</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Detail (35%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Take notes on examples</li>
              <li>• Listen for definitions</li>
              <li>• Note cause-effect relationships</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Attitude (15%)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Listen to tone of voice</li>
              <li>• Note word choice</li>
              <li>• Pay attention to stress patterns</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-2 border-red-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-red-800 mb-4">🚨 Common Traps to Avoid</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Don't Fall For:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Answers that sound familiar but are wrong</li>
              <li>• Extreme language (always, never, all)</li>
              <li>• Details mentioned but not relevant to question</li>
              <li>• Information from wrong part of audio</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Do Look For:</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Paraphrased information from audio</li>
              <li>• Answers that match the speaker's tone</li>
              <li>• Information from the right section</li>
              <li>• Logical inferences from context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpeaking = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">🎤 Speaking Section Mastery</h2>
        <p className="text-orange-100">17 minutes • 4 tasks • 15-30 sec preparation • 45-60 sec response</p>
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

      <div className="bg-green-50 border-2 border-green-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-green-800 mb-4">📋 Task-Specific Strategies</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Tasks 1 (Independent)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Choose position quickly (don't overthink)</li>
              <li>• Use personal experiences as examples</li>
              <li>• Organize: Opinion → Reason 1 → Example → Reason 2 → Example</li>
              <li>• Common topics: education, technology, lifestyle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Tasks 2-4 (Integrated)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Take notes while reading/listening</li>
              <li>• Focus on main points, not details</li>
              <li>• Use information from BOTH sources</li>
              <li>• Don't add your own opinions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-blue-800 mb-4">🔥 Last-Minute Prep Checklist</h3>
        <div className="space-y-3">
          <TaskItem id="speak-10" important>Record yourself and check for clarity</TaskItem>
          <TaskItem id="speak-11">Practice with a timer - stick to time limits</TaskItem>
          <TaskItem id="speak-12">Memorize transition phrases and connectors</TaskItem>
          <TaskItem id="speak-13">Prepare examples for common independent topics</TaskItem>
          <TaskItem id="speak-14">Work on pronunciation of difficult words</TaskItem>
        </div>
      </div>
    </div>
  );

  const renderWriting = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">✍️ Writing Section Mastery</h2>
        <p className="text-pink-100">50 minutes • 2 tasks • Integrated (20 min) • Academic Discussion (10 min)</p>
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

      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">🎯 High-Scoring Phrases</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Contrast</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• However</li>
              <li>• In contrast</li>
              <li>• On the other hand</li>
              <li>• Nevertheless</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Support</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Furthermore</li>
              <li>• Additionally</li>
              <li>• Moreover</li>
              <li>• What's more</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Examples</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• For instance</li>
              <li>• Specifically</li>
              <li>• To illustrate</li>
              <li>• As evidence</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-2 border-red-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-red-800 mb-4">⏰ Time Management Hacks</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Integrated Writing (20 min)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• 3 min: Read passage and take notes</li>
              <li>• 2 min: Listen and take notes</li>
              <li>• 1 min: Plan your response</li>
              <li>• 12 min: Write (aim for 280+ words)</li>
              <li>• 2 min: Review and edit</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-700 mb-2">Academic Discussion (10 min)</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• 2 min: Read question and posts</li>
              <li>• 1 min: Plan your position</li>
              <li>• 6 min: Write response (100+ words)</li>
              <li>• 1 min: Quick review</li>
            </ul>
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

      <div className="bg-blue-50 border-2 border-blue-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-blue-800 mb-4">🔥 Score-Boosting Secrets</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Reading Secrets</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Questions are in passage order - use this to your advantage</li>
              <li>• Eliminate answers that are too specific or too general</li>
              <li>• Look for repeated keywords between question and passage</li>
              <li>• Summary questions: avoid minor details</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Speaking Secrets</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Speak with confidence even if you make mistakes</li>
              <li>• Use natural pauses, not "um" or "uh"</li>
              <li>• Vary your intonation - don't sound robotic</li>
              <li>• End with a brief conclusion if you have time</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border-2 border-purple-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-purple-800 mb-4">💡 Last-Minute Power Tips</h3>
        <div className="space-y-3">
          <TaskItem id="hack-11" important>Don't study new material the night before - review only</TaskItem>
          <TaskItem id="hack-12">Get 8+ hours of sleep before test day</TaskItem>
          <TaskItem id="hack-13">Eat a protein-rich breakfast for sustained energy</TaskItem>
          <TaskItem id="hack-14">Practice typing on QWERTY keyboard if you're not used to it</TaskItem>
          <TaskItem id="hack-15">Memorize common academic vocabulary (analyze, synthesize, evaluate)</TaskItem>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">🎉 Emergency Score Boosters (If You're Out of Time)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Reading (30 min study)</h4>
            <ul className="text-sm space-y-1 text-green-100">
              <li>• Memorize question types and keywords</li>
              <li>• Practice skimming techniques</li>
              <li>• Learn common wrong answer patterns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Speaking (1 hour study)</h4>
            <ul className="text-sm space-y-1 text-green-100">
              <li>• Memorize all 4 task templates</li>
              <li>• Practice with timer on phone</li>
              <li>• Record yourself speaking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-2 border-red-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-red-800 mb-4">🚨 Common Mistakes That Kill Your Score</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-red-700 mb-2">❌ DON'T Do This</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Spend too much time on one difficult question</li>
              <li>• Leave any questions blank (guess if necessary)</li>
              <li>• Use informal language in writing</li>
              <li>• Speak too fast or too slow</li>
              <li>• Panic if you don't understand everything</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">✅ DO This Instead</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Manage your time strictly</li>
              <li>• Make educated guesses</li>
              <li>• Use academic vocabulary</li>
              <li>• Speak at natural pace</li>
              <li>• Stay calm and focused</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">🎯 Score Prediction Formula</h3>
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold">Your Potential Score Range:</div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round((completedTasks.size / 50) * 120)} - {Math.round((completedTasks.size / 50) * 120) + 10}
          </div>
          <div className="text-sm text-gray-600">
            Based on completed tasks ({completedTasks.size}/50)
          </div>
          <div className="text-sm text-green-600 font-semibold">
            Complete all tasks to maximize your score potential!
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
            Follow this 2-day crash course and watch your score soar!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Proven Strategies</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Time-Saving Hacks</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Score Boosting Tips</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span>Templates & Examples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

export default function Home() {
  return <TOEFLCrashCourse />;
}