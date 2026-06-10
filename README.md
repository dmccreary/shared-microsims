# Shared MicroSims

Central, single-source-of-truth home for interactive **MicroSims** that are shared
across more than one intelligent textbook (MkDocs Material sites).

- **Repo:** <https://github.com/dmccreary/shared-microsims>
- **Layout:** flat — one directory per MicroSim at the repo root, plus a shared
  `shared-libs/` directory for libraries used by several sims.

Each consuming textbook pulls this repo in as a **git submodule** mounted at
`docs/sims/shared/`, so every sim is served from that book at
`/<book-name>/sims/shared/<sim-name>/`.

## Why this repo exists

Several textbooks (see *Consumers* below) embed the same MicroSims. Copying the
files into each book causes **drift** — a bug fixed in one copy goes stale in the
others. This repo is the one place a shared sim is edited. Each book then decides
*when* to pull in updates by advancing its submodule pointer, so you get a single
source of truth **and** per-book version control.

## Repository layout

```
shared-microsims/
├── README.md
├── shared-libs/              # libraries shared by multiple sims
│   ├── diagram.js            #   interactive infographic/overlay engine
│   └── style.css
├── templates/                # starter template for new sims
├── idea-funnel/              # one directory per MicroSim …
│   ├── index.md              #   lesson page (rendered by the book's mkdocs)
│   ├── main.html             #   the sim itself (iframe target)
│   ├── idea-funnel.js        #   sim source (loaded by main.html)
│   ├── metadata.json         #   title, description, Bloom level, etc.
│   ├── idea-funnel.png       #   social/preview image
│   └── thumbnail.png         #   gallery thumbnail
├── cld-viewer/
└── … (one dir per sim)
```

**Relative paths matter.** Sims that use a shared library reference it as
`../shared-libs/diagram.js`. Because the sim and `shared-libs/` are siblings here
*and* siblings under `docs/sims/shared/` in each book, that relative path resolves
correctly in both places. Never hard-code an absolute path to `shared-libs/`.

## Consumers

| Textbook | Submodule path | Live site |
|----------|----------------|-----------|
| `tracking-ai-course` | `docs/sims/shared/` | <https://dmccreary.github.io/tracking-ai-course/> |
| `ai-strategy-for-education` | `docs/sims/shared/` | <https://dmccreary.github.io/ai-strategy-for-education/> |

> Add a row whenever a new book starts consuming these sims.

---

## Maintainer workflows

### Edit an existing shared sim

Edit it **here**, in this repo — never inside a book's `docs/sims/shared/` working
copy (that leaves the submodule on a detached HEAD and the change orphaned).

```bash
cd ~/Documents/ws/shared-microsims
# …edit idea-funnel/idea-funnel.js …
git commit -am "idea-funnel: fix funnel scaling on narrow screens"
git push
```

The fix is now published. It does **not** appear in any book until that book
advances its submodule pointer (next section). That delay is intentional — each
book opts in to updates.

### Pull an update into a book

```bash
cd ~/Documents/ws/tracking-ai-course/docs/sims/shared
git checkout main && git pull          # fast-forward to latest shared sims
cd ../../..
git add docs/sims/shared               # record the new pinned commit
git commit -m "Update shared sims to latest"
mkdocs gh-deploy                        # build + publish with the update baked in
```

Repeat for each book you want on the new version. A book can stay on an older
pinned commit indefinitely if a change isn't ready for it.

### Add a NEW shared sim

```bash
cd ~/Documents/ws/shared-microsims
cp -R templates my-new-sim             # or generate with the microsim-generator skill
# …build it; keep any shared-lib refs as ../shared-libs/… …
git add my-new-sim && git commit -m "Add my-new-sim" && git push
```

Then in each book that needs it, pull the update (above) and reference it in the
chapter content as `sims/shared/my-new-sim/`.

### Add a NEW consuming book

```bash
cd ~/Documents/ws/<new-book>
git submodule add https://github.com/dmccreary/shared-microsims docs/sims/shared
git commit -m "Add shared-microsims submodule"
```

Reference sims as `sims/shared/<sim-name>/`. Keep the book's *own* (non-shared)
sims as ordinary directories directly under `docs/sims/`.

---

## Gotchas

- **Fresh clone of a book needs the submodule populated.** Either
  `git clone --recurse-submodules <book>` or, after a normal clone,
  `git submodule update --init docs/sims/shared`. Otherwise `docs/sims/shared/`
  is empty and the sims 404.
- **`mkdocs gh-deploy` builds from the working tree** — make sure the submodule is
  checked out first (the step above). The deployed `gh-pages` branch contains plain
  built files, so the live site has no submodule dependency at runtime.
- **CI / GitHub Actions:** set `actions/checkout` with `submodules: recursive`.
- **Edit upstream, not in the book.** Changes made inside a book's
  `docs/sims/shared/` land on a detached HEAD. Always edit in this repo and pull.
- **Two-commit rhythm:** a sim change is committed *here*; the book separately
  commits only the moved submodule *pointer*.

## License

Content is licensed CC BY-NC-SA 4.0 (see `license.txt`), matching the consuming
textbooks.
