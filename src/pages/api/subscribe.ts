/**
 * POST /api/subscribe: adds an email to the announcements list, a Resend
 * Audience. Nothing else is collected, and Resend handles unsubscribes via
 * the link it injects into every broadcast.
 *
 * Requires:
 *   - RESEND_API_KEY (already set for /api/suggest and /api/ask)
 *   - RESEND_AUDIENCE_ID, the Audience created in the Resend dashboard
 */
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const MAX_EMAIL = 200;
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let email = '';

  try {
    const body = await request.json();
    email = typeof body?.email === 'string' ? body.email.trim().slice(0, MAX_EMAIL) : '';
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400);
  }

  if (!EMAIL_SHAPE.test(email)) {
    return json({ error: 'That does not look like an email address.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID.');
    return json({ error: 'Signups are not open quite yet.' }, 500);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // Someone signing up twice is enthusiasm. Treat it as success.
    if (error && !/already|exists/i.test(error.message ?? '')) {
      console.error('Resend rejected the contact:', error);
      return json({ error: 'Could not sign you up. Please try again.' }, 502);
    }
  } catch (err) {
    console.error('Resend threw:', err);
    return json({ error: 'Could not sign you up. Please try again.' }, 502);
  }

  return json({ ok: true }, 202);
};

function json(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
