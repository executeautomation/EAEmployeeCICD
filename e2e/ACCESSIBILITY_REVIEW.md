# Accessibility Review: student setup

This follows the GitHub example: **start the app → browse public pages → report
accessibility findings in one GitHub Discussion**. The .NET setup, local URL,
disposable database, Codex engine using MiniMax, and current Playwright CLI are
already configured.

## What you need to change

1. Add the repository Actions secret **`MINIMAX_API_KEY`**. Use a MiniMax key
   authorized for `MiniMax-M3.1-Flash` through `https://api.minimax.io/v1`, with
   sufficient quota. Do not put the key in the workflow. No OpenAI API key or
   Copilot cloud coding-agent subscription is required.
2. Enable **Discussions** in the repository settings. Ensure a category with slug
   `q-a` exists. If you want a different category, change `category: q-a` in
   `.github/workflows/accessibility-review.md` to that category's slug and recompile.
3. Review and publish the source `.md`, generated `.lock.yml`, and action pin cache
   to the default branch. No commit or push was performed during this setup.
4. In **Actions → Accessibility Review → Run workflow**, start a manual run.
   Review trusted revisions only. Findings appear in Discussions; a clean or
   blocked review is recorded through `noop` in the Actions run diagnostics.

From the repository root, the equivalent commands are:

```bash
# Prompts for the key; never type the key directly into a command:
gh secret set MINIMAX_API_KEY --repo executeautomation/EAEmployeeCICD

# Recompile after editing the Markdown workflow:
gh aw compile accessibility-review --strict

# After review and publishing to the default branch:
gh workflow run accessibility-review.lock.yml --repo executeautomation/EAEmployeeCICD
```

## Optional teaching changes

- Keep `model:` and the threat-detection `model:` aligned if you later change
  MiniMax models. Update the model pricing entry as well.
- Change the page list in section 2 to focus the exercise.
- Keep the manual trigger while teaching. No schedule is enabled.
- The app URL is already `http://127.0.0.1:5114`; no deployed URL is needed.

This checks public pages without logging in or changing employee data. It is an
agent's accessibility review, not full WCAG certification or a replacement for
the deterministic tests in `.github/workflows/playwright.yml`. Dependency setup
runs as normal Actions steps; the agent's outbound network is restricted to
infrastructure, Playwright, the W3C reference site, and `api.minimax.io`. The agent's GitHub access stays read-only. The current gh-aw compiler grants
its separate reporting/conclusion jobs Discussion and Issue write permissions
for discussion handling; issue fallback and automatic issue reports are disabled.
The first GitHub run still needs to verify API/model access, the Linux sandbox,
and your discussion category. GitHub Actions and MiniMax usage charges or plan limits may apply.

Source: https://github.com/githubnext/agentics/blob/main/workflows/accessibility-review.md

Validation: compiled with gh-aw v1.0.1; strict schema/action validation, actionlint,
shellcheck, and the startup shell syntax check passed. The existing .NET publish
command was previously verified in an isolated copy. No GitHub run was dispatched.

## MiniMax configuration

The workflow keeps Codex as the agent and uses `MiniMax-M3.1-Flash` for both the
browser review and threat detection. gh-aw maps `MINIMAX_API_KEY` into the
OpenAI-compatible credential variable names required by Codex; those names do
not mean that an OpenAI key is needed. There is no fallback to repository OpenAI
or Codex secrets. The real key is excluded from the agent sandbox and handled
by gh-aw's API proxy and secret redaction.

The workflow uses MiniMax's Responses-compatible endpoint at
`https://api.minimax.io/v1`. Automatic model fallback is disabled for both engine jobs, and proxy token
steering is disabled for the main agent. gh-aw v1.0.1 retains its default token
steering for the detector; this provider interaction still needs a live run. Pricing metadata uses MiniMax's published
USD rates per token (input, output, and cached input), checked on 3 November 2026.
This supports gh-aw's usage estimates; your actual MiniMax plan/billing is
controlled by MiniMax. Recheck the pricing entry when changing models or rates.

Reviewed the new `MINIMAX_API_KEY` reference: it is bound only to engine
validation, inference, and framework redaction, never the application startup
commands or a plaintext file. Both generated proxy configurations target
`api.minimax.io` and both engine jobs use the MiniMax model. No new action or
container dependencies were introduced by this provider change.

Local compilation and linting passed. API authentication, actual tool execution,
and account/plan eligibility still require the first manual GitHub run; no API
request or paid run was made during this change.

References: [MiniMax with Codex](https://platform.minimax.io/docs/m-plan/codex),
[gh-aw custom endpoints](https://github.github.com/gh-aw/reference/engines/#custom-api-endpoints-via-environment-variables),
and [MiniMax pricing](https://platform.minimax.io/docs/pricing/overview).
