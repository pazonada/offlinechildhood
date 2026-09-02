/**
 * POST /api/suggest — receives a "people we read" suggestion and emails it.
 *
 * Requires:
 *   - @astrojs/vercel adapter, with output: 'server' (or this route left
 *     non-prerendered, as below) in astro.config.mjs
 *   - RESEND_API_KEY set as a Vercel environment variable (server-side only)
 *   - SUGGESTION_FROM on a domain verified in Resend, e.g.
 *     "Offline Childhood <suggestions@offlinechildhood.com>"
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO = 'hello@offlinechildhood.com';
const MAX_LENGTH = 500;

export const POST: APIRoute = async ({ request }) => {
  let suggestion: unknown;

  try {
    const body = await request.json();
    suggestion = body?.suggestion;
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400);
  }

  if (typeof suggestion !== 'string' || suggestion.trim().length === 0) {
    return json({ error: 'Nothing to send.' }, 400);
  }

  const text = suggestion.trim().slice(0, MAX_LENGTH);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.SUGGESTION_FROM;

  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or SUGGESTION_FROM.');
    return json({ error: 'Suggestions are not configured right now.' }, 500);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: TO,
      subject: 'Someone you should be reading',
      text: `A visitor suggested:\n\n${text}\n\nSent from the People we read page.`,
    });

    if (error) {
      console.error('Resend rejected the send:', error);
      return json({ error: 'Could not send that. Please try again.' }, 502);
    }
  } catch (err) {
    console.error('Resend threw:', err);
    return json({ error: 'Could not send that. Please try again.' }, 502);
  }

  return json({ ok: true }, 202);
};

function json(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
