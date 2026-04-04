# tools/gemini

Coordination for **Gemini CLI** headless runs (see [docs/gemini-prompts](../../docs/gemini-prompts/README.md)).

- Prompts live in `docs/gemini-prompts/*.txt`.
- Raw CLI output → `docs/gemini-output/` (gitignored content optional; `.gitkeep` keeps folder).
- A human or agent **normalizes** drafts into `assets/story/terminal_logs.json` or room JSON `entry_text` fields.

Do **not** commit API keys. Use env vars your Gemini CLI documents.
