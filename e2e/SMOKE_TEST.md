# Browser smoke test lesson

Everything students need to read or edit is in `.github/workflows/smoke-test.md`.
There are no imports or shared setup files.

Teach the file in order:

1. **Configuration:** manual trigger, MiniMax model/key, Playwright, and reporting.
2. **Start the app:** build .NET, then run it locally with a temporary database.
3. **Check three things:** home page, employee page, and the login redirect.
4. **Clean up and report:** stop the app and publish a PASS/FAIL/BLOCKED table.

Your existing `MINIMAX_API_KEY` secret and Discussions `q-a` category are reused.
The accessibility workflow and deterministic Playwright CI are unchanged.

After editing, compile from the repository root:

```bash
gh aw compile smoke-test --strict
```

The generated `.lock.yml` is required by GitHub Actions; students do not edit it.
After review and publishing the files to the default branch, choose
**Actions → Browser Smoke Test → Run workflow**.

The report contains agent observations, not deterministic CI assertions.
Compilation, actionlint, and shellcheck were checked locally. No workflow run,
commit, or push was performed during this change.
