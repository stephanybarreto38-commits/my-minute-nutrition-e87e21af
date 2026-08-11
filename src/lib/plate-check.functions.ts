import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';

const InputSchema = z.object({
  imageBase64: z.string().min(100).max(9_000_000),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  ageMonths: z.number().int().min(0).max(60),
  lang: z.enum(['es', 'en']).default('es'),
  catalog: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .max(200)
    .default([]),
});

export type PlateVerdict = 'seguro' | 'revisar' | 'riesgo';

export interface PlateItem {
  description: string;
  verdict: PlateVerdict;
  reason: string;
  suggestion: string | null;
  foodId?: string | null;
}

export interface PlateCheckResult {
  items: PlateItem[];
  overallNote: string;
}

function buildPrompt(ageMonths: number, lang: 'es' | 'en', catalog: { id: string; name: string }[]) {
  const catalogLine = catalog.length
    ? `\nCatálogo de alimentos de la app (usa "foodId" SOLO si el alimento visible coincide claramente con uno de estos ids):\n${catalog
        .map((c) => `${c.id}=${c.name}`)
        .join(', ')}\n`
    : '';

  return `Eres un asistente de seguridad alimentaria infantil. Analiza la FOTO del plato de un bebé de ${ageMonths} meses.

Tu ÚNICA tarea es evaluar el CORTE, TAMAÑO y FORMA de cada trozo visible respecto al riesgo de ATRAGANTAMIENTO. NO identifiques recetas, NO des consejos nutricionales, NO comentes sabor ni calorías.

Patrones de riesgo a considerar:
- Alimentos redondos enteros o en rodajas (uvas, tomates cherry, salchicha, zanahoria en rodajas) → riesgo alto si no están cortados en cuartos a lo largo o en bastones.
- Trozos duros o crudos que no se aplastan entre los dedos (manzana cruda en cubos, zanahoria dura).
- Grumos pegajosos o densos (mantequilla de maní en cucharada, bolitas compactas).
- Trozos demasiado grandes para la edad y etapa de masticación (${ageMonths} meses).
- Huesos o espinas visibles en proteínas.

Mitigaciones válidas: cortar en bastones/tiras del tamaño de un dedo, cortar en cuartos a lo largo, aplastar, cocinar hasta que esté blando.
${catalogLine}
Responde ÚNICAMENTE con JSON válido (sin markdown, sin texto extra) con esta forma exacta:
{"items":[{"description":"...","verdict":"seguro|revisar|riesgo","reason":"...","suggestion":"... o null","foodId":"id o null"}],"overallNote":"..."}

Escribe description, reason, suggestion y overallNote en ${lang === 'es' ? 'español' : 'inglés'}. Si la foto no muestra comida, devuelve items vacío y explícalo en overallNote.`;
}

function extractJson(text: string): PlateCheckResult {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Respuesta inesperada del análisis');
  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as PlateCheckResult;
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  return {
    items: items
      .filter((i) => i && typeof i.description === 'string')
      .map((i) => ({
        description: String(i.description),
        verdict: (['seguro', 'revisar', 'riesgo'] as const).includes(i.verdict as PlateVerdict)
          ? (i.verdict as PlateVerdict)
          : 'revisar',
        reason: typeof i.reason === 'string' ? i.reason : '',
        suggestion: typeof i.suggestion === 'string' && i.suggestion.trim() ? i.suggestion : null,
        foodId: typeof i.foodId === 'string' && i.foodId.trim() ? i.foodId : null,
      })),
    overallNote: typeof parsed.overallNote === 'string' ? parsed.overallNote : '',
  };
}

export const analyzePlate = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<PlateCheckResult> => {
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY no está configurada');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: data.mediaType, data: data.imageBase64 },
              },
              { type: 'text', text: buildPrompt(data.ageMonths, data.lang, data.catalog) },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[plate-check] anthropic error', res.status, body.slice(0, 500));
      if (res.status === 429) throw new Error('Demasiadas solicitudes. Intenta de nuevo en un momento.');
      throw new Error('No se pudo analizar la foto en este momento.');
    }

    const json = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (json.content ?? [])
      .filter((c) => c.type === 'text' && c.text)
      .map((c) => c.text as string)
      .join('\n');

    return extractJson(text);
  });
