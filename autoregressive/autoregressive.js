// Autoregressive Token Generation MicroSim
// Arrows flow from the input row (bottom) up through the hidden layers,
// converging on one new predicted token at the right end of the output
// row (top). The new token then drops down to join the input context
// window, the window slides right one position, and the cycle repeats.

// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
// general margin around drawing
let margin = 25;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth;
let containerHeight = canvasHeight;

// Neural network layout
// layers[0] = Output (top) ... layers[4] = Input (bottom)
let layers = [];
let yPositions = [60, 160, 260, 360, 460];
let nodeRadius = 8;
let leftMargin = 100;
// horizontal space between circles - changes upon resize
let xSpace = 22;
// Context window size (must be a power of 2 for the converging tree)
let contextWindowSize = 16;
// Maximum number of nodes per layer
let maxNodes = 25;

// Animation state machine
// step 0 = waiting to start a phase
// steps 1-4 = arrows growing: input->h1, h1->h2, h2->h3, h3->output
// step 5 = new token appears at output, then drops down to the input row
let phase = 0; // how far the context window has slid right
let maxPhases = maxNodes - contextWindowSize; // last output column is maxNodes-1
let step = 0;
let maxSteps = 5;
let stepProgress = 0; // 0..1 within the current step
let arrowGrowSpeed = 0.025; // progress per frame for arrow steps
let tokenDropSpeed = 0.012; // progress per frame for the token drop
let isRunning = false;
let singleStep = false; // true while a Step click is animating

// Arrows store node indices (not pixels) so window resize is safe
let arrows = []; // {fromLayer, fromIdx, toLayer, toIdx, level}
let predictedTokens = []; // output-row indices generated so far

let stepNames = [
  'Ready',
  'Input → Hidden 1',
  'Hidden 1 → Hidden 2',
  'Hidden 2 → Hidden 3',
  'Hidden 3 → Output',
  'New token → context window'
];

let nextButton;
let stepButton;
let resetButton;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Create controls
  nextButton = createButton('Start');
  nextButton.position(margin, drawHeight + 15);
  nextButton.mousePressed(toggleAnimation);

  stepButton = createButton('Step');
  stepButton.position(margin + 80, drawHeight + 15);
  stepButton.mousePressed(stepForward);

  resetButton = createButton('Reset');
  resetButton.position(margin + 160, drawHeight + 15);
  resetButton.mousePressed(resetAnimation);

  initializeLayers();

  describe('Autoregressive neural network animation showing arrows flowing from the input tokens up through three hidden layers to predict the next token, which then drops down to join the sliding context window', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Controls area
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Autoregressive Token Prediction", canvasWidth/2, margin/2);

  // Advance the animation state machine
  if (isRunning || singleStep) {
    if (step === 0) {
      enterStep(1);
    } else {
      stepProgress += (step === maxSteps) ? tokenDropSpeed : arrowGrowSpeed;
      if (stepProgress >= 1) {
        stepProgress = 1;
        finishStep();
      }
    }
  }

  drawLabels();
  drawNeuralNetwork();
  drawContextWindow();
  drawArrows();
  drawDroppingToken();
  drawStatusText();
}

// place circles on canvas
function initializeLayers() {
  layers = [];
  let nodeColors = ['#FFA07A', 'silver', 'silver', 'silver', '#ADD8E6'];
  let layerNames = ['Output:', 'Hidden 3:', 'Hidden 2:', 'Hidden 1:', 'Input:'];

  for (let i = 0; i < 5; i++) {
    let row = [];
    for (let j = 0; j < maxNodes; j++) {
      row.push({
        x: leftMargin + 20 + j * xSpace,
        y: yPositions[i],
        color: nodeColors[i],
        active: false
      });
    }
    layers.push({
      nodes: row,
      name: layerNames[i]
    });
  }

  // Restore highlights from the current animation state
  updateContextWindow();
  for (let idx of predictedTokens) {
    if (idx < layers[0].nodes.length) {
      layers[0].nodes[idx].active = true;
    }
  }
}

// Highlight the input nodes inside the sliding context window
function updateContextWindow() {
  if (!layers || layers.length < 5) return;
  for (let j = 0; j < layers[4].nodes.length; j++) {
    layers[4].nodes[j].active = (j >= phase && j < phase + contextWindowSize);
  }
}

// Begin a new sub-step of the current phase
function enterStep(newStep) {
  step = newStep;
  stepProgress = 0;
  if (step >= 1 && step <= 4) {
    arrows = arrows.concat(computeArrowsForLevel(step));
  } else if (step === maxSteps) {
    // The predicted token appears on the output row
    let outputIdx = phase + contextWindowSize;
    if (outputIdx < layers[0].nodes.length) {
      predictedTokens.push(outputIdx);
      layers[0].nodes[outputIdx].active = true;
    }
  }
}

// Complete the current sub-step and move on
function finishStep() {
  if (step < maxSteps) {
    enterStep(step + 1);
  } else {
    // Token has landed on the input row: slide the window and repeat
    arrows = [];
    phase++;
    if (phase >= maxPhases) {
      // Loop the whole animation, like the reference GIF
      phase = 0;
      predictedTokens = [];
      initializeLayers();
    }
    updateContextWindow();
    step = 0;
    stepProgress = 0;
  }
  if (singleStep) {
    singleStep = false;
  }
}

// Converging tree: 16 inputs -> 8 -> 4 -> 2 -> 1 new output token.
// At each level, a pair of source nodes merges into one target node;
// the final pair converges on the next-token column of the output row.
function computeArrowsForLevel(level) {
  let result = [];
  let groupSize = Math.pow(2, level);
  let groupCount = contextWindowSize / groupSize;
  let fromLayer = 5 - level;
  let toLayer = 4 - level;

  for (let j = 0; j < groupCount; j++) {
    let leftSrc = phase + groupSize * j + groupSize / 2 - 1;
    let rightSrc = phase + groupSize * j + groupSize - 1;
    let dst = (level === 4) ? phase + contextWindowSize
                            : phase + groupSize * j + groupSize - 1;
    if (dst >= maxNodes) continue;
    result.push({fromLayer: fromLayer, fromIdx: leftSrc, toLayer: toLayer, toIdx: dst, level: level});
    result.push({fromLayer: fromLayer, fromIdx: rightSrc, toLayer: toLayer, toIdx: dst, level: level});
  }
  return result;
}

// Draw the layer labels in the left side margin
function drawLabels() {
  if (!layers || layers.length === 0) return;

  fill('black');
  textSize(16);
  textAlign(RIGHT, CENTER);
  noStroke();
  for (let i = 0; i < layers.length; i++) {
    if (layers[i] && layers[i].nodes && layers[i].nodes.length > 0) {
      text(layers[i].name, leftMargin - 10, layers[i].nodes[0].y);
    }
  }
}

function drawContextWindow() {
  if (!layers || layers.length < 5 || !layers[4].nodes) return;

  let startIdx = Math.min(phase, maxNodes - contextWindowSize);
  let endIdx = Math.min(startIdx + contextWindowSize - 1, maxNodes - 1);

  if (startIdx >= 0 && startIdx < layers[4].nodes.length &&
      endIdx >= 0 && endIdx < layers[4].nodes.length) {

    noFill();
    stroke('blue');
    strokeWeight(2);

    let startX = layers[4].nodes[startIdx].x - nodeRadius - 5;
    let endX = layers[4].nodes[endIdx].x + nodeRadius + 5;
    let windowWidth = endX - startX;

    rect(startX, layers[4].nodes[0].y - nodeRadius - 5,
         windowWidth, nodeRadius * 2 + 10, 5);

    fill('blue');
    textSize(12);
    noStroke();
    textAlign(CENTER, BOTTOM);
    text("Context Window", startX + windowWidth/2, layers[4].nodes[0].y - nodeRadius - 8);
  }
}

function drawNeuralNetwork() {
  if (!layers) return;

  // Rows start with only the initial context window of tokens and grow
  // to the right as the LLM generates new ones. An output circle appears
  // when its token is predicted (step 5 pulse); the input and hidden
  // rows gain a column only after that token lands on the input row.
  let inputVisible = Math.min(contextWindowSize + phase, maxNodes);
  let outputVisible = Math.min(contextWindowSize + predictedTokens.length, maxNodes);

  for (let i = 0; i < layers.length; i++) {
    if (!layers[i] || !layers[i].nodes) continue;

    let visibleCount = (i === 0) ? outputVisible : inputVisible;
    for (let j = 0; j < visibleCount; j++) {
      let node = layers[i].nodes[j];
      if (!node) continue;

      stroke('black');
      strokeWeight(1);
      fill(node.color);

      // Highlight active nodes
      if (node.active) {
        stroke('blue');
        strokeWeight(2);
        if (i === 0) {
          fill('#FF8C00'); // generated output tokens are darker orange
        }
      }

      circle(node.x, node.y, nodeRadius * 2);
    }
  }
}

function drawArrows() {
  for (let arrow of arrows) {
    let fromNode = layers[arrow.fromLayer].nodes[arrow.fromIdx];
    let toNode = layers[arrow.toLayer].nodes[arrow.toIdx];
    if (!fromNode || !toNode) continue;

    // Trim the arrow so it starts and ends at the circle edges
    let dx = toNode.x - fromNode.x;
    let dy = toNode.y - fromNode.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 1) continue;
    let startX = fromNode.x + (dx / dist) * (nodeRadius + 2);
    let startY = fromNode.y + (dy / dist) * (nodeRadius + 2);
    let endX = toNode.x - (dx / dist) * (nodeRadius + 4);
    let endY = toNode.y - (dy / dist) * (nodeRadius + 4);

    // Arrows for the current step grow from source to target;
    // arrows from earlier steps stay fully drawn but fade lighter
    let progress = 1;
    let arrowShade = color(150);
    if (arrow.level === step && step <= 4) {
      progress = stepProgress;
      arrowShade = color(60);
    }
    let tipX = lerp(startX, endX, progress);
    let tipY = lerp(startY, endY, progress);

    stroke(arrowShade);
    strokeWeight(2);
    line(startX, startY, tipX, tipY);

    if (progress > 0.15) {
      drawArrowHead(tipX, tipY, startX, startY, arrowShade);
    }
  }
}

function drawArrowHead(x, y, fromX, fromY, arrowShade) {
  let angle = atan2(y - fromY, x - fromX);
  push();
  translate(x, y);
  rotate(angle);
  fill(arrowShade);
  noStroke();
  triangle(-9, -4, -9, 4, 0, 0);
  pop();
}

// Step 5: the new token pulses into view on the output row,
// then a blue copy drops down to the input row at the same column
function drawDroppingToken() {
  if (step !== maxSteps) return;

  let outputIdx = phase + contextWindowSize;
  if (outputIdx >= layers[0].nodes.length) return;
  let topNode = layers[0].nodes[outputIdx];
  let bottomNode = layers[4].nodes[outputIdx];

  let appearPortion = 0.25;
  if (stepProgress < appearPortion) {
    // Pulse the newly predicted token
    let pulse = 1 + 0.6 * sin((stepProgress / appearPortion) * PI);
    fill('#FF8C00');
    stroke('blue');
    strokeWeight(2);
    circle(topNode.x, topNode.y, nodeRadius * 2 * pulse);
  } else {
    // Drop a blue copy down to the input row
    let t = (stepProgress - appearPortion) / (1 - appearPortion);
    let x = lerp(topNode.x, bottomNode.x, t);
    let y = lerp(topNode.y, bottomNode.y, t);
    fill('#ADD8E6');
    stroke('blue');
    strokeWeight(2);
    circle(x, y, nodeRadius * 2);
  }
}

function drawStatusText() {
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);
  let stepLabel = (step === 0 && !isRunning) ? 'Press Start or Step' : stepNames[step];
  text(`Token ${phase + 1} of ${maxPhases} | ${stepLabel}`, canvasWidth/2, drawHeight - 55);
  text(`Context: tokens ${phase + 1}–${phase + contextWindowSize} | Predicting token ${phase + contextWindowSize + 1}`,
       canvasWidth/2, drawHeight - 25);
}

function toggleAnimation() {
  if (!isRunning) {
    isRunning = true;
    singleStep = false;
    nextButton.html('Pause');
  } else {
    isRunning = false;
    nextButton.html('Continue');
  }
}

function stepForward() {
  if (!isRunning && !singleStep) {
    singleStep = true;
  }
}

function resetAnimation() {
  phase = 0;
  step = 0;
  stepProgress = 0;
  isRunning = false;
  singleStep = false;
  nextButton.html('Start');
  arrows = [];
  predictedTokens = [];
  initializeLayers();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);

  // Move buttons to correct positions
  nextButton.position(margin, drawHeight + 15);
  stepButton.position(margin + 80, drawHeight + 15);
  resetButton.position(margin + 160, drawHeight + 15);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  // Update spacing based on new width
  xSpace = Math.max(10, (canvasWidth - leftMargin - 60) / (maxNodes - 1));
  // Shrink circles on narrow screens so they never overlap
  nodeRadius = Math.min(8, Math.max(4, xSpace * 0.4));

  // Rebuild node positions; animation state is preserved because
  // arrows are stored as node indices, not pixel coordinates
  initializeLayers();
}
