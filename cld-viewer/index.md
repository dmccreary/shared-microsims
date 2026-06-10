---
title: Causal Loop Diagram Viewer
description: A generic vis-network viewer for causal loop diagrams (CLDs). Loads any CLD JSON file in the systems-thinking schema.
hide:
  - toc
---
# CLD Viewer

A generic interactive viewer for causal loop diagrams. Click a sample below
to load a CLD, or use the file loader to drop your own JSON file in the
[systems-thinking CLD schema](https://dmccreary.github.io/systems-thinking/clds/).

<iframe src="./main.html?menu=true" height="900px" width="100%" scrolling="no"
  style="overflow: hidden; border: 1px solid #dee2e6;"></iframe>

[Open the viewer in its own tab](./main.html?menu=true){ .md-button .md-button--primary }

## Loaded CLDs

- [Winner Takes All](./main.html?file=winner-takes-all-cld&menu=true) — see the [Winner Takes All article](../../articles/winner-takes-all.md) for the full discussion.

## How it Works

The viewer is a port of the [systems-thinking course CLD viewer](https://dmccreary.github.io/systems-thinking/sims/cld-viewer/).
It uses [vis-network](https://visjs.github.io/vis-network/docs/network/) to render
the diagram with physics disabled, so dragging a node moves it permanently.

### URL Parameters

| Parameter | Effect |
|-----------|--------|
| `?file=<name>` | Loads `examples/<name>.json` on page load. Useful for embedding via iframe. |
| `?menu=true`   | Shows the header, sample buttons, file loader, and details panel. Default is the clean iframe view. |

### Adding New CLDs

1. Drop a `<name>-cld.json` file into [`docs/sims/cld-viewer/examples/`](https://github.com/dmccreary/tracking-ai-course/tree/main/docs/sims/cld-viewer/examples).
2. Add an entry to the `examples` array in [`cld-viewer.js`](https://github.com/dmccreary/tracking-ai-course/blob/main/docs/sims/cld-viewer/cld-viewer.js).
3. Reference it from any markdown page with an iframe pointing at `?file=<name>`.
