'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { Brain, BookOpen, Headphones, Mic, PenTool, Loader, Star, Target, CheckCircle, AlertCircle, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

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

// ===== ISOLATED TEXTAREA COMPONENT =====
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
      setQuestions(prev => [...prev, { ...newQuestion, id: Date.now() }]);
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
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 mb-6 overflow-hidden">
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

        {/* Questions */}
        {questions.filter(q => q.section === activeSection).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Brain className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-6">Select your preferences and click "Generate AI Question" to start practicing!</p>
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
        ) : (
          <div>
            {questions
              .filter(q => q.section === activeSection)
              .map(question => (
                <QuestionCard key={question.id} question={question} />
              ))
            }
          </div>
        )}

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