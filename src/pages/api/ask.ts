/**
 * POST /api/ask: receives a reader's question for the advice column and
 * emails it to the site inbox. Nothing is stored anywhere; the email is the
 * whole pipeline, and publishing an answer is an editorial act done by hand.
 *
 * Uses the same env vars as /api/suggest:
 *   - RESEND_API_KEY (server-side only)
 *   - SUGGESTION_FROM on a domain verified in Resend
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO = 'hello@offlinechildhood.com';
const MAX_SITUATION = 3000;
const MAX_AGES = 100;
const MAX_EMAIL = 200;

export const POST: APIRoute = async ({ request }) => {
  let situation = '';
  let ages = '';
  let email = '';

  try {
    const body = await request.json();
    situation = typeof body?.situation === 'string' ? body.situation.trim() : '';
    ages = typeof body?.ages === 'string' ? body.ages.trim() : '';
    email = typeof body?.email === 'string' ? body.email.trim() : '';
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400);
  }

  if (situation.length === 0) {
    return json({ error: 'Nothing to send.' }, 400);
  }

  situation = situation.slice(0, MAX_SITUATION);
  ages = ages.slice(0, MAX_AGES);
  email = email.slice(0, MAX_EMAIL);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.SUGGESTION_FROM;

  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or SUGGESTION_FROM.');
    return json({ error: 'Questions are not configured right now.' }, 500);
  }

  const lines = [
    'A reader asked:',
    '',
    situation,
    '',
    ages ? `Kids' ages: ${ages}` : "Kids' ages: not given",
    email ? `Reply-to: ${email}` : 'Reply-to: not given (publish-only)',
    '',
    'Sent from the Questions page.',
  ];

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: TO,
      subject: 'A question for the column',
      text: lines.join('\n'),
      ...(email ? { replyTo: email } : {}),
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
