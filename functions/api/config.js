export async function onRequestGet({ env }) {
  const feedbackEnabled = Boolean(
    env.TURNSTILE_SITE_KEY &&
    env.TURNSTILE_SECRET_KEY &&
    env.CF_ACCOUNT_ID &&
    env.EMAIL_API_TOKEN &&
    env.FEEDBACK_TO &&
    env.FEEDBACK_FROM
  );

  return Response.json(
    {
      feedbackEnabled,
      turnstileSiteKey: feedbackEnabled ? env.TURNSTILE_SITE_KEY : ""
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff"
      }
    }
  );
}
