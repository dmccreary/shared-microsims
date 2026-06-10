---
title: Winner-Takes-All Causal Loop Diagram
description: An interactive vis-network CLD of the reinforcing and balancing loops that determine whether AI tips into a single dominant player.
hide:
  - toc
---
# Winner-Takes-All CLD

<iframe src="../cld-viewer/main.html?file=winner-takes-all-cld" height="720px" width="100%" scrolling="no"
  style="overflow: hidden; border: 1px solid #dee2e6;"></iframe>

[Open with full controls (sample buttons, file loader)](../cld-viewer/main.html?file=winner-takes-all-cld&menu=true){ .md-button .md-button--primary }
[Open the diagram in a clean view](../cld-viewer/main.html?file=winner-takes-all-cld){ .md-button }

This diagram is rendered by the shared [CLD Viewer](../cld-viewer/main.html?menu=true)
MicroSim, loading the file [winner-takes-all-cld.json](winner-takes-all-cld.json).
The viewer is a port of the
[systems-thinking course CLD viewer](https://dmccreary.github.io/systems-thinking/sims/cld-viewer/).

**Drag any node** to rearrange the layout. **Click a node, edge, or R/B marker**
for details. The full discussion is in the
[Winner Takes All article](../../articles/winner-takes-all.md).

## Loops

| ID | Type | Name | Role |
|----|------|------|------|
| R1 | Reinforcing | Recursive Self-Improvement | The core "winner-takes-all" hypothesis: better models build better models. |
| R2 | Reinforcing | Autonomous Research | Supercritical loop — closes inside the lab and decouples from human R&D pace. |
| R3 | Reinforcing | Capital → Compute → Capability | Where strategic investment (e.g. Google's $40B in Anthropic) plugs in. |
| R4 | Reinforcing | Data Flywheel | Proprietary interaction data competitors can't see — the lock-in mechanism. |
| B1 | Balancing | Compute Constraint | Compute scarcity throttles everyone, including the leader. |
| B2 | Balancing | Evaluation Bottleneck | Harder-to-evaluate models slow the rate of *reliable* progress. |
| B3 | Balancing | Diffusion / Fast-Follow | Visibility and talent mobility erode any leader's advantage. |
| B4 | Balancing | Cost-Performance Friction | High inference cost suppresses adoption and weakens the data flywheel. |
