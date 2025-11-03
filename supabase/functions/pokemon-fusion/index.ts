import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pokemon1, pokemon2 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Generate fusion name and description
    const textResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a Pokémon fusion expert. Create creative fusion names and descriptions.'
          },
          {
            role: 'user',
            content: `Create a fusion of ${pokemon1.name} and ${pokemon2.name}. Respond with JSON containing: name (creative fusion name), description (short description of the fusion), primaryType (from either parent), secondaryType (from either parent or null), and fusedAbilities (combine 2-3 abilities from both parents).`
          }
        ],
      }),
    });

    const textData = await textResponse.json();
    const fusionDetails = JSON.parse(textData.choices[0].message.content);

    // Generate fusion image
    const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: `Generate a creative Pokémon fusion combining ${pokemon1.name} and ${pokemon2.name}. The fusion should blend their key features, colors, and characteristics into a single unique creature. Style: official Pokémon artwork, vibrant colors, clean design.`
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (imageResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const imageData = await imageResponse.json();
    const fusionImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // Calculate fusion stats (average of both)
    const fusionStats = {
      hp: Math.round((pokemon1.stats.hp + pokemon2.stats.hp) / 2),
      attack: Math.round((pokemon1.stats.attack + pokemon2.stats.attack) / 2),
      defense: Math.round((pokemon1.stats.defense + pokemon2.stats.defense) / 2),
      specialAttack: Math.round((pokemon1.stats.specialAttack + pokemon2.stats.specialAttack) / 2),
      specialDefense: Math.round((pokemon1.stats.specialDefense + pokemon2.stats.specialDefense) / 2),
      speed: Math.round((pokemon1.stats.speed + pokemon2.stats.speed) / 2),
    };

    return new Response(
      JSON.stringify({
        ...fusionDetails,
        stats: fusionStats,
        image: fusionImage,
        parents: [pokemon1.name, pokemon2.name]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in pokemon-fusion:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Fusion failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
