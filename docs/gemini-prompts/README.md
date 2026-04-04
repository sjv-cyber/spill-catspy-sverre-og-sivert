# Gemini CLI — headless prompt packs

Use with **Gemini CLI** (headless) to batch-generate **text** drafts. Review output before merging into `assets/story/` or room JSON.

## Suggested invocation

From repo root (adjust to your CLI flags):

```bash
gemini --prompt "$(cat docs/gemini-prompts/terminal_logs_batch.txt)" > docs/gemini-output/terminal_logs_draft.md
```

On Windows PowerShell:

```powershell
Get-Content docs/gemini-prompts/terminal_logs_batch.txt -Raw | gemini @(... your args ...) | Out-File docs/gemini-output/terminal_logs_draft.md -Encoding utf8
```

## Files

- `terminal_logs_batch.txt` — Dr. Cross terminal voice, CHIMERA tone.
- `room_entry_text_batch.txt` — short `entry_text` lines per room id.
- `family_playtest_feedback.txt` — Gemini roleplays a mixed-age family reacting to the pitch; output under `docs/gemini-output/` for design iteration.
