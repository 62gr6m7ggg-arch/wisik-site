from pathlib import Path

path = Path("public/assets/js/site.js")
source = path.read_text(encoding="utf-8")
start_marker = '    forms.forEach((form) => {\n      form.addEventListener("submit", async (event) => {'
end_marker = '\n  function markCurrentNav()'
start = source.find(start_marker)
end = source.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit("Kladblok-submitblok niet eenduidig gevonden")

replacement = '''    const returnedFromDelivery = new URL(window.location.href);
    if (returnedFromDelivery.searchParams.get("verzonden") === "1") {
      forms.forEach((form) => {
        const status = form.querySelector(".form-status");
        if (status) {
          status.className = "form-status good";
          status.textContent = "Dank! Je notitie is bij Wisik aangekomen.";
        }
      });
      returnedFromDelivery.searchParams.delete("verzonden");
      const query = returnedFromDelivery.searchParams.toString();
      history.replaceState(null, "", `${returnedFromDelivery.pathname}${query ? `?${query}` : ""}${returnedFromDelivery.hash}`);
    }

    const submitViaBrowser = (delivery) => {
      const action = new URL(String(delivery?.action || ""));
      if (
        delivery?.method !== "POST" ||
        action.origin !== "https://formsubmit.co" ||
        action.pathname !== "/kladblok@wisik.nl" ||
        !delivery.fields ||
        typeof delivery.fields !== "object" ||
        Array.isArray(delivery.fields)
      ) {
        throw new Error("De bezorgroute is niet geldig");
      }

      const relay = document.createElement("form");
      relay.method = "POST";
      relay.action = action.href;
      relay.acceptCharset = "UTF-8";
      relay.hidden = true;

      for (const [name, value] of Object.entries(delivery.fields)) {
        if (!name || value === undefined || value === null) continue;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = String(name);
        input.value = String(value);
        relay.appendChild(input);
      }

      document.body.appendChild(relay);
      relay.submit();
    };

    forms.forEach((form) => {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submit = form.querySelector("button[type='submit']");
        const status = form.querySelector(".form-status");
        const data = new FormData(form);
        const message = String(data.get("message") || "").trim();
        if (message.length < 10) {
          status.className = "form-status bad";
          status.textContent = "Schrijf iets meer, zodat je notitie goed te begrijpen is.";
          return;
        }
        const token = String(data.get("cf-turnstile-response") || "");
        if (!token) {
          status.className = "form-status bad";
          status.textContent = "Rond eerst de spamcontrole af.";
          return;
        }

        submit.disabled = true;
        status.className = "form-status";
        status.textContent = "Je notitie wordt gecontroleerd…";
        const payload = {
          category: String(data.get("category") || "algemeen"),
          attraction: String(data.get("attraction") || "algemeen"),
          message,
          email: String(data.get("email") || "").trim(),
          quotePermission: data.get("quotePermission") === "yes",
          company: String(data.get("company") || ""),
          page: window.location.pathname,
          siteVersion: window.WISIK_SITE_VERSION || "onbekend",
          turnstileToken: token
        };

        try {
          const response = await fetch("/api/feedback", {
            method: "POST",
            headers: { "content-type": "application/json", "accept": "application/json" },
            body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.message || "controle mislukt");

          if (result.ignored) {
            form.reset();
            status.className = "form-status good";
            status.textContent = "Dank! Je notitie is bij Wisik aangekomen.";
            submit.disabled = false;
            const widgetId = Number(form.dataset.turnstileWidget);
            if (window.turnstile && Number.isFinite(widgetId)) window.turnstile.reset(widgetId);
            return;
          }

          status.textContent = "De spamcontrole is geslaagd. Je notitie wordt beveiligd bezorgd…";
          submitViaBrowser(result.delivery);
        } catch (error) {
          status.className = "form-status bad";
          status.textContent = `De notitie kon niet worden verzonden. Probeer later opnieuw of mail naar kladblok@wisik.nl. (${error.message})`;
          submit.disabled = false;
          const widgetId = Number(form.dataset.turnstileWidget);
          if (window.turnstile && Number.isFinite(widgetId)) window.turnstile.reset(widgetId);
        }
      });
    });
  }
'''

updated = source[:start] + replacement + source[end:]
if updated == source:
    raise SystemExit("Geen wijziging uitgevoerd")
path.write_text(updated, encoding="utf-8")
