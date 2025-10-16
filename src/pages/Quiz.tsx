import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trophy, RefreshCw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  type: string;
}

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizType, setQuizType] = useState<'types' | 'evolutions' | 'moves' | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const generateQuiz = async (type: 'types' | 'evolutions' | 'moves') => {
    setQuizType(type);
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    
    const generatedQuestions: Question[] = [];
    
    for (let i = 0; i < 10; i++) {
      const randomId = Math.floor(Math.random() * 150) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      
      if (type === 'types') {
        const correctType = data.types[0].type.name;
        const wrongTypes = ['fire', 'water', 'grass', 'electric', 'psychic', 'dragon']
          .filter(t => t !== correctType)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        
        const options = [correctType, ...wrongTypes].sort(() => Math.random() - 0.5);
        
        generatedQuestions.push({
          question: `What type is ${data.name.toUpperCase()}?`,
          options,
          correctAnswer: options.indexOf(correctType),
          type: 'types'
        });
      } else if (type === 'evolutions') {
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        const chain = evolutionData.chain;
        const evolutions = [chain.species.name];
        if (chain.evolves_to.length > 0) {
          evolutions.push(chain.evolves_to[0].species.name);
          if (chain.evolves_to[0].evolves_to.length > 0) {
            evolutions.push(chain.evolves_to[0].evolves_to[0].species.name);
          }
        }
        
        if (evolutions.length > 1) {
          const wrongOptions = ['pikachu', 'charmander', 'squirtle', 'bulbasaur']
            .filter(p => !evolutions.includes(p))
            .slice(0, 2);
          
          const options = [...evolutions.slice(0, 2), ...wrongOptions].sort(() => Math.random() - 0.5);
          
          generatedQuestions.push({
            question: `What does ${evolutions[0].toUpperCase()} evolve into?`,
            options,
            correctAnswer: options.indexOf(evolutions[1]),
            type: 'evolutions'
          });
        }
      } else if (type === 'moves') {
        const moves = data.moves.slice(0, 4).map((m: any) => m.move.name);
        const correctMove = moves[0];
        const wrongMoves = ['tackle', 'quick-attack', 'thunder-shock', 'flamethrower']
          .filter(m => !moves.includes(m))
          .slice(0, 3);
        
        const options = [correctMove, ...wrongMoves].sort(() => Math.random() - 0.5);
        
        generatedQuestions.push({
          question: `Which move can ${data.name.toUpperCase()} learn?`,
          options,
          correctAnswer: options.indexOf(correctMove),
          type: 'moves'
        });
      }
    }
    
    setQuestions(generatedQuestions);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
        saveScore();
      }
    }, 1500);
  };

  const saveScore = async () => {
    if (!user || !quizType) return;
    
    await supabase.from('quiz_scores').insert({
      user_id: user.id,
      quiz_type: quizType,
      score: score + (selectedAnswer === questions[currentQuestion]?.correctAnswer ? 1 : 0),
      total_questions: questions.length
    });
  };

  const resetQuiz = () => {
    setQuizType(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  if (!quizType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Pokémon Quiz Challenge</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => generateQuiz('types')}>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Type Quiz</h2>
                <p className="text-muted-foreground">Test your knowledge of Pokémon types!</p>
              </div>
            </Card>
            
            <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => generateQuiz('evolutions')}>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Evolution Quiz</h2>
                <p className="text-muted-foreground">Know your evolution chains?</p>
              </div>
            </Card>
            
            <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => generateQuiz('moves')}>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Moves Quiz</h2>
                <p className="text-muted-foreground">Which Pokémon learns which move?</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const finalScore = score;
    const percentage = (finalScore / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <Trophy className="w-24 h-24 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-6xl font-bold mb-4">{finalScore}/{questions.length}</p>
            <Progress value={percentage} className="mb-4" />
            <p className="text-xl mb-6">
              {percentage === 100 ? '🎉 Perfect Score! You\'re a Pokémon Master!' :
               percentage >= 80 ? '🌟 Excellent work, Trainer!' :
               percentage >= 60 ? '👍 Good job! Keep training!' :
               '💪 Keep practicing, future Champion!'}
            </p>
            <Button onClick={resetQuiz}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Another Quiz
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1}/{questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} />
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                variant={
                  showResult
                    ? index === question.correctAnswer
                      ? 'default'
                      : index === selectedAnswer
                      ? 'destructive'
                      : 'outline'
                    : 'outline'
                }
                className="w-full justify-start text-left h-auto py-4 capitalize"
              >
                {option.replace(/-/g, ' ')}
              </Button>
            ))}
          </div>
          
          {showResult && (
            <p className="mt-6 text-center text-lg font-semibold">
              {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Wrong!'}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
