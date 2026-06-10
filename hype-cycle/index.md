---
title: Technology Hype Cycle Infographic
description: Interactive visualization of the Gartner Technology Hype Cycle phases
quality_score: 70
image: /sims/hype-cycle/hype-cycle.png
og:image: /sims/hype-cycle/hype-cycle.png
twitter:image: /sims/hype-cycle/hype-cycle.png
social:
   cards: false
---
# Technology Hype Cycle Infographic

<iframe src="./main.html" height="470px" scrolling="no"
  style="overflow: hidden;"></iframe>

```html
<iframe src="https://dmccreary.github.io/tracking-ai-course/sims/hype-cycle/main.html"  height="470px" scrolling="no"
  style="overflow: hidden;"></iframe>
```

[Run the Technology Hype Cycle Infographic](./main.html){ .md-button .md-button--primary }

[Edit the Technology Hype Cycle Infographic](https://editor.p5js.org/dmccreary/sketches/sCKCqcium)

<details>
    <summary>MicroSim Prompt</summary>
Please create an infographic that describes technology hype-cycles.  Draw the curve using p5.js and follow the guidelines for other infographics where when you hover over a region an infobox describes that region.

The history of AI is marked by cycles of extraordinary hype followed by periods of disillusionment when promised capabilities fail to materialize. Understanding past failures helps us assess whether we might be heading toward another "AI winter" in 2025.
</details>



The user wants a p5.js infographic to showcase the Gartner technology hype-cycle. The infographic needs the classic curve: technology trigger, peak of inflated expectations, trough of disillusionment, slope of enlightenment, and plateau of productivity. They want interactive hover information on each region and to follow the guidelines in the "standard-rules.md", including a responsive layout and hover functions. I'll write up the entire p5.js sketch code with the necessary functions—like setup(), draw(), and windowResized(). It needs to be fully operational in p5.js editor.

I’ll follow the structure of previous MicroSims like ai-causes.js and book-gen-workflow.js, focusing on the drawing area and an interactive hover feature without controls. I'll define regions with labels and descriptions for each part of the hype-cycle curve. To detect hover, I'll check if the mouse is within the defined X-range of each phase. By dividing the X-axis into 5 segments and using simple checks, the region description will appear when hovering. I'll draw the hype-cycle curve with vertices or bezier points for smooth transitions between phases.

For the hype-cycle curve, I'll set positions for key points like the peak, trough, slope, and plateau, adjusting them relative to the canvas. I'll use the curveVertex method to smoothly connect these points, drawing a cubic Bezier for each segment. Each region will be defined by the X-range of the curve, and when the mouse hovers over a segment, the corresponding description will appear. The description area will be placed within the control area, and a semi-transparent rectangle will highlight the hovered region. I'll use checkHover to determine which region is being hovered over.