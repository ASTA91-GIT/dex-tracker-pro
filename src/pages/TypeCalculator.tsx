import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const types = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400', fighting: 'bg-red-600', flying: 'bg-blue-400',
  poison: 'bg-purple-500', ground: 'bg-yellow-600', rock: 'bg-yellow-800',
  bug: 'bg-green-500', ghost: 'bg-purple-700', steel: 'bg-gray-500',
  fire: 'bg-orange-500', water: 'bg-blue-500', grass: 'bg-green-600',
  electric: 'bg-yellow-400', psychic: 'bg-pink-500', ice: 'bg-cyan-400',
  dragon: 'bg-indigo-600', dark: 'bg-gray-800', fairy: 'bg-pink-300'
};

const typeEffectiveness: Record<string, { strong: string[], weak: string[], immune: string[] }> = {
  normal: { strong: [], weak: ['rock', 'steel'], immune: ['ghost'] },
  fire: { strong: ['grass', 'ice', 'bug', 'steel'], weak: ['fire', 'water', 'rock', 'dragon'], immune: [] },
  water: { strong: ['fire', 'ground', 'rock'], weak: ['water', 'grass', 'dragon'], immune: [] },
  electric: { strong: ['water', 'flying'], weak: ['electric', 'grass', 'dragon'], immune: ['ground'] },
  grass: { strong: ['water', 'ground', 'rock'], weak: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], immune: [] },
  ice: { strong: ['grass', 'ground', 'flying', 'dragon'], weak: ['fire', 'water', 'ice', 'steel'], immune: [] },
  fighting: { strong: ['normal', 'ice', 'rock', 'dark', 'steel'], weak: ['poison', 'flying', 'psychic', 'bug', 'fairy'], immune: ['ghost'] },
  poison: { strong: ['grass', 'fairy'], weak: ['poison', 'ground', 'rock', 'ghost'], immune: ['steel'] },
  ground: { strong: ['fire', 'electric', 'poison', 'rock', 'steel'], weak: ['grass', 'bug'], immune: ['flying'] },
  flying: { strong: ['grass', 'fighting', 'bug'], weak: ['electric', 'rock', 'steel'], immune: [] },
  psychic: { strong: ['fighting', 'poison'], weak: ['psychic', 'steel'], immune: ['dark'] },
  bug: { strong: ['grass', 'psychic', 'dark'], weak: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], immune: [] },
  rock: { strong: ['fire', 'ice', 'flying', 'bug'], weak: ['fighting', 'ground', 'steel'], immune: [] },
  ghost: { strong: ['psychic', 'ghost'], weak: ['dark'], immune: ['normal'] },
  dragon: { strong: ['dragon'], weak: ['steel'], immune: ['fairy'] },
  dark: { strong: ['psychic', 'ghost'], weak: ['fighting', 'dark', 'fairy'], immune: [] },
  steel: { strong: ['ice', 'rock', 'fairy'], weak: ['fire', 'water', 'electric', 'steel'], immune: [] },
  fairy: { strong: ['fighting', 'dragon', 'dark'], weak: ['fire', 'poison', 'steel'], immune: [] }
};

const TypeCalculator = () => {
  const [attackingType, setAttackingType] = useState<string | null>(null);
  const [defendingTypes, setDefendingTypes] = useState<string[]>([]);

  const calculateEffectiveness = () => {
    if (!attackingType || defendingTypes.length === 0) return null;

    const effectiveness = typeEffectiveness[attackingType];
    const results = {
      superEffective: [] as string[],
      notVeryEffective: [] as string[],
      noEffect: [] as string[]
    };

    defendingTypes.forEach(defType => {
      if (effectiveness.strong.includes(defType)) {
        results.superEffective.push(defType);
      } else if (effectiveness.weak.includes(defType)) {
        results.notVeryEffective.push(defType);
      } else if (effectiveness.immune.includes(defType)) {
        results.noEffect.push(defType);
      }
    });

    return results;
  };

  const toggleDefendingType = (type: string) => {
    if (defendingTypes.includes(type)) {
      setDefendingTypes(defendingTypes.filter(t => t !== type));
    } else if (defendingTypes.length < 2) {
      setDefendingTypes([...defendingTypes, type]);
    }
  };

  const results = calculateEffectiveness();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Type Effectiveness Calculator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Attacking Type */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Attacking Type</h2>
            <div className="grid grid-cols-3 gap-2">
              {types.map(type => (
                <Badge
                  key={type}
                  className={`${typeColors[type]} cursor-pointer p-3 text-center justify-center ${attackingType === type ? 'ring-4 ring-primary' : ''}`}
                  onClick={() => setAttackingType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Defending Types */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Defending Type(s) - Max 2</h2>
            <div className="grid grid-cols-3 gap-2">
              {types.map(type => (
                <Badge
                  key={type}
                  className={`${typeColors[type]} cursor-pointer p-3 text-center justify-center ${defendingTypes.includes(type) ? 'ring-4 ring-primary' : ''}`}
                  onClick={() => toggleDefendingType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Results */}
        {results && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Effectiveness Results</h2>
            
            {results.superEffective.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-green-500 mb-2">Super Effective (2x)</h3>
                <div className="flex gap-2 flex-wrap">
                  {results.superEffective.map(type => (
                    <Badge key={type} className={typeColors[type]}>{type}</Badge>
                  ))}
                </div>
              </div>
            )}

            {results.notVeryEffective.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-orange-500 mb-2">Not Very Effective (0.5x)</h3>
                <div className="flex gap-2 flex-wrap">
                  {results.notVeryEffective.map(type => (
                    <Badge key={type} className={typeColors[type]}>{type}</Badge>
                  ))}
                </div>
              </div>
            )}

            {results.noEffect.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-red-500 mb-2">No Effect (0x)</h3>
                <div className="flex gap-2 flex-wrap">
                  {results.noEffect.map(type => (
                    <Badge key={type} className={typeColors[type]}>{type}</Badge>
                  ))}
                </div>
              </div>
            )}

            {results.superEffective.length === 0 && results.notVeryEffective.length === 0 && results.noEffect.length === 0 && (
              <p className="text-muted-foreground">Normal effectiveness (1x)</p>
            )}
          </Card>
        )}

        {/* Type Chart Reference */}
        <Card className="p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Type Chart Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map(type => (
              <div key={type} className="border rounded p-3">
                <Badge className={`${typeColors[type]} mb-2 w-full justify-center`}>{type}</Badge>
                <div className="text-sm">
                  <p className="font-semibold">Strong Against:</p>
                  <p className="text-muted-foreground mb-2">
                    {typeEffectiveness[type].strong.join(', ') || 'None'}
                  </p>
                  <p className="font-semibold">Weak Against:</p>
                  <p className="text-muted-foreground mb-2">
                    {typeEffectiveness[type].weak.join(', ') || 'None'}
                  </p>
                  {typeEffectiveness[type].immune.length > 0 && (
                    <>
                      <p className="font-semibold">No Effect:</p>
                      <p className="text-muted-foreground">
                        {typeEffectiveness[type].immune.join(', ')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TypeCalculator;
