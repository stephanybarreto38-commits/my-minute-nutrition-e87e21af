import { useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { analyzePlate, type PlateCheckResult, type PlateVerdict } from '../lib/plate-check.functions';
import { FOODS } from '../data/foods';
import type { Lang } from '../data/translations';

interface Props {
  lang: Lang;
  ageMonths: number;
  triedFoodIds: string[];
  onMarkTried: (foodId: string) => void;
  onClose: () => void;
}

const MAX_SIDE = 1200;

async function compress(file: File): Promise<{ base64: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  return { base64: dataUrl.split(',')[1], preview: dataUrl };
}

function verdictPill(v: PlateVerdict, lang: Lang) {
  const map: Record<PlateVerdict, { cls: string; es: string; en: string }> = {
    seguro: { cls: 'bg-green-100 text-green-800', es: 'Seguro', en: 'Safe' },
    revisar: { cls: 'bg-yellow-100 text-yellow-800', es: 'Revisar', en: 'Check' },
    riesgo: { cls: 'bg-red-100 text-red-700', es: 'Riesgo', en: 'Risk' },
  };
  const m = map[v];
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${m.cls}`}>
      {lang === 'es' ? m.es : m.en}
    </span>
  );
}

const borderFor: Record<PlateVerdict, string> = {
  seguro: 'border-green-200 bg-green-50',
  revisar: 'border-yellow-200 bg-yellow-50',
  riesgo: 'border-red-200 bg-red-50',
};

export default function PlateCheckSheet({ lang, ageMonths, triedFoodIds, onMarkTried, onClose }: Props) {
  const es = lang === 'es';
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzePlate);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlateCheckResult | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const { base64, preview: url } = await compress(file);
      setPreview(url);
      const data = await analyze({
        data: {
          imageBase64: base64,
          mediaType: 'image/jpeg' as const,
          ageMonths,
          lang,
          catalog: FOODS.map(f => ({ id: f.id, name: es ? f.nameEs : f.nameEn })),
        },
      });
      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : es
            ? 'No se pudo analizar la foto.'
            : 'Could not analyze the photo.',
      );
    } finally {
      setLoading(false);
    }
  };

  const matched = (result?.items ?? [])
    .map(i => i.foodId)
    .filter((id): id is string => !!id && !triedFoodIds.includes(id));
  const uniqueMatched = Array.from(new Set(matched));

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">
            {es ? '📸 Revisar cortes' : '📸 Check the cuts'}
          </p>
          <button onClick={onClose} className="text-gray-400 text-lg leading-none px-1">×</button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-[12px] text-gray-500">
            {es
              ? 'Toma o sube una foto del plato. Evaluamos el tamaño y la forma de los trozos, no qué comida es. La foto no se guarda.'
              : "Take or upload a photo of the plate. We check piece size and shape, not what the food is. The photo is not stored."}
          </p>

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={e => void handleFile(e.target.files?.[0])}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => void handleFile(e.target.files?.[0])}
          />

          <div className="flex gap-2">
            <button
              onClick={() => cameraRef.current?.click()}
              disabled={loading}
              className="flex-1 bg-green-600 text-white text-[13px] font-medium py-2.5 rounded-xl disabled:opacity-50"
            >
              {es ? 'Tomar foto' : 'Take photo'}
            </button>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 text-[13px] font-medium py-2.5 rounded-xl disabled:opacity-50"
            >
              {es ? 'Subir foto' : 'Upload photo'}
            </button>
          </div>

          {preview && (
            <img src={preview} alt={es ? 'Foto del plato' : 'Plate photo'} className="w-full rounded-2xl object-cover max-h-56" />
          )}

          {loading && (
            <p className="text-[12px] text-gray-500 text-center py-3">
              {es ? 'Analizando los cortes…' : 'Analyzing the pieces…'}
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">{error}</div>
          )}

          {result && (
            <div className="space-y-2">
              {result.items.length === 0 && (
                <p className="text-[12px] text-gray-500">
                  {es ? 'No se detectaron trozos de comida en la foto.' : 'No food pieces detected in the photo.'}
                </p>
              )}
              {result.items.map((item, i) => (
                <div key={i} className={`rounded-xl border p-3 ${borderFor[item.verdict]}`}>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-[13px] font-medium text-gray-900">{item.description}</p>
                    {verdictPill(item.verdict, lang)}
                  </div>
                  {item.reason && <p className="text-[12px] text-gray-600 mt-1">{item.reason}</p>}
                  {item.suggestion && (
                    <p className="text-[12px] text-gray-800 mt-1.5">
                      <span className="font-medium">{es ? 'Sugerencia: ' : 'Suggestion: '}</span>
                      {item.suggestion}
                    </p>
                  )}
                </div>
              ))}

              {result.overallNote && (
                <p className="text-[12px] text-gray-600 bg-gray-50 rounded-xl p-3">{result.overallNote}</p>
              )}

              {uniqueMatched.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1.5">
                    {es ? 'Marcar como probado' : 'Mark as tried'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueMatched.map(id => {
                      const food = FOODS.find(f => f.id === id);
                      if (!food) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => onMarkTried(id)}
                          className="text-[12px] border border-gray-200 rounded-full px-2.5 py-1 bg-white text-gray-700"
                        >
                          {food.emoji} {es ? food.nameEs : food.nameEn} +
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-[11px] text-amber-900 leading-relaxed">
              {es
                ? 'Esta evaluación es una guía generada por inteligencia artificial y puede equivocarse. No reemplaza la supervisión directa de un adulto mientras el bebé come, ni el criterio de tu pediatra.'
                : 'This assessment is an AI-generated guide and may be wrong. It does not replace direct adult supervision while the baby eats, nor your pediatrician’s judgement.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
