/**
 * POST /api/ask: receives a topic or scenario a reader wants the site to
 * cover, and emails it to the site inbox. Nothing is stored anywhere; the
 * email is the whole pipeline, and turning one into a page is editorial work.
 *
 * Uses the same env vars as /api/suggest:
 *   - RESEND_API_KEY (server-side only)
 *   - SUGGESTION_FROM on a domain verified in Resend
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO = 'hello@offlinechildhood.com';
const MAX_TOPIC = 3000;
const MAX_AGES = 100;
const MAX_EMAIL = 200;

export const POST: APIRoute = async ({ request }) => {
  let topic = '';
  let ages = '';
  let email = '';

  try {
    const body = await request.json();
    topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    ages = typeof body?.ages === 'string' ? body.ages.trim() : '';
    email = typeof body?.email === 'string' ? body.email.trim() : '';
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400);
  }

  if (topic.length === 0) {
    return json({ error: 'Nothing to send.' }, 400);
  }

  topic = topic.slice(0, MAX_TOPIC);
  ages = ages.slice(0, MAX_AGES);
  email = email.slice(0, MAX_EMAIL);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.SUGGESTION_FROM;

  if (!apiKey || !from) {
    console.error('Missing RESEND_API_KEY or SUGGESTION_FROM.');
    return json({ error: 'Suggestions are not configured right now.' }, 500);
  }

  const lines = [
    'A reader wants the site to cover:',
    '',
    topic,
    '',
    ages ? `Kids' ages: ${ages}` : "Kids' ages: not given",
    email ? `Reply-to: ${email}` : 'Reply-to: not given',
    '',
    'Sent from the Suggest a topic page.',
  ];

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: TO,
      subject: 'A topic to cover',
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
