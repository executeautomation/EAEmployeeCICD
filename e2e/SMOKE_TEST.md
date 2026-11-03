# Browser smoke test lesson

Everything students need to read or edit is in `.github/workflows/smoke-test.md`.
There are no imports or shared setup files.

Teach the file in order:

1. **Configuration:** issue trigger, MiniMax model/key, Playwright, and reporting.
2. **Start the app:** build .NET, then run it locally with a temporary database.
3. **Check three things:** home page, employee page, and the login redirect.
4. **Clean up and report:** stop the app and comment with a PASS/FAIL/BLOCKED table on the issue.

Your existing `MINIMAX_API_KEY` secret is reused. This workflow does not need a
Discussions category.
The accessibility workflow and deterministic Playwright CI are unchanged.

After editing, compile from the repository root:

```bash
gh aw compile smoke-test --strict
```

The generated `.lock.yml` is required by GitHub Actions; students do not edit it.
After review and publishing the files to the default branch, create a new issue
with a title starting exactly with `[smoke-test]`, for example:

```text
[smoke-test] Run browser checks
```

The workflow runs once when the issue is opened and posts the results as a
comment on that issue. Other issue titles are skipped. Editing an existing
issue or reopening it does not trigger this version; create a new issue.
This replaces the previous manual **Run workflow** trigger.

The report contains agent observations, not deterministic CI assertions.
Compilation, actionlint, and shellcheck were checked locally. No workflow run,
commit, or push was performed during this change.
