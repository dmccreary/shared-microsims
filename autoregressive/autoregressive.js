// Autoregressive Animation MicroSim with Sliding Window
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

// Animation parameters
let phase = 0;
let step = 0;
let maxPhases = 3;
let maxSteps = 5;
let isRunning = false;
let nextButton;
let stepButton;
let resetButton;
let frameDelay = 60; // Fixed 1x speed
let lastStepTime = 0;

// Neural network layout
let nodeRadius = 8;
let leftMargin = 100;
let activeArrows = [];
let animatingNode = null;
let animationProgress = 0;
// horizontal space between circles - changes upon resize
let xSpace = 22;
// Context window size
let contextWindowSize = 16;
// Maximum number of nodes per layer
let maxNodes = 25;
// Define layers at the global scope
let layers = [];

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
  
  describe('Autoregressive neural network animation showing token prediction process with hidden layers and a sliding context window', LABEL);
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
  
  // Draw layer labels
  drawLabels();
  
  // Draw neural network
  drawNeuralNetwork();
  
  // Draw sliding window around context
  drawContextWindow();
  
  // Draw active arrows
  drawArrows();
  
  // Handle animation
  if (isRunning) {
    if (millis() - lastStepTime > frameDelay) {
      executeStep();
      lastStepTime = millis();
    }
  }
  
  // Handle moving node animation
  if (animatingNode !== null) {
    animateMovingNode();
  }
  
  // Clean up completed phases
  if (phase >= maxPhases && step >= maxSteps) {
    isRunning = false;
    nextButton.html('Start');
  }
  
  // Draw step indicator
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);
  text(`Token: ${phase + 1}/${maxPhases} | Layer: ${step + 1}/${maxSteps}`, canvasWidth/2, drawHeight - 55);
  text(`Input tokens: ${phase + 1}-${phase + contextWindowSize} | Predicting Token: ${phase + contextWindowSize + 1}`, canvasWidth/2, drawHeight - 25);
}

// place circles on canvas
function initializeLayers() {
  layers = [];
  let yPositions = [60, 160, 260, 360, 460];
  let nodeColors = ['#FFA07A', 'silver', 'silver', 'silver', '#ADD8E6'];
  let layerNames = ['Output:', 'Hidden 3:', 'Hidden 2:', 'Hidden 1:', 'Input:'];

  // Create nodes for each layer
  for (let i = 0; i < 5; i++) {
    let row = [];
    // Create more nodes than we need to allow sliding
    for (let j = 0; j < maxNodes; j++) {
      row.push({
        x: leftMargin + 20 + j * xSpace,
        y: yPositions[i],
        color: nodeColors[i],
        active: (i === 4 && j >= phase && j < contextWindowSize + phase) // Input layer active for context window
      });
    }
    layers.push({
      nodes: row,
      name: layerNames[i]
    });
  }
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
  
  // Make sure we don't exceed array bounds
  let startIdx = Math.min(phase, maxNodes - contextWindowSize);
  let endIdx = Math.min(startIdx + contextWindowSize - 1, maxNodes - 1);
  
  if (startIdx >= 0 && startIdx < layers[4].nodes.length && 
      endIdx >= 0 && endIdx < layers[4].nodes.length) {
    
    // Draw a rectangle around the active context window in the input layer
    noFill();
    stroke('blue');
    strokeWeight(2);
    
    let startX = layers[4].nodes[startIdx].x - nodeRadius - 5;
    let endX = layers[4].nodes[endIdx].x + nodeRadius + 5;
    let windowWidth = endX - startX;
    
    rect(startX, layers[4].nodes[0].y - nodeRadius - 5, 
         windowWidth, nodeRadius * 2 + 10, 5);
         
    // Label the context window
    fill('blue');
    textSize(12);
    noStroke();
    textAlign(CENTER, BOTTOM);
    text("Context Window", startX + windowWidth/2, layers[4].nodes[0].y - nodeRadius - 8);
  }
}

function drawNeuralNetwork() {
  if (!layers) return;
  
  for (let i = 0; i < layers.length; i++) {
    if (!layers[i] || !layers[i].nodes) continue;
    
    for (let j = 0; j < layers[i].nodes.length; j++) {
      let node = layers[i].nodes[j];
      if (!node) continue;
      
      // Draw node
      stroke('black');
      strokeWeight(1);
      fill(node.color);
      
      // Highlight active nodes
      if (node.active) {
        stroke('blue');
        strokeWeight(3);
      }
      
      circle(node.x, node.y, nodeRadius * 2);
    }
  }
}

function drawArrows() {
  stroke('green');
  strokeWeight(2);
  noFill();
  
  for (let arrow of activeArrows) {
    if (!arrow || !arrow.fromX || !arrow.toX) continue;
    
    beginShape();
    vertex(arrow.fromX, arrow.fromY);
    
    // Add control point for slight curve
    let midX = (arrow.fromX + arrow.toX) / 2;
    let midY = (arrow.fromY + arrow.toY) / 2;
    let controlX = midX + (arrow.toX - arrow.fromX) * 0.2;
    let controlY = midY;
    
    quadraticVertex(controlX, controlY, arrow.toX, arrow.toY);
    endShape();
    
    // Draw arrow head
    drawArrowHead(arrow.toX, arrow.toY, midX, midY);
  }
}

function drawArrowHead(x, y, fromX, fromY) {
  let angle = atan2(y - fromY, x - fromX);
  push();
  translate(x, y);
  rotate(angle);
  fill('green');
  noStroke();
  triangle(-10, -5, -10, 5, 0, 0);
  pop();
}

function executeStep() {
  step++;
  
  if (step === 1) {
    // Clear any existing arrows when starting a new step sequence
    activeArrows = [];
  }
  
  try {
    switch(step) {
      case 1:
        // Step 1: Draw arrows from input to first hidden layer with randomization
        for (let i = 0; i < contextWindowSize; i++) {
          let fromIdx = Math.min(phase + i, maxNodes - 1); // Context window start + offset
          if (fromIdx >= layers[4].nodes.length) continue;
          
          let fromNode = layers[4].nodes[fromIdx];
          
          // Randomize destination with +/- 3 variation
          let baseToIdx = Math.floor(i / 2) + 2;
          let toIdx = baseToIdx + Math.floor(random(-3, 4)); // floor to get integer
          toIdx = constrain(toIdx, 0, maxNodes - 1); // Keep within reasonable bounds
          
          if (toIdx >= layers[3].nodes.length) continue;
          let toNode = layers[3].nodes[toIdx];
          
          activeArrows.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y
          });
        }
        break;
        
      case 2:
        // Step 2: Draw arrows from first hidden to second hidden layer with randomization
        for (let i = 0; i < 10; i++) {
          if (i >= layers[3].nodes.length) continue;
          let fromNode = layers[3].nodes[i];
          
          // Randomize destination with +/- 3 variation
          let baseToIdx = Math.floor(i / 2) + 2;
          let toIdx = baseToIdx + Math.floor(random(-3, 4));
          toIdx = constrain(toIdx, 0, maxNodes - 1);
          
          if (toIdx >= layers[2].nodes.length) continue;
          let toNode = layers[2].nodes[toIdx];
          
          activeArrows.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y
          });
        }
        break;
        
      case 3:
        // Step 3: Draw arrows from second hidden to third hidden layer with randomization
        for (let i = 0; i < 8; i++) {
          if (i >= layers[2].nodes.length) continue;
          let fromNode = layers[2].nodes[i];
          
          // Randomize destination with +/- 3 variation
          let baseToIdx = Math.floor(i / 2) + 2;
          let toIdx = baseToIdx + Math.floor(random(-3, 4));
          toIdx = constrain(toIdx, 0, maxNodes - 1);
          
          if (toIdx >= layers[1].nodes.length) continue;
          let toNode = layers[1].nodes[toIdx];
          
          activeArrows.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y
          });
        }
        break;
        
      case 4:
        // Step 4: Draw arrows from third hidden to output layer with randomization to the next token
        for (let i = 0; i < 4; i++) {
          if (i >= layers[1].nodes.length) continue;
          let fromNode = layers[1].nodes[i];
          
          let outputIdx = Math.min(contextWindowSize + phase, maxNodes - 1); // Next token to predict
          if (outputIdx >= layers[0].nodes.length) continue;
          
          let toNode = layers[0].nodes[outputIdx];
          activeArrows.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y
          });
        }
        break;
        
      case 5:
        // Step 5: Activate output node and prepare for animation
        let outputIdx = Math.min(contextWindowSize + phase, maxNodes - 1);
        if (outputIdx < maxNodes && outputIdx < layers[0].nodes.length && outputIdx < layers[4].nodes.length) {
          layers[0].nodes[outputIdx].active = true;
          animatingNode = {
            fromX: layers[0].nodes[outputIdx].x,
            fromY: layers[0].nodes[outputIdx].y,
            toX: layers[4].nodes[outputIdx].x,
            toY: layers[4].nodes[outputIdx].y,
            toIdx: outputIdx
          };
          animationProgress = 0;
        }
        break;
    }
  } catch (error) {
    console.error("Error in executeStep:", error);
    step = maxSteps; // Skip to end of sequence if error occurs
  }
  
  if (step >= maxSteps) {
    // Go to next phase after all steps complete
    phase++;
    step = 0;
    
    if (phase >= maxPhases) {
      isRunning = false;
      nextButton.html('Start');
    }
  }
}

function animateMovingNode() {
  if (!animatingNode) return;
  
  animationProgress += 0.02; // Slowed down for better visibility
  
  if (animationProgress >= 1) {
    // Animation complete
    if (animatingNode.toIdx < layers[4].nodes.length) {
      layers[4].nodes[animatingNode.toIdx].active = true;
    }
    animatingNode = null;
    
    // Clear arrows for next phase and update network
    activeArrows = [];
    updateNetworkForNextPhase();
  } else {
    // Draw moving node
    let x = lerp(animatingNode.fromX, animatingNode.toX, animationProgress);
    let y = lerp(animatingNode.fromY, animatingNode.toY, animationProgress);
    
    fill('#FFA07A');
    stroke('blue');
    strokeWeight(2);
    circle(x, y, nodeRadius * 2);
  }
}

function updateNetworkForNextPhase() {
  // Reset all nodes
  for (let i = 0; i < layers.length; i++) {
    for (let j = 0; j < layers[i].nodes.length; j++) {
      layers[i].nodes[j].active = false;
    }
  }
  
  // Activate new context window nodes in input layer
  let startIdx = Math.min(phase, maxNodes - contextWindowSize);
  let endIdx = Math.min(startIdx + contextWindowSize, maxNodes);
  
  for (let j = startIdx; j < endIdx; j++) {
    if (j < layers[4].nodes.length) {
      layers[4].nodes[j].active = true;
    }
  }
}

function toggleAnimation() {
  if (!isRunning) {
    isRunning = true;
    nextButton.html('Pause');
  } else {
    isRunning = false;
    nextButton.html('Continue');
  }
}

function stepForward() {
  if (!isRunning && animatingNode === null) {
    executeStep();
  }
}

function resetAnimation() {
  phase = 0;
  step = 0;
  isRunning = false;
  nextButton.html('Start');
  activeArrows = [];
  animatingNode = null;
  initializeLayers();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  // Move buttons to correct positions
  nextButton.position(margin, drawHeight + 15);
  stepButton.position(margin + 80, drawHeight + 15);
  resetButton.position(margin + 160, drawHeight + 15);
  
  // Redraw the canvas
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
  // Update spacing based on new width
  xSpace = Math.max(10, (canvasWidth - leftMargin - 60) / 24);
  
  // Reinitialize with new spacing
  initializeLayers();
}