---
title: Autoregressive MicroSim
description: Interactive simulation showing how language models predict the next token using neural networks
quality_score: 67
hide:
  - toc
---
# Autoregressive MicroSim

![](auturegressive.gif)

<iframe src="./main.html" height="600px" scrolling="no" style="overflow: hidden;"></iframe>

```html
<iframe src="https://dmccreary.github.io/tracking-ai-course/sims/autoregressive/main.html"  height="450px" scrolling="no"
  style="overflow: hidden;"></iframe>
```

[Run the Autoregressive MicroSim](./main.html){ .md-button .md-button--primary }

[Edit the Autoregressive MicroSim](https://editor.p5js.org/dmccreary/sketches/mO1bzngBS)




!!! prompt
    Please create a new MicroSim that simulates the prediction of the next token from a sequence of words using a neural network.  The simulation works in phases, with five steps per phase.

    ## Layout of the neural network graph
    1. The animation has the five horizontal rows, each with 20 columns of circles.
    2. The labels for each row is on the left.
    3. The leftMargin is 150 for drawing the labels.
    4. The labels on the left column are:
        4.1 "Output" at y = 100
        4.2 "Hidden Layer" at y = 200, 300 and 400
        4.3 "Input" at y = 500
    5. The "Output" layer has light orange filled circles with r=8.
    6. The "Hidden Layers" has gray filled circles with r=8
    7. The "Input Layer" has light blue filled circles with r=8
    8. All circles have a thin 1pm black border
    
    Only 16 of the columns are active at any time showing the context window of 16 in the input row.


    Step 1: Draw 16 arrows from the left-most 16 bottom input layer up to the first hidden layer.  The arrows merge to alternating 8 circles on the lower hidden layer.  Keep the arrows visible for each phase.
    
    Step 2: Draw 8 arrows from the lower hidden layer to the middle hidden layer.  Draw them to alternate nodes so the left-most nodes shift one to the right.

    Step 3. Draw 4 arrows from the middle hidden layer to the top hidden layer.  

    Step 4. Draw 2 arrows from the top hidden layer to the node in column 17 on the top output row.

    Step 5. Animate the circle just generated in the 17th row moving to the 17th circle on the bottom row.  Erase all the arrows on the screen.

    Repeat this animation three times shifting to the right one column each time.
    
    Add buttons for Start/Stop and Reset in the control area at the bottom of the animation.

  ## References

  This MicroSim was inspired by the GIF above in the following
  article:

  [Autoregressive (AR) Language Modeling](https://tonyjesuthasan.medium.com/autoregressive-ar-language-modelling-c9fe5c20aa6e) on Medium.com by Tony Jesuthasan published on Jul 31, 2021
