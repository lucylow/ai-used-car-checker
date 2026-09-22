import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Finding } from '../types/inspection';

const OPENAI_KEY = Constants.expoConfig?.extra?.openaiApiKey as string | undefined;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

type FindingDraft = Omit<Finding, 'id' | 'inspectionId' | 'evidenceIds' | 'createdAt' | 'updatedAt'>;

export interface AIPhotoResult {
  findings: FindingDraft[];
  overallCondition: string;
  summary: string;
}

const SYSTEM_PROMPT = `You are an expert automotive inspector. Analyze the provided vehicle photo and identify visible issues. Return ONLY valid JSON matching this schema:

{
  "findings": [
    {
      "category": "exterior" | "interior" | "engine" | "tires" | "brakes" | "electrical" | "suspension",
      "title": "short 3-6 word title",
      "description": "1-2 sentence explanation",
      "severity": "cosmetic" | "minor" | "moderate" | "major" | "critical",
      "confidence": 0.0-1.0,
      "location": "specific area on the vehicle",
      "estimatedCostLow": number,
      "estimatedCostHigh": number
    }
  ],
  "overallCondition": "brief overall assessment",
  "summary": "one sentence summary"
}

Rules:
- Only report issues clearly visible in the photo.
- If the photo is too dark or unclear, return empty findings and set summary to "Image unclear".
- Use realistic US repair cost ranges.
- Be conservative — do not invent issues.
- Confidence reflects your certainty based on visual evidence.`;

export async function analyzeVehiclePhoto(photoUri: string): Promise<AIPhotoResult> {
  if (!OPENAI_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const base64 = await FileSystem.readAsStringAsync(photoUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this vehicle photo and return the JSON as specified.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errText}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  const parsed = JSON.parse(content) as AIPhotoResult;
  return {
    ...parsed,
    findings: (parsed.findings ?? []).map((f) => ({
      ...f,
      source: 'ai_photo',
      status: 'open',
      reviewedByUser: false,
      confidence: f.confidence ?? 0.5,
    })),
  };
}

/**
 * Batch analyze multiple photos. Returns de-duplicated findings.
 * Runs sequentially to avoid rate limits.
 */
export async function analyzeVehiclePhotos(
  photoUris: string[],
  onProgress?: (completed: number, total: number) => void
): Promise<AIPhotoResult> {
  const allFindings: AIPhotoResult['findings'] = [];
  const summaries: string[] = [];

  for (let i = 0; i < photoUris.length; i++) {
    try {
      const result = await analyzeVehiclePhoto(photoUris[i]);
      allFindings.push(...result.findings);
      if (result.summary) summaries.push(result.summary);
    } catch (error) {
      console.warn(`[OpenAI] Photo ${i} failed:`, error);
    }
    onProgress?.(i + 1, photoUris.length);
  }

  return {
    findings: dedupeFindings(allFindings),
    overallCondition: 'See individual findings',
    summary: summaries.join(' '),
  };
}

function dedupeFindings(findings: AIPhotoResult['findings']): AIPhotoResult['findings'] {
  const seen = new Map<string, AIPhotoResult['findings'][number]>();
  for (const f of findings) {
    const key = `${f.category}:${f.title.toLowerCase()}`;
    const existing = seen.get(key);
    if (!existing || f.confidence > existing.confidence) {
      seen.set(key, f);
    }
  }
  return Array.from(seen.values());
}
