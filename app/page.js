'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Brain, BookOpen, Headphones, Mic, PenTool, Loader, Star, Target, CheckCircle, AlertCircle, Volume2, VolumeX, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, X, FileText, Copy, Clock } from 'lucide-react';

// ===== TEXT-TO-SPEECH HOOK =====
const useTextToSpeech = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window);
    
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter to only English voices
        const englishVoices = availableVoices.filter(voice => 
          voice.lang.startsWith('en')
        );
        setVoices(englishVoices);
        
        if (englishVoices.length > 0) {
          // Try to find a good English voice, prefer female voices
          const englishVoice = englishVoices.find(voice => 
            voice.name.toLowerCase().includes('female')
          ) || englishVoices.find(voice => 
            voice.name.toLowerCase().includes('karen') || 
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('alex')
          ) || englishVoices[0];
          
          setSelectedVoice(englishVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Fallback for mobile
      setTimeout(loadVoices, 1000);
      setTimeout(loadVoices, 2000); // Additional fallback
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentUtterance(utterance);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentUtterance(null);
  }, []);

  return {
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    isPlaying,
    speak,
    stop
  };
};

// ===== VOICE SETTINGS COMPONENT =====
const VoiceSettings = () => {
  const { isSupported, voices, selectedVoice, setSelectedVoice } = useTextToSpeech();

  if (!isSupported || voices.length === 0) return null;

  const handleVoiceChange = (e) => {
    const selectedVoiceName = e.target.value;
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (voice) {
      setSelectedVoice(voice);
      console.log('Voice changed to:', voice.name, voice.lang);
      
      // Test the new voice
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const testUtterance = new SpeechSynthesisUtterance("Voice changed successfully");
        testUtterance.voice = voice;
        testUtterance.rate = 0.9;
        window.speechSynthesis.speak(testUtterance);
      }
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-2">
        🎤 English Voice Settings ({voices.length} voices available)
      </label>
      <select
        value={selectedVoice?.name || ''}
        onChange={handleVoiceChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
      >
        {voices.map((voice, index) => (
          <option key={`${voice.name}-${index}`} value={voice.name} className="text-gray-800">
            {voice.name} ({voice.lang})
            {voice.default ? ' (Default)' : ''}
            {voice.localService ? ' (Local)' : ' (Network)'}
          </option>
        ))}
      </select>
    </div>
  );
};

// ===== LISTENING SIMULATOR FOR LISTENING SECTION =====
const ListeningSimulator = ({ scenario, transcript }) => {
  const { isSupported, speak, stop, isPlaying } = useTextToSpeech();
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      setHasStarted(true);
      speak(transcript, { rate: 0.9 });
    }
  };

  const handleReplay = () => {
    stop();
    setTimeout(() => {
      speak(transcript, { rate: 0.9 });
    }, 100);
  };

  if (!isSupported) {
    return (
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h4 className="font-bold text-green-800 mb-3 flex items-center">
          <Headphones className="w-5 h-5 mr-2" />
          Listening Scenario
        </h4>
        <p className="text-gray-700 leading-relaxed mb-3">{scenario}</p>
        
        <div className="mt-3 p-3 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
          <p className="text-gray-700 italic leading-relaxed">{transcript}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
      <h4 className="font-bold text-green-800 mb-3 flex items-center">
        <Headphones className="w-5 h-5 mr-2" />
        Listening Scenario
      </h4>
      <p className="text-gray-700 leading-relaxed mb-4">{scenario}</p>
      
      {/* Audio Controls */}
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={handlePlay}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isPlaying 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play Audio</span>
            </>
          )}
        </button>
        
        {hasStarted && (
          <button
            onClick={handleReplay}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>
        )}
        
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>{showTranscript ? 'Hide' : 'Show'} Transcript</span>
        </button>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <div className="mt-3 p-3 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
          <p className="text-gray-700 italic leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
};

// ===== INTEGRATED LISTENING SIMULATOR FOR SPEAKING/WRITING =====
const IntegratedListeningSimulator = ({ title, transcript }) => {
  const { isSupported, speak, stop, isPlaying } = useTextToSpeech();
  const [showTranscript, setShowTranscript] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      stop();
    } else {
      setHasStarted(true);
      speak(transcript, { rate: 0.9 });
    }
  };

  const handleReplay = () => {
    stop();
    setTimeout(() => {
      speak(transcript, { rate: 0.9 });
    }, 100);
  };

  if (!isSupported) {
    return (
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
        <h4 className="font-bold text-green-800 mb-3 flex items-center">
        <Headphones className="w-5 h-5 mr-2" />
        Listening Scenario
        </h4>
        <p className="text-gray-700 leading-relaxed mb-4">{title}</p>
      
        <div className="mt-3 p-3 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
          <p className="text-gray-700 italic leading-relaxed">{transcript}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
      <h4 className="font-bold text-green-800 mb-3 flex items-center">
        <Headphones className="w-5 h-5 mr-2" />
        Listening Scenario
      </h4>
      <p className="text-gray-700 leading-relaxed mb-4">{title}</p>
      
      
      {/* Audio Controls - Same style as ListeningSimulator */}
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={handlePlay}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isPlaying 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play Audio</span>
            </>
          )}
        </button>
        
        {hasStarted && (
          <button
            onClick={handleReplay}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay</span>
          </button>
        )}
        
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>{showTranscript ? 'Hide' : 'Show'} Transcript</span>
        </button>
      </div>

      {/* Transcript */}
      {showTranscript && (
        <div className="mt-3 p-3 bg-white rounded border border-green-200">
          <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
          <p className="text-gray-700 italic leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
};

// ===== CHEATSHEET COMPONENT =====
const CheatSheet = ({ section }) => {
  const [activeTemplate, setActiveTemplate] = useState(0);

  const speakingTemplates = {
    independent: {
      title: "Independent Speaking (Task 1)",
      time: "15 sec prep + 45 sec response",
      template: `🎯 TEMPLATE:
      
**Opening (5-7 seconds)**
"I believe that [state your opinion] for two main reasons."

**First Reason (15-20 seconds)**
"First, [reason 1]. For example, [specific example with details]."

**Second Reason (15-20 seconds)**
"Second, [reason 2]. In my experience, [personal example or explanation]."

**Conclusion (3-5 seconds)**
"That's why I think [restate opinion]."`,
      tips: [
        "🎯 Pick a side immediately - don't be neutral",
        "⏰ Use simple, clear language to save time",
        "💡 Personal examples work better than general ones",
        "🔄 Practice transitional phrases: 'First...', 'Additionally...', 'In conclusion...'"
      ],
      phrases: [
        "In my opinion...", "I strongly believe...", "From my perspective...",
        "For instance...", "To illustrate...", "A perfect example is...",
        "Furthermore...", "Additionally...", "What's more...",
        "In conclusion...", "To sum up...", "That's why I believe..."
      ]
    },
    integratedCampus: {
      title: "Integrated Campus (Task 2)",
      time: "Reading + Listening + 30 sec prep + 60 sec response",
      template: `🎯 TEMPLATE:

**Opening (10 seconds)**
"The [announcement/proposal] states that [main change]. The student [agrees/disagrees] with this for two reasons."

**First Reason (20-25 seconds)**
"First, [student's first point]. According to the student, [explanation/example from conversation]."

**Second Reason (20-25 seconds)**
"Second, [student's second point]. The student mentions that [additional details/example]."

**Conclusion (5 seconds)**
"These are the reasons why the student [supports/opposes] the change."`,
      tips: [
        "📖 Read the announcement quickly - focus on main points",
        "👂 Listen for the student's opinion and 2 reasons",
        "📝 Take notes using abbreviations and symbols",
        "🚫 Don't give your own opinion - only report what you heard"
      ],
      phrases: [
        "The reading passage announces...", "According to the notice...",
        "The student agrees/disagrees because...", "The student argues that...",
        "The student explains that...", "As the student points out...",
        "The student's first concern is...", "Another point the student makes..."
      ]
    },
    integratedAcademic: {
      title: "Integrated Academic (Task 3)",
      time: "Reading + Listening + 30 sec prep + 60 sec response",
      template: `🎯 TEMPLATE:

**Opening (10 seconds)**
"The reading defines [term/concept] as [brief definition]. The professor provides an example to illustrate this concept."

**Example Explanation (40-45 seconds)**
"The professor talks about [specific example]. In this case, [explain how the example demonstrates the concept]. This shows [connection to the reading definition]."

**Conclusion (5-10 seconds)**
"This example clearly demonstrates [restate the concept]."`,
      tips: [
        "📚 Focus on the definition and key characteristics in reading",
        "🎓 Listen for specific examples or studies in the lecture",
        "🔗 Connect the example to the concept clearly",
        "⚖️ Balance reading content (30%) and listening content (70%)"
      ],
      phrases: [
        "The reading passage defines...", "According to the text...",
        "The professor illustrates this by...", "The lecturer gives an example of...",
        "This demonstrates...", "This example shows how...",
        "The professor explains that...", "As described in the lecture..."
      ]
    }
  };

  const writingTemplates = {
    integrated: {
      title: "Integrated Writing (Task 1)",
      time: "3 min reading + Listening + 20 min writing",
      wordCount: "150-225 words",
      template: `🎯 TEMPLATE (4-5 paragraphs):

**Introduction Paragraph (2-3 sentences)**
The reading passage discusses [main topic from reading]. However, the lecturer challenges this by [main opposing point from lecture].

**Body Paragraph 1 (3-4 sentences)**
First, the article claims that [first point from reading]. In contrast, the professor argues that [opposing point from lecture]. The lecturer supports this by [specific example/evidence from lecture].

**Body Paragraph 2 (3-4 sentences)**
Second, the reading states that [second point from reading]. The lecturer contradicts this by explaining that [opposing point from lecture]. According to the professor, [additional details/evidence].

**Body Paragraph 3 (3-4 sentences)**
Finally, the passage suggests that [third point from reading]. However, the lecturer disputes this by [opposing point from lecture]. The professor provides [specific example/study] to support this viewpoint.

**Optional Conclusion (1-2 sentences)**
In summary, the lecturer systematically refutes the main points presented in the reading passage.`,
      tips: [
        "📖 Take detailed notes while reading - you can't see it during writing",
        "👂 Focus on how the lecture contradicts the reading",
        "🔗 Use clear contrast transitions: 'However', 'In contrast', 'On the other hand'",
        "⚖️ Balance content: slightly more from lecture than reading",
        "🚫 Don't express your own opinion - only summarize"
      ],
      phrases: [
        "The reading passage argues that...", "According to the article...",
        "However, the lecturer challenges...", "In contrast, the professor...",
        "The speaker contradicts this by...", "The lecturer disputes...",
        "While the reading claims...", "The professor refutes this by..."
      ]
    },
    independent: {
      title: "Independent Writing (Task 2)",
      time: "30 minutes",
      wordCount: "300+ words (aim for 350-400)",
      template: `🎯 TEMPLATE (5 paragraphs):

**Introduction Paragraph (3-4 sentences)**
[Hook sentence about the topic]. This raises the question of whether [restate the question]. While some people believe [opposing view], I strongly believe that [your thesis] for several compelling reasons.

**Body Paragraph 1 (4-5 sentences)**
First and foremost, [first main reason]. For example, [specific personal example or scenario]. This demonstrates that [explain how example supports your point]. Therefore, [conclude how this supports your thesis].

**Body Paragraph 2 (4-5 sentences)**
Additionally, [second main reason]. In my personal experience, [detailed personal example]. This situation illustrates [explanation of how example relates to your point]. As a result, [connection back to thesis].

**Body Paragraph 3 (4-5 sentences)**
Furthermore, [third main reason or address counter-argument]. Some might argue that [opposing viewpoint], but [your refutation]. For instance, [example supporting your refutation]. This clearly shows that [reinforce your position].

**Conclusion Paragraph (3-4 sentences)**
In conclusion, [restate thesis in different words]. The evidence I have provided demonstrates that [summarize main points]. For these reasons, I firmly believe that [final restatement of position].`,
      tips: [
        "🎯 Choose your position within 2 minutes and stick to it",
        "📝 Spend 5 minutes planning your examples before writing",
        "💡 Use personal examples - they're easier to develop",
        "⏰ Leave 3-5 minutes at the end for proofreading",
        "📏 Aim for 350-400 words for a competitive score",
        "🔄 Vary your sentence structures and vocabulary"
      ],
      phrases: [
        "In today's society...", "It is widely debated whether...", "There are several reasons why...",
        "First and foremost...", "Additionally...", "Furthermore...", "Moreover...",
        "For example...", "In my experience...", "To illustrate...", "A case in point...",
        "Therefore...", "As a result...", "Consequently...", "This demonstrates that...",
        "In conclusion...", "To sum up...", "All things considered..."
      ]
    }
  };

  const currentTemplates = section === 'speaking' ? speakingTemplates : writingTemplates;
  const templateKeys = Object.keys(currentTemplates);
  const currentTemplate = currentTemplates[templateKeys[activeTemplate]];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Template copied to clipboard!');
    }).catch(() => {
      alert('Could not copy to clipboard. Please select and copy manually.');
    });
  };

  const formatTemplate = (template) => {
    return template.split('\n').map((line, index) => {
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        const text = line.replace(/\*\*/g, '');
        return (
          <div key={index} className="font-bold text-blue-700 mt-4 mb-2 text-lg">
            {text}
          </div>
        );
      } else if (line.trim().startsWith('🎯')) {
        return (
          <div key={index} className="font-bold text-green-700 text-xl mb-4">
            {line}
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      } else {
        return (
          <div key={index} className="text-gray-700 leading-relaxed mb-1">
            {line}
          </div>
        );
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${section === 'speaking' ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-pink-600 to-purple-600'} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6" />
            <h3 className="text-xl font-bold">
              {section === 'speaking' ? '🎤 Speaking' : '✍️ Writing'} Templates & Cheatsheet
            </h3>
          </div>
          <div className="text-sm opacity-75">
            Quick Reference Guide
          </div>
        </div>
      </div>

      {/* Template Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          {templateKeys.map((key, index) => (
            <button
              key={key}
              onClick={() => setActiveTemplate(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTemplate === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {currentTemplates[key].title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Task Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold mb-1">
              <Clock className="w-4 h-4" />
              <span>Timing</span>
            </div>
            <div className="text-sm text-blue-600">{currentTemplate.time}</div>
          </div>
          
          {currentTemplate.wordCount && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-700 font-semibold mb-1">
                <PenTool className="w-4 h-4" />
                <span>Word Count</span>
              </div>
              <div className="text-sm text-green-600">{currentTemplate.wordCount}</div>
            </div>
          )}
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 text-purple-700 font-semibold mb-1">
              <Target className="w-4 h-4" />
              <span>Task Type</span>
            </div>
            <div className="text-sm text-purple-600">
              {currentTemplate.title.split(' (')[0]}
            </div>
          </div>
        </div>

        {/* Template */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">📋 Template Structure</h4>
            <button
              onClick={() => copyToClipboard(currentTemplate.template)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Template</span>
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm overflow-x-auto">
            {formatTemplate(currentTemplate.template)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-bold text-yellow-800 mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Pro Tips
            </h5>
            <ul className="space-y-2">
              {currentTemplate.tips.map((tip, index) => (
                <li key={index} className="text-sm text-yellow-700 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Phrases */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h5 className="font-bold text-green-800 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Useful Phrases
            </h5>
            <div className="space-y-2">
              {currentTemplate.phrases.map((phrase, index) => (
                <span
                  key={index}
                  className="inline-block bg-white px-2 py-1 rounded text-xs text-green-700 border border-green-200 mr-2 mb-2 hover:bg-green-100 cursor-pointer transition-colors"
                  onClick={() => copyToClipboard(phrase)}
                  title="Click to copy"
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Tips Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-bold text-blue-800 mb-3">
            🎯 {section === 'speaking' ? 'Speaking' : 'Writing'} Success Strategies
          </h5>
          <div className="text-sm text-blue-700 space-y-2">
            {section === 'speaking' ? (
              <>
                <p>• <strong>Practice daily:</strong> Record yourself for 2-3 minutes daily using these templates</p>
                <p>• <strong>Time management:</strong> Use prep time to organize 2-3 main points quickly</p>
                <p>• <strong>Fluency over perfection:</strong> Keep talking even if you make small mistakes</p>
                <p>• <strong>Personal examples:</strong> They're easier to remember and more convincing</p>
                <p>• <strong>Pronunciation focus:</strong> Clear speech is more important than perfect grammar</p>
              </>
            ) : (
              <>
                <p>• <strong>Plan before writing:</strong> Spend 3-5 minutes outlining your response</p>
                <p>• <strong>Vary sentence structure:</strong> Mix simple, compound, and complex sentences</p>
                <p>• <strong>Use transitions:</strong> Connect ideas with clear linking words and phrases</p>
                <p>• <strong>Proofread:</strong> Save 3-5 minutes to check grammar, spelling, and clarity</p>
                <p>• <strong>Practice typing:</strong> Improve your typing speed to write more content</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const IsolatedTextArea = ({ questionId, initialValue = '', onSubmit, section }) => {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmitClick = async () => {
    if (!value.trim()) {
      alert('Please write something first!');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(questionId, value);
    setIsSubmitting(false);
  };

  return (
    <div className="mb-6">
      <h5 className="font-semibold text-gray-700 mb-3">Your Response:</h5>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={`Write your ${section} response here...`}
        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-vertical"
        rows={section === 'writing' ? 10 : 6}
        style={{ minHeight: '120px' }}
        disabled={isSubmitting}
      />
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {value.length} characters
          {section === 'writing' && (
            <span className="ml-2 text-blue-600">
              ({Math.round(value.trim().split(/\s+/).length)} words)
            </span>
          )}
        </span>
        <button
          onClick={handleSubmitClick}
          disabled={isSubmitting || !value.trim()}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              AI is rating...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Get AI Rating
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ===== QUESTION TABS COMPONENT =====
const QuestionTabs = ({ questions, activeQuestionIndex, onTabChange, onTabClose, activeSection }) => {
  const sectionQuestions = questions.filter(q => q.section === activeSection);
  
  if (sectionQuestions.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="flex items-center space-x-2 px-4 py-2 overflow-x-auto">
        {sectionQuestions.map((question, index) => {
          const isActive = index === activeQuestionIndex;
          const questionNumber = index + 1;
          
          return (
            <div
              key={question.id}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              <button
                onClick={() => onTabChange(index)}
                className="flex items-center space-x-2 font-medium"
              >
                <span>Question {questionNumber}</span>
                {question.type && (
                  <span className="text-xs bg-white px-2 py-1 rounded">
                    {question.type}
                  </span>
                )}
              </button>
              <button
                onClick={() => onTabClose(question.id)}
                className={`p-1 rounded-full hover:bg-red-100 transition-colors ${
                  isActive ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Navigation arrows for better UX when many tabs */}
      {sectionQuestions.length > 1 && (
        <div className="flex justify-center space-x-4 py-2 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => onTabChange(Math.max(0, activeQuestionIndex - 1))}
            disabled={activeQuestionIndex === 0}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-500 py-1">
            {activeQuestionIndex + 1} of {sectionQuestions.length}
          </span>
          <button
            onClick={() => onTabChange(Math.min(sectionQuestions.length - 1, activeQuestionIndex + 1))}
            disabled={activeQuestionIndex === sectionQuestions.length - 1}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ===== MAIN TOEFL APP COMPONENT =====
export default function TOEFLApp() {
  // ===== STATE MANAGEMENT =====
  const [activeSection, setActiveSection] = useState('reading');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [aiReviews, setAiReviews] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRating, setIsRating] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // ===== SECTIONS CONFIG =====
  const sections = {
    reading: {
      title: 'Reading',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-green-600 to-teal-600',
      description: 'Practice reading comprehension with AI-generated passages',
      time: '~35 min, 2 passages'
    },
    listening: {
      title: 'Listening',
      icon: <Headphones className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      description: 'Improve listening skills with conversation scenarios',
      time: '~36 min, 5 audios'
    },
    speaking: {
      title: 'Speaking',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-orange-600 to-red-600',
      description: 'Practice speaking tasks with AI feedback',
      time: '~16 min, 4 tasks'
    },
    writing: {
      title: 'Writing',
      icon: <PenTool className="w-6 h-6" />,
      color: 'bg-gradient-to-r from-pink-600 to-purple-600',
      description: 'Master essay writing with AI evaluation',
      time: '~29 min, 2 tasks'
    }
  };

  // ===== QUESTION TYPES =====
  const questionTypes = {
    reading: ['Factual', 'Inference', 'Vocabulary', 'Summary', 'Purpose'],
    listening: ['Gist', 'Detail', 'Function', 'Attitude', 'Inference', 'Connecting Info'],
    speaking: ['Independent', 'Integrated Campus', 'Integrated Academic'],
    writing: ['Integrated', 'Independent Opinion Essay']
  };

  // ===== MEMOIZED HANDLERS =====
  const handleAnswerChange = useCallback((questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const rateAnswer = useCallback(async (questionId, userAnswer) => {
    setIsRating(prev => ({ ...prev, [questionId]: true }));
    try {
      const question = questions.find(q => q.id === questionId);
      const response = await fetch('/api/rate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question,
          userAnswer: userAnswer,
          section: question.section
        })
      });

      if (!response.ok) throw new Error('Failed to rate answer');

      const rating = await response.json();
      setAiReviews(prev => ({ ...prev, [questionId]: rating }));
      setUserAnswers(prev => ({ ...prev, [questionId]: userAnswer }));
    } catch (error) {
      console.error('Error rating answer:', error);
      alert('Failed to rate answer. Please try again.');
    }
    setIsRating(prev => ({ ...prev, [questionId]: false }));
  }, [questions]);

  const handleSubmitAnswer = useCallback((questionId) => {
    const userAnswer = userAnswers[questionId];
    if (!userAnswer || userAnswer.trim() === '') {
      alert('Please provide an answer first!');
      return;
    }
    rateAnswer(questionId, userAnswer);
  }, [userAnswers, rateAnswer]);

  // ===== TAB HANDLERS =====
  const handleTabChange = useCallback((index) => {
    setActiveQuestionIndex(index);
  }, []);

  const handleTabClose = useCallback((questionId) => {
    const sectionQuestions = questions.filter(q => q.section === activeSection);
    const questionIndex = sectionQuestions.findIndex(q => q.id === questionId);
    
    // Remove the question
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    
    // Clean up related state
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    
    setAiReviews(prev => {
      const newReviews = { ...prev };
      delete newReviews[questionId];
      return newReviews;
    });
    
    setIsRating(prev => {
      const newRating = { ...prev };
      delete newRating[questionId];
      return newRating;
    });
    
    // Adjust active question index
    const remainingQuestions = sectionQuestions.length - 1;
    if (remainingQuestions === 0) {
      setActiveQuestionIndex(0);
    } else if (questionIndex === activeQuestionIndex) {
      // If closing the active tab, move to the previous one or stay at 0
      setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
    } else if (questionIndex < activeQuestionIndex) {
      // If closing a tab before the active one, shift index back
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  }, [questions, activeSection, activeQuestionIndex]);

  // Reset active question index when changing sections
  useEffect(() => {
    setActiveQuestionIndex(0);
  }, [activeSection]);

  // ===== AI FUNCTIONS =====
  const generateQuestion = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          section: activeSection, 
          difficulty: selectedDifficulty,
          questionType: selectedQuestionType 
        })
      });

      if (!response.ok) throw new Error('Failed to generate question');

      const newQuestion = await response.json();
      const questionWithId = { ...newQuestion, id: Date.now() };
      setQuestions(prev => [...prev, questionWithId]);
      
      // Set the new question as active
      const sectionQuestions = questions.filter(q => q.section === activeSection);
      setActiveQuestionIndex(sectionQuestions.length);
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Failed to generate question. Please try again.');
    }
    setIsGenerating(false);
  };

  // ===== UTILITY FUNCTIONS =====
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Check if question is integrated speaking/writing
  const isIntegratedTask = (question) => {
    return (question.section === 'speaking' || question.section === 'writing') && 
           question.type && question.type.toLowerCase().includes('integrated');
  };

  // ===== QUESTION CARD COMPONENT =====
  const QuestionCard = React.memo(({ question }) => {
    const userAnswer = userAnswers[question.id] || '';
    const review = aiReviews[question.id];
    const isCurrentlyRating = isRating[question.id];
    const isSpeakingOrWriting = question.section === 'speaking' || question.section === 'writing';

    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`${sections[activeSection].color} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                {question.type || 'AI Generated'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty?.charAt(0).toUpperCase() + question.difficulty?.slice(1)}
              </span>
            </div>
            {question.timeLimit && (
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                ⏰ {question.timeLimit}
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

          {/* Listening Scenario - Only for listening section */}
          {question.scenario && question.transcript && question.section === 'listening' && (
            <ListeningSimulator 
              scenario={question.scenario}
              transcript={question.transcript}
            />
          )}

          {/* Listening Scenario without TTS - For other sections */}
          {question.scenario && question.transcript && question.section !== 'listening' && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <Headphones className="w-5 h-5 mr-2" />
                Listening Scenario
              </h4>
              <p className="text-gray-700 leading-relaxed mb-3">{question.scenario}</p>
              
              {/* Transcript */}
              <div className="mt-3 p-3 bg-white rounded border border-green-200">
                <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
                <p className="text-gray-700 italic leading-relaxed">{question.transcript}</p>
              </div>
            </div>
          )}

          {/* Audio for integrated speaking/writing with TTS */}
          {question.audio && isIntegratedTask(question) && (
            <IntegratedListeningSimulator 
              title={question.audio}
              transcript={question.transcript}
            />
          )}

          {/* Audio without TTS for non-integrated tasks */}
          {question.audio && !isIntegratedTask(question) && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h4 className="font-bold text-green-800 mb-3">{question.audio}</h4>
              {question.transcript && (
                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-gray-600 mb-1 font-medium">📝 Transcript:</p>
                  <p className="text-gray-700 italic leading-relaxed">{question.transcript}</p>
                </div>
              )}
            </div>
          )}

          {/* Writing Prompt */}
          {question.prompt && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-bold text-purple-800 mb-3">📝 Writing Prompt:</h4>
              <p className="text-gray-700 leading-relaxed">{question.prompt}</p>
              {question.wordLimit && (
                <div className="mt-2 text-sm text-purple-600 font-medium">
                  Word limit: {question.wordLimit}
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
            {question.tips && (
              <div className="mt-2 text-sm text-yellow-700">
                💡 Tips: {question.tips}
              </div>
            )}
          </div>

          {/* Multiple Choice Options (Reading/Listening) */}
          {question.options && !isSpeakingOrWriting && (
            <div className="mb-6">
              <h5 className="font-semibold text-gray-700 mb-3">Choose your answer:</h5>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = userAnswer === option;
                  const isCorrect = question.correctAnswer && (
                    option.startsWith(question.correctAnswer) || 
                    userAnswer === question.correctAnswer
                  );
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(question.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${
                        review && isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : review && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50 text-red-800'
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
              
              {/* Submit Button for Multiple Choice */}
              {userAnswer && !review && (
                <button
                  onClick={() => handleSubmitAnswer(question.id)}
                  disabled={isCurrentlyRating}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center disabled:opacity-50"
                >
                  {isCurrentlyRating ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      AI is rating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Get AI Rating
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Text Answer (Speaking/Writing) */}
          {(isSpeakingOrWriting || !question.options) && !review && (
            <IsolatedTextArea
              questionId={question.id}
              section={question.section || activeSection}
              onSubmit={rateAnswer}
            />
          )}

          {/* Show User Answer for Speaking/Writing after review */}
          {(isSpeakingOrWriting || !question.options) && review && userAnswer && (
            <div className="mb-6 space-y-4">
              {/* Original User Response */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <h5 className="font-semibold text-gray-700 mb-2">Your Response:</h5>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{userAnswer}</p>
              </div>

              {/* AI Improved Version */}
              {review.improvedResponse && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                  <h5 className="font-semibold text-green-700 mb-2 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    AI Improved Version:
                  </h5>
                  <p className="text-green-800 leading-relaxed whitespace-pre-wrap">{review.improvedResponse}</p>
                  <div className="mt-3 text-sm text-green-600">
                    <p><strong>Key Improvements:</strong></p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {review.improvementHighlights?.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Review */}
          {review && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2" />
                AI Rating & Feedback
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-bold text-purple-700 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Score: <span className={`ml-2 text-2xl ${getScoreColor(review.score)}`}>{review.score}/10</span>
                  </h5>
                  <div className="space-y-2">
                    <div><strong>Accuracy:</strong> {review.accuracy}/10</div>
                    <div><strong>Fluency:</strong> {review.fluency}/10</div>
                    <div><strong>Content:</strong> {review.content}/10</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h5 className="font-bold text-green-700 mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Strengths
                  </h5>
                  <ul className="text-sm space-y-1 text-gray-700">
                    {review.strengths?.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-white p-4 rounded-lg border border-yellow-200">
                <h5 className="font-bold text-yellow-700 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </h5>
                <ul className="text-sm space-y-1 text-gray-700">
                  {review.improvements?.map((improvement, index) => (
                    <li key={index}>• {improvement}</li>
                  ))}
                </ul>
              </div>

              {review.detailedFeedback && (
                <div className="mt-4 bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-bold text-blue-700 mb-3">💬 Detailed Feedback</h5>
                  <p className="text-gray-700 leading-relaxed">{review.detailedFeedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

  // Get current section questions and active question
  const sectionQuestions = questions.filter(q => q.section === activeSection);
  const currentQuestion = sectionQuestions[activeQuestionIndex];

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🚀 TOEFL iBT AI Crash Course</h1>
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
                <span>{section.title}</span>
                {questions.filter(q => q.section === key).length > 0 && (
                  <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                    {questions.filter(q => q.section === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Section Header */}
        <div className={`${sections[activeSection].color} text-white p-8 rounded-xl mb-8`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                {sections[activeSection].icon}
                <span className="ml-3">{sections[activeSection].title} Practice</span>
              </h2>
              <p className="text-lg opacity-90">{sections[activeSection].description}</p>
              <p className="text-sm opacity-75 mt-1">{sections[activeSection].time}</p>
            </div>
          </div>

          {/* Voice Settings - Only for listening section and integrated speaking/writing */}
          {(activeSection === 'listening' || 
            (activeSection === 'speaking' || activeSection === 'writing')) && (
            <div className="mt-6 bg-white bg-opacity-10 p-4 rounded-lg">
              <VoiceSettings />
            </div>
          )}

          {/* Controls */}
          <div className="mt-6 space-y-4">
            {/* Difficulty Selection */}
            <div>
              <h4 className="font-semibold text-white mb-2">Difficulty:</h4>
              <div className="flex space-x-2">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedDifficulty === level 
                        ? 'bg-white text-blue-600' 
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type Selection */}
            <div>
              <h4 className="font-semibold text-white mb-2">Question Type:</h4>
              <div className="flex flex-wrap gap-2">
                {questionTypes[activeSection]?.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedQuestionType(type)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      selectedQuestionType === type 
                        ? 'bg-white text-blue-600' 
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedQuestionType('')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedQuestionType === '' 
                      ? 'bg-white text-blue-600' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateQuestion}
              disabled={isGenerating}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate AI Question
                </>
              )}
            </button>
          </div>
        </div>

        {/* Question Tabs */}
        <QuestionTabs
          questions={questions}
          activeQuestionIndex={activeQuestionIndex}
          onTabChange={handleTabChange}
          onTabClose={handleTabClose}
          activeSection={activeSection}
        />

        {/* Question Content */}
        {sectionQuestions.length === 0 ? (
          <div>
            {/* Cheatsheet for Speaking and Writing */}
            {(activeSection === 'speaking' || activeSection === 'writing') && (
              <div className="mb-8">
                <CheatSheet section={activeSection} />
              </div>
            )}
            
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <Brain className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No questions yet</h3>
              <p className="text-gray-500 mb-6">
                {(activeSection === 'speaking' || activeSection === 'writing') 
                  ? `Check out the templates above, then generate questions to start practicing!`
                  : `Select your preferences and click "Generate AI Question" to start practicing!`
                }
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>📚 Reading: Factual, Inference, Vocabulary, Summary, Purpose</p>
                <p>🎧 Listening: Gist, Detail, Function, Attitude, Inference, Connecting Info</p>
                <p>🎤 Speaking: Independent, Integrated Campus, Integrated Academic</p>
                <p>✍️ Writing: Integrated, Independent Opinion Essay</p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center justify-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  🎧 Audio Features
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 🔊 Audio simulation in Listening section</li>
                  <li>• 🎤 Audio content for Integrated Speaking tasks</li>
                  <li>• ✍️ Audio content for Integrated Writing tasks</li>
                  <li>• ▶️ Play, stop, and replay controls</li>
                </ul>
              </div>
            </div>
          </div>
        ) : currentQuestion ? (
          <div className="mb-6">
            <QuestionCard question={currentQuestion} />
          </div>
        ) : null}

        {/* Stats */}
        {questions.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Your Progress</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {Object.keys(sections).map(section => {
                const sectionQuestions = questions.filter(q => q.section === section);
                const answeredQuestions = sectionQuestions.filter(q => aiReviews[q.id]);
                const avgScore = answeredQuestions.length > 0 
                  ? (answeredQuestions.reduce((sum, q) => sum + aiReviews[q.id].score, 0) / answeredQuestions.length).toFixed(1)
                  : 'N/A';

                return (
                  <div key={section} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {sections[section].icon}
                      <span className="ml-2 font-semibold">{sections[section].title}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{sectionQuestions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                    <div className={`text-lg font-bold ${getScoreColor(parseFloat(avgScore))}`}>
                      {avgScore !== 'N/A' ? `${avgScore}/10` : 'No scores'}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Overall Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{Object.keys(aiReviews).length}</div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${getScoreColor(
                    Object.values(aiReviews).length > 0 
                      ? Object.values(aiReviews).reduce((sum, review) => sum + review.score, 0) / Object.values(aiReviews).length
                      : 0
                  )}`}>
                    {Object.values(aiReviews).length > 0 
                      ? (Object.values(aiReviews).reduce((sum, review) => sum + review.score, 0) / Object.values(aiReviews).length).toFixed(1)
                      : '0'}/10
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}