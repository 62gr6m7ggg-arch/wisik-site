# Hoofdversie beschermen — activering door de eigenaar

Dit importbestand wijzigt op zichzelf geen GitHub-instelling. De koppeling kreeg op 17 september 2026 bij het branch-protection-beheerendpoint HTTP 403 (Resource not accessible by integration). Er zijn geen extra tokens, secrets of omwegen ingesteld.

## Activeren

Open in `62gr6m7ggg-arch/wisik-site`: Settings → Rules → Rulesets → New ruleset → Import a ruleset. Importeer `.github/wisik-main-ruleset.json`. Controleer de instellingen hieronder en klik Create. Controleer dat Enforcement op Active staat.

- Alleen `refs/heads/main` wordt beschermd; werkbranches blijven bewerkbaar.
- Geen bypass-actoren: ook de beheerder moet de publicatieroute volgen.
- Een pull request is verplicht, maar nul externe goedkeuringen. Er wordt geen tweede reviewer vereist en de branch wordt niet read-only gemaakt.
- De check `Verplichte vrijgavecontrole` van GitHub Actions (app-ID 15368, uitgelezen bij de bestaande check) moet slagen, getest met de actuele main.
- Verwijderen en force-push zijn verboden. Gewone merge, squash en rebase blijven toegestaan.

Voorkom twee overlappende configuraties: gebruik deze ruleset óf de equivalente klassieke branchbescherming. Na activering opnieuw de actieve regels en een normale geteste PR controleren. Pas dan is de bescherming als actief af te melden. Dit beschermt niet tegen alle softwarefouten of tegen een beheerder die bewust de regels wijzigt.

Accountbeveiliging is apart: controleer bij GitHub Password and authentication of tweestapsverificatie/passkey en herstelmogelijkheden goed zijn ingesteld. Deel geen wachtwoorden, herstelcodes of geheime tokens in chat of repository. Die accountinstellingen en Cloudflare-instellingen zijn in deze ronde niet gewijzigd.

Bronnen (geraadpleegd 17 september 2026):
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository#importing-a-ruleset
- https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset
