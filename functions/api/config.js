export async function onRequestGet({ env }) {
  const feedbackEnabled = Boolean(
    env.TURNSTILE_SITE_KEY &&
    env.TURNSTILE_SECRET_KEY
  );

  return Response.json(
    {
      feedbackEnabled,
      turnstileSiteKey: feedbackEnabled ? env.TURNSTILE_SITE_KEY : "",
      provider: feedbackEnabled ? "formsubmit" : "",
      providerRetentionDays: feedbackEnabled ? 30 : null
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-content-type-options": "nosniff"
      }
    }
  );
}
