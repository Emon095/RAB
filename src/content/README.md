# Obsidian Content Editing

Open `src/content` as the Obsidian vault.

## Images

Pasted images should go into `attachments/`. The app can render:

- Obsidian embeds in markdown bodies: `![[attachments/example.png]]`
- Obsidian embeds with alt text: `![[attachments/example.png|Alt text]]`
- Local front matter images: `image: attachments/member.png`
- Wiki-style front matter images: `heroImage: "![[attachments/project hero.png]]"`
- Gallery image lists:

```yaml
images:
  - attachments/event 1.png
  - "![[attachments/event 2.png]]"
```

Comma-separated gallery image lists still work too.

## Content Files

- Collection files are numbered per folder, like `001-example.md`, `002-example.md`, and `003-example.md`. Keep this prefix when creating new notes so Obsidian and the site show them from first to last.
- `hero.md` controls the home intro and CTFtime link.
- `about.md` is stored here, but the current About page text is mostly hard-coded in `src/App.tsx`.
- `services/*.md`, `achievements/*.md`, `team/*.md`, `projects/*.md`, and `gallery/*.md` are loaded by the app.

Keep YAML front matter at the top of each file between `---` lines.
