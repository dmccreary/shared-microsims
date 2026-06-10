let canvasWidth = 800;
let drawHeight = 400;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let topMargin = 50; // Extra space for title
let leftMargin = 40;
let centerMargin = 40;
let containerWidth;
let containerHeight = canvasHeight;

let swotRects = [];
let currentHover = -1;
let quadrantLabels = ["Strengths", "Weaknesses", "Opportunities", "Threats"];
let quadrantDescriptions = [
  "Strengths are the internal capabilities that give your AI strategy a competitive advantage—e.g., access to large datasets, experienced AI staff, or fast experimentation cycles.",
  "Weaknesses highlight internal challenges—such as lack of explainability, limited model robustness, or fragmented data infrastructure.",
  "Opportunities represent external trends your AI strategy can capitalize on—like advances in foundation models, regulatory support, or emerging markets needing AI capabilities.",
  "Threats are external risks—like public mistrust, fast-moving competitors, regulatory hurdles, or supply chain issues impacting compute availability."
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  setupLayout();
  describe('SWOT Diagram with four quadrants. Hover each for insights into AI Strategy Planning.', LABEL);
}

function setupLayout() {
  swotRects = [];
  // Calculate positions and sizes for the four quadrants
  let w = containerWidth / 2 - margin * 2;
  let h = (drawHeight - topMargin) / 2 - margin * 1.5;

  let positions = [
    [leftMargin, topMargin],
    [margin + w + centerMargin, topMargin],
    [leftMargin, topMargin + h + margin],
    [margin + w + centerMargin, topMargin + h + margin]
  ];

  let colors = ['#2196F3', '#FF9800', '#4CAF50', '#F44336']; // Blue, Orange, Green, Red

  for (let i = 0; i < 4; i++) {
    swotRects.push({
      x: positions[i][0],
      y: positions[i][1],
      w: w,
      h: h,
      label: quadrantLabels[i],
      description: quadrantDescriptions[i],
      color: colors[i]
    });
  }
}


function draw() {
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawLabels();
  drawQuadrants();
  drawDescription();
}

function drawTitle() {
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  text("SWOT Analysis for AI Strategy", canvasWidth / 2, 10);
}

function drawLabels() {
  push();
  textSize(16);
  fill(0);
  textAlign(CENTER, CENTER);

  // Shifted 20 pixels further right
  translate(25, topMargin + (drawHeight - topMargin) / 4);
  rotate(-HALF_PI);
  text("Current State", 20, 0);
  pop();

  push();
  textSize(16);
  fill(0);
  textAlign(CENTER, CENTER);

  translate(25, topMargin + (3 * (drawHeight - topMargin)) / 4);
  rotate(-HALF_PI);
  text("Future State", 20, 0);
  pop();
}


function drawQuadrants() {
  currentHover = -1;

  for (let i = 0; i < swotRects.length; i++) {
    let r = swotRects[i];
    let isHover = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;

    strokeWeight(isHover ? 4 : 1);
    stroke(isHover ? 'blue' : 'black');
    fill(r.color);
    rect(r.x, r.y, r.w, r.h);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(36);
    text(r.label, r.x + r.w / 2, r.y + r.h / 2);

    if (isHover) currentHover = i;
  }
}

function drawDescription() {
  let y = drawHeight + 15;
  let h = controlHeight - 20;

  fill(0);
  textAlign(LEFT, TOP);
  textSize(18);

  if (currentHover != -1) {
    text(swotRects[currentHover].description, margin, y, canvasWidth - 2 * margin, h);
  } else {
    fill(100);
    textAlign(CENTER, CENTER);
    text("Hover over each quadrant to explore strategic considerations.", canvasWidth / 2, y + h / 2);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  setupLayout();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
