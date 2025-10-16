import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Star, Award } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  score?: number;
  total_questions?: number;
  quiz_type?: string;
  caught_count?: number;
  level?: number;
  xp?: number;
}

const Leaderboard = () => {
  const [quizLeaders, setQuizLeaders] = useState<LeaderboardEntry[]>([]);
  const [collectionLeaders, setCollectionLeaders] = useState<LeaderboardEntry[]>([]);
  const [xpLeaders, setXpLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    // Quiz Leaderboard
    const { data: quizData } = await supabase
      .from('quiz_scores')
      .select(`
        user_id,
        score,
        total_questions,
        quiz_type,
        profiles(username)
      `)
      .order('score', { ascending: false })
      .limit(10);

    if (quizData) {
      const formatted = quizData.map((entry: any) => ({
        user_id: entry.user_id,
        username: entry.profiles?.username || 'Trainer',
        score: entry.score,
        total_questions: entry.total_questions,
        quiz_type: entry.quiz_type
      }));
      setQuizLeaders(formatted);
    }

    // Collection Leaderboard
    const { data: collectionData } = await supabase
      .from('caught_pokemon')
      .select(`
        user_id,
        profiles(username)
      `);

    if (collectionData) {
      const counts = collectionData.reduce((acc: any, curr: any) => {
        const username = curr.profiles?.username || 'Trainer';
        if (!acc[curr.user_id]) {
          acc[curr.user_id] = { user_id: curr.user_id, username, caught_count: 0 };
        }
        acc[curr.user_id].caught_count++;
        return acc;
      }, {});

      const sorted = Object.values(counts)
        .sort((a: any, b: any) => b.caught_count - a.caught_count)
        .slice(0, 10) as LeaderboardEntry[];
      
      setCollectionLeaders(sorted);
    }

    // XP Leaderboard
    const { data: xpData } = await supabase
      .from('profiles')
      .select('id, username, level, xp')
      .order('xp', { ascending: false })
      .limit(10);

    if (xpData) {
      setXpLeaders(xpData.map(p => ({
        user_id: p.id,
        username: p.username,
        level: p.level || 1,
        xp: p.xp || 0
      })));
    }
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">🏆 Leaderboards 🏆</h1>

        <Tabs defaultValue="quiz" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz">
              <Trophy className="w-4 h-4 mr-2" />
              Quiz Masters
            </TabsTrigger>
            <TabsTrigger value="collection">
              <Star className="w-4 h-4 mr-2" />
              Collectors
            </TabsTrigger>
            <TabsTrigger value="xp">
              <Award className="w-4 h-4 mr-2" />
              Top Trainers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Top Quiz Scores</h2>
              <div className="space-y-3">
                {quizLeaders.map((entry, index) => (
                  <div
                    key={entry.user_id + index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-12">{getMedalIcon(index)}</span>
                      <div>
                        <p className="font-bold">{entry.username}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {entry.quiz_type} Quiz
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{entry.score}</p>
                      <p className="text-sm text-muted-foreground">
                        / {entry.total_questions} questions
                      </p>
                    </div>
                  </div>
                ))}
                {quizLeaders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No quiz scores yet. Be the first!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="collection">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Top Pokémon Collectors</h2>
              <div className="space-y-3">
                {collectionLeaders.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-12">{getMedalIcon(index)}</span>
                      <p className="font-bold">{entry.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{entry.caught_count}</p>
                      <p className="text-sm text-muted-foreground">Pokémon Caught</p>
                    </div>
                  </div>
                ))}
                {collectionLeaders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No collections yet. Start catching!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="xp">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Top Trainers by XP</h2>
              <div className="space-y-3">
                {xpLeaders.map((entry, index) => (
                  <div
                    key={entry.user_id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3 ? 'bg-primary/10 border-2 border-primary' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-12">{getMedalIcon(index)}</span>
                      <div>
                        <p className="font-bold">{entry.username}</p>
                        <Badge>Level {entry.level}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{entry.xp}</p>
                      <p className="text-sm text-muted-foreground">XP</p>
                    </div>
                  </div>
                ))}
                {xpLeaders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No trainers yet. Start your journey!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
