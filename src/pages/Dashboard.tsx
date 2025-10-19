import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Zap, Crown, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

interface UserStats {
  level: number;
  xp: number;
  username: string;
  caughtCount: number;
  shinyCount: number;
  legendaryCount: number;
  badgeCount: number;
  quizScore: number;
  teamsCount: number;
}

interface DailyChallenge {
  id: string;
  challenge_type: string;
  completed: boolean;
  reward_xp: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    username: 'Trainer',
    caughtCount: 0,
    shinyCount: 0,
    legendaryCount: 0,
    badgeCount: 0,
    quizScore: 0,
    teamsCount: 0
  });
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const [profileData, caughtData, shinyData, legendaryData, badgeData, quizData, teamsData, challengesData] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('caught_pokemon').select('*').eq('user_id', user.id),
      supabase.from('shiny_pokemon').select('*').eq('user_id', user.id),
      supabase.from('legendary_pokemon').select('*').eq('user_id', user.id),
      supabase.from('user_badges').select('*').eq('user_id', user.id),
      supabase.from('quiz_scores').select('*').eq('user_id', user.id).order('score', { ascending: false }).limit(1),
      supabase.from('teams').select('*').eq('user_id', user.id),
      supabase.from('daily_challenges').select('*').eq('user_id', user.id).eq('challenge_date', new Date().toISOString().split('T')[0])
    ]);

    setStats({
      level: profileData.data?.level || 1,
      xp: profileData.data?.xp || 0,
      username: profileData.data?.username || 'Trainer',
      caughtCount: caughtData.data?.length || 0,
      shinyCount: shinyData.data?.length || 0,
      legendaryCount: legendaryData.data?.length || 0,
      badgeCount: badgeData.data?.length || 0,
      quizScore: quizData.data?.[0]?.score || 0,
      teamsCount: teamsData.data?.length || 0
    });

    if (challengesData.data?.length === 0) {
      await generateDailyChallenges(user.id);
    } else {
      setChallenges(challengesData.data || []);
    }

    setLoading(false);
  };

  const generateDailyChallenges = async (userId: string) => {
    const challengeTypes = [
      { type: 'catch_5_pokemon', xp: 50 },
      { type: 'complete_quiz', xp: 100 },
      { type: 'guess_pokemon', xp: 75 },
      { type: 'create_team', xp: 80 }
    ];

    const dailyChallenges = challengeTypes.slice(0, 3).map(challenge => ({
      user_id: userId,
      challenge_date: new Date().toISOString().split('T')[0],
      challenge_type: challenge.type,
      completed: false,
      reward_xp: challenge.xp
    }));

    const { data } = await supabase.from('daily_challenges').insert(dailyChallenges).select();
    setChallenges(data || []);
  };

  const completeChallenge = async (challengeId: string, rewardXp: number) => {
    const { error } = await supabase
      .from('daily_challenges')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', challengeId);

    if (!error) {
      const newXp = stats.xp + rewardXp;
      const newLevel = Math.floor(newXp / 1000) + 1;

      await supabase
        .from('profiles')
        .update({ xp: newXp, level: newLevel })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      toast.success(`Challenge completed! +${rewardXp} XP`);
      fetchUserData();
    }
  };

  const getChallengeLabel = (type: string) => {
    const labels: Record<string, string> = {
      catch_5_pokemon: 'Catch 5 Pokémon',
      complete_quiz: 'Complete a Quiz',
      guess_pokemon: 'Play Guess the Pokémon',
      create_team: 'Create a New Team'
    };
    return labels[type] || type;
  };

  const xpToNextLevel = (stats.level * 1000) - stats.xp;
  const xpProgress = (stats.xp % 1000) / 10;

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20"><Navigation /><div className="flex items-center justify-center h-screen">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-center mb-8">Trainer Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 col-span-1">
            <div className="text-center">
              <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-3xl font-bold">{stats.username}</h2>
              <Badge className="mt-2">Level {stats.level}</Badge>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">XP Progress</p>
                <Progress value={xpProgress} />
                <p className="text-xs text-muted-foreground mt-1">{xpToNextLevel} XP to Level {stats.level + 1}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 col-span-2">
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.caughtCount}</p>
                <p className="text-sm text-muted-foreground">Caught</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.shinyCount}</p>
                <p className="text-sm text-muted-foreground">Shiny</p>
              </div>
              <div className="text-center">
                <Crown className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{stats.legendaryCount}</p>
                <p className="text-sm text-muted-foreground">Legendary</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.badgeCount}</p>
                <p className="text-sm text-muted-foreground">Badges</p>
              </div>
              <div className="text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{stats.quizScore}</p>
                <p className="text-sm text-muted-foreground">Best Quiz</p>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{stats.teamsCount}</p>
                <p className="text-sm text-muted-foreground">Teams</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Daily Challenges</h3>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  challenge.completed ? 'bg-green-500/10 border-2 border-green-500' : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{getChallengeLabel(challenge.challenge_type)}</p>
                    <p className="text-sm text-muted-foreground">Reward: {challenge.reward_xp} XP</p>
                  </div>
                </div>
                {challenge.completed ? (
                  <Badge className="bg-green-500">✓ Completed</Badge>
                ) : (
                  <Button onClick={() => completeChallenge(challenge.id, challenge.reward_xp)}>
                    Mark Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
