// Rates of Improvement Over Time MicroSim
// Shows different patterns of growth rates over time

// Canvas dimensions
let canvasWidth = 400;                      // Initial width that will be updated responsively
let drawHeight = 350;                       // Height of drawing area
let controlHeight = 30;                     // Height for checkbox controls
let canvasHeight = drawHeight + controlHeight; // Total canvas height
let margin = 15;                            // Margin for visual elements
let defaultTextSize = 16;                   // Base text size for readability

// Global variables for responsive design
let containerWidth;                         // Calculated from container upon resize
let containerHeight = canvasHeight;         // Usually fixed height on page

// Chart variables
let timePoints = [];                        // Array to store time points
let redLine = [];                          // Initial rapid growth, peaking now and declining
let greenLine = [];                        // Initial rapid growth, flattening out
let blueLine = [];                         // Initial rapid growth, slow linear growth
let purpleLine = [];                       // Initial rapid growth, continued exponential growth

// Checkbox variables
let redCheckbox, greenCheckbox, blueCheckbox, purpleCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  
  // Generate data points
  generateDataPoints();
  
  // Create checkboxes for each line
  let checkboxX = 10;
  let checkboxY = drawHeight + 10;
  let checkboxSpacing = 150;
  
  redCheckbox = createCheckbox('Peak and Decline', true);
  redCheckbox.position(checkboxX, checkboxY);
  redCheckbox.style('color', 'red');
  
  greenCheckbox = createCheckbox('Flattening', true);
  greenCheckbox.position(checkboxX + checkboxSpacing, checkboxY);
  greenCheckbox.style('color', 'green');
  
  blueCheckbox = createCheckbox('Linear Growith', true);
  blueCheckbox.position(checkboxX + checkboxSpacing * 2, checkboxY);
  blueCheckbox.style('color', 'blue');
  
  purpleCheckbox = createCheckbox('Exponential Growth', true);
  purpleCheckbox.position(checkboxX + checkboxSpacing * 3, checkboxY);
  purpleCheckbox.style('color', 'purple');
  
  describe('A line chart showing different patterns of improvement rates over time with vertical "Now" marker in the center and checkboxes to toggle lines.', LABEL);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  // Reposition checkboxes
  let checkboxSpacing = (containerWidth - 20) / 4;
  let checkboxX = 10;
  let checkboxY = drawHeight + 10;
  
  redCheckbox.position(checkboxX, checkboxY);
  greenCheckbox.position(checkboxX + checkboxSpacing, checkboxY);
  blueCheckbox.position(checkboxX + checkboxSpacing * 2, checkboxY);
  purpleCheckbox.position(checkboxX + checkboxSpacing * 3, checkboxY);
}

function generateDataPoints() {
  let numPoints = 50;  // Total data points
  let nowIndex = 25;   // Index where "Now" line will be drawn
  
  for (let i = 0; i < numPoints; i++) {
    let t = i / numPoints;
    timePoints[i] = i;
    
    // Red line: rapid growth, peaks at "Now", then declines
    if (i <= nowIndex) {
      // Use exponential growth up to "Now"
      redLine[i] = 10 * (1 - exp(-0.2 * i));
    } else {
      // Decline after "Now"
      let peak = 10 * (1 - exp(-0.2 * nowIndex));
      redLine[i] = peak * (1 - 0.05 * (i - nowIndex));
    }
    
    // Green line: rapid growth, then flattens
    greenLine[i] = 8 * (1 - exp(-0.15 * i));
    
    // Blue line: rapid initial growth, then slow linear growth
    if (i <= 10) {
      blueLine[i] = 4 * (1 - exp(-0.3 * i));
    } else {
      blueLine[i] = blueLine[10] + 0.7 * (i - 10);
    }
    
    // Purple line: continued exponential growth
    purpleLine[i] = 2 * exp(0.08 * i);
  }
}

function draw() {
  // Draw background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Draw control area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Draw title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Predicted Rates of AI Improvement", canvasWidth/2, margin/2);
  
  // Chart area dimensions
  let chartLeft = margin * 2.5;
  let chartRight = canvasWidth - margin * 1.5;
  let chartTop = margin * 2;
  let chartBottom = drawHeight - margin * 2;
  let chartWidth = chartRight - chartLeft;
  let chartHeight = chartBottom - chartTop;
  
  // Draw axes
  stroke('black');
  strokeWeight(2);
  // X-axis
  line(chartLeft, chartBottom, chartRight, chartBottom);
  // Y-axis
  line(chartLeft, chartTop, chartLeft, chartBottom);
  
  // Draw axis labels
  fill('black');
  noStroke();
  textSize(defaultTextSize);
  
  // X-axis label
  textAlign(CENTER, TOP);
  text("Time", chartLeft + chartWidth / 2, chartBottom + 10);
  
  // Y-axis label (rotated)
  push();
  translate(chartLeft - 15, chartTop + chartHeight / 2);
  rotate(-PI/2);
  textAlign(CENTER, BOTTOM);
  text("AI Capability", 0, 0);
  pop();
  
  // Draw "Now" line
  let nowX = chartLeft + chartWidth / 2;
  stroke('brown');
  strokeWeight(2);
  line(nowX, chartTop + 50, nowX, chartBottom);
  
  // Draw "Now" label
  fill('brown');
  noStroke();
  textAlign(CENTER, BOTTOM);
  text("Now", nowX, chartTop + 40);
  
  // Calculate data ranges for scaling
  let maxLineValue = max([max(redLine), max(greenLine), max(blueLine), max(purpleLine)]);
  
  // Draw the lines based on checkbox state
  strokeWeight(2);
  noFill();
  
  // Red line
  if (redCheckbox.checked()) {
    stroke('red');
    beginShape();
    for (let i = 0; i < timePoints.length; i++) {
      let x = map(i, 0, timePoints.length - 1, chartLeft, chartRight);
      let y = map(redLine[i], 0, maxLineValue, chartBottom, chartTop);
      vertex(x, y);
    }
    endShape();
  }
  
  // Green line
  if (greenCheckbox.checked()) {
    stroke('green');
    beginShape();
    for (let i = 0; i < timePoints.length; i++) {
      let x = map(i, 0, timePoints.length - 1, chartLeft, chartRight);
      let y = map(greenLine[i], 0, maxLineValue, chartBottom, chartTop);
      vertex(x, y);
    }
    endShape();
  }
  
  // Blue line
  if (blueCheckbox.checked()) {
    stroke('blue');
    beginShape();
    for (let i = 0; i < timePoints.length; i++) {
      let x = map(i, 0, timePoints.length - 1, chartLeft, chartRight);
      let y = map(blueLine[i], 0, maxLineValue, chartBottom, chartTop);
      vertex(x, y);
    }
    endShape();
  }
  
  // Purple line
  if (purpleCheckbox.checked()) {
    stroke('purple');
    beginShape();
    for (let i = 0; i < timePoints.length; i++) {
      let x = map(i, 0, timePoints.length - 1, chartLeft, chartRight);
      let y = map(purpleLine[i], 0, maxLineValue, chartBottom, chartTop);
      vertex(x, y);
    }
    endShape();
  }
  
  // Draw legend
  let legendX = margin * 6;;
  let legendY = chartTop + 40;
  let legendSpacing = 20;
  
  fill('white');
  stroke('gray');
  strokeWeight(1);
  rect(legendX - 10, legendY - 15, 170, 100);
  
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  
  // Red legend
  fill('red');
  rect(legendX, legendY, 15, 15);
  fill('black');
  text("Peaking & Declining", legendX + 20, legendY);
  
  // Green legend
  fill('green');
  rect(legendX, legendY + legendSpacing, 15, 15);
  fill('black');
  text("Flattening", legendX + 20, legendY + legendSpacing);
  
  // Blue legend
  fill('blue');
  rect(legendX, legendY + legendSpacing * 2, 15, 15);
  fill('black');
  text("Slow Linear Growth", legendX + 20, legendY + legendSpacing * 2);
  
  // Purple legend
  fill('purple');
  rect(legendX, legendY + legendSpacing * 3, 15, 15);
  fill('black');
  text("Exponential Growth", legendX + 20, legendY + legendSpacing * 3);
}