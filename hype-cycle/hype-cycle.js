// Technology Hype Cycle Infographic (labels adjusted to correct points)
// Uses p5.js and follows standard MicroSim rules guidelines
// Dan McCreary, 2025

let canvasWidth;
let drawHeight = 400;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 40; // top margin for title and labels

const regionNames = [
  "Technology\nTrigger",
  "Rising\nExpectations",
  "Peak of Inflated\nExpectations",
  "Trough of\nDisillusionment",
  "Slope of\nEnlightenment",
  "Plateau of\nProductivity"
];

const regionDescriptions = [
  "Technology Trigger: A breakthrough or proof of concept generates press and media interest, but no usable products exist yet.",
  "Rising Expectations: Early publicity produces increased expectations that the new technologies will save money and differentiate solutions.",
  "Peak of Inflated Expectations: Early publicity produces success stories—often accompanied by failures. A frenzy of hype builds.",
  "Trough of Disillusionment: Interest wanes as experiments and implementations fail to deliver. Producers of the technology shake out or fail.",
  "Slope of Enlightenment: More instances of how the technology can benefit enterprises start to crystallize and become more widely understood. Second- and third-generation products appear.",
  "Plateau of Productivity: Mainstream adoption starts to take off. Criteria for assessing provider viability are more clearly defined."
];

let regions = [];
let currentHover = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  initRegions();
  // Accessible description for screen readers
  describe(
    'Technology Hype Cycle infographic with five interactive regions. Hover over each region to see its description.',
    LABEL
  );
}

function draw() {
  // Drawing area background (aliceblue) with 1px silver border
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Controls area (white background, silver border)
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);

  drawTitle();
  drawCurve();
  drawRegionLabels();
  drawDashedDividers();
  drawRegionsHighlight();
  drawDescription();
}

function drawTitle() {
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  // Title centered at the top of the drawing area
  text("Technology Hype Cycle", canvasWidth / 2, margin / 2);
}

function drawCurve() {
  stroke(0);
  strokeWeight(2);
  noFill();

  let yOffset = drawHeight;

  // Key points for the Hype Cycle curve
  let p0 = { x: margin/2,               y: drawHeight - margin/2 };// trigger
  let p1 = { x: canvasWidth * 0.20,     y: margin * 2 + 20   };    // rising expectations
  let p2 = { x: canvasWidth * 0.40,     y: yOffset - 20      };    // peak
  let p3 = { x: canvasWidth * 0.60,     y: drawHeight * 0.50 };    // trough
  let p4 = { x: canvasWidth - margin/2, y: drawHeight * 0.30 };    // slope

  // Smooth curve through all five points
  beginShape();
    curveVertex(p0.x, p0.y);
    curveVertex(p0.x, p0.y);
    curveVertex(p1.x, p1.y);
    curveVertex(p2.x, p2.y);
    curveVertex(p3.x, p3.y);
    curveVertex(p4.x, p4.y);
    curveVertex(p4.x, p4.y);
  endShape();
}

function drawRegionLabels() {
  // Recompute the key points used in drawCurve
  let yOffset = drawHeight;
  let p0 = { x: canvasWidth * 0.13,   y: drawHeight        };    // trigger
  let p1 = { x: canvasWidth * 0.06,   y: drawHeight/2+20   };    // rising expectations
  let p2 = { x: canvasWidth * 0.20,   y: drawHeight * 0.25 };    // peak
  
  let p3 = { x: canvasWidth * 0.415,  y: drawHeight * 0.79 };    // trough
  
  let p4 = { x: canvasWidth * 0.65,    y: drawHeight * 0.40 };    // slope
  let p5 = { x: canvasWidth * 0.9,    y: drawHeight * 0.30 };    // plateau

  // Compute midpoint between p3 and p4 for "Slope of Enlightenment"
  let mid34 = {
    x: (p3.x + p4.x) / 2,
    y: (p3.y + p4.y) / 2
  };

  // Assign label positions for each region:
  // Region 0: p0 (Technology Trigger)
  // Region 1: p1 (Technology Trigger)
  // Region 2: p2 (Peak of Inflated Expectations)
  // Region 3: p3 (Trough of Disillusionment)
  // Region 4: mid34 (Slope of Enlightenment)
  // Region 5: p4 (Plateau of Productivity)
  let labelPoints = [
    p0,
    p1,
    p2,
    p3,
    p4,
    p5
  ];

  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, BOTTOM);

  for (let i = 0; i < regionNames.length; i++) {
    let pt = labelPoints[i];
    // Offset label slightly upward so it does not overlap the curve
    let labelX = pt.x;
    let labelY = pt.y - 10;
    text(regionNames[i], labelX, labelY);
  }
}

function drawDashedDividers() {
  // Use the underlying canvas 2D context to apply a dashed line pattern
  stroke('silver');
  strokeWeight(1);
  drawingContext.setLineDash([5, 5]); // 5px dash, 5px gap

  // Draw vertical lines at each region boundary (except the far left and far right edges)
  for (let i = 1; i < regions.length; i++) {
    let x = regions[i].xStart;
    line(x, 0, x, drawHeight);
  }

  // Reset to solid lines for subsequent drawing
  drawingContext.setLineDash([]);
}

function drawRegionsHighlight() {
  checkHover();

  if (currentHover >= 0) {
    let r = regions[currentHover];
    noStroke();
    fill(200, 200, 255, 70);
    rect(r.xStart, 0, r.xEnd - r.xStart, drawHeight);
  }
}

function drawDescription() {
  let descY = drawHeight + 10;
  let descHeight = controlHeight - 20;

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);

  if (currentHover >= 0) {
    let desc = regions[currentHover].description;
    // Wrap text within horizontal margins
    let textX = margin / 2;
    let textW = canvasWidth - margin;
    text(desc, textX, descY, textW, descHeight);
  } else {
    fill(100);
    textAlign(CENTER, CENTER);
    text(
      "Hover over a region of the curve to see its description",
      canvasWidth / 2,
      descY + descHeight / 2
    );
  }
}

function checkHover() {
  currentHover = -1;
  if (mouseY >= 0 && mouseY <= drawHeight) {
    for (let i = 0; i < regions.length; i++) {
      let r = regions[i];
      if (mouseX >= r.xStart && mouseX < r.xEnd) {
        currentHover = i;
        break;
      }
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  initRegions();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}

// create an array of regions of the infographic
function initRegions() {
  regions = [];
  let usableWidth = canvasWidth - margin/2;
  let regionWidth = usableWidth / 6;
  
  v1 = canvasWidth * .055;
  regions.push({xStart: 0,   xEnd:v1,  name:"trigger", description: regionDescriptions[0]});
  
  v2 = canvasWidth * .14;
  regions.push({xStart: v1+1,  xEnd:v2,  name:"rise",    description: regionDescriptions[1]});
  
  v3 = canvasWidth * .25;
  regions.push({xStart: v2+1,  xEnd:v3, name:"peak",    description: regionDescriptions[2]});
  
  v4 = canvasWidth * .55;
  regions.push({xStart: v3+1, xEnd:v4, name:"trough",    description: regionDescriptions[3]});
  
  v5 = canvasWidth * .75;
  regions.push({xStart: v4+1, xEnd:v5, name:"slope",    description: regionDescriptions[4]});
  regions.push({xStart: v5+1, xEnd:canvasWidth-20, name:"plateu",    description: regionDescriptions[5]});

}
// End of sketch.js
