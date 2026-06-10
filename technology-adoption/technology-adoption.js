// Technology Adoption Curve Infographic
// This script creates an interactive infographic visualizing the Technology Adoption Lifecycle Curve
// using p5.js. Hover over segments to see detailed descriptions of each section,
// and click a segment to visit its Wikipedia page.
// Dan McCreary - June 2025

// Canvas dimensions (initial values; they’ll be overridden in setup())
let canvasWidth = 500;
let drawHeight = 400;
let canvasHeight = drawHeight;

let margin = 25;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth;                
let containerHeight = canvasHeight; 

// Variables for the visualization
let currentHover = -1;
let adoptionGroups = [];

// Infobox properties
let infoBoxHeight = 80;

// You can now define bellBaseY with any formula you like.
// For instance:  drawHeight - infoBoxHeight - margin*2
// In setup() we’ll recompute it whenever the window is resized.
let bellBaseY;

// Bell curve data
let bellCurve = [];
let numPoints = 200;

// Slider for skewness (kept as before)
let skewnessSlider;
let skewness = 0; // Default is symmetric bell curve

function setup() {
  // Compute initial canvas size & bellBaseY
  updateCanvasSize();
  computeBellBaseY();

  // Create the canvas and attach it
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);
  textAlign(CENTER, CENTER);

  // Define the five adoption segments
  adoptionGroups = [
    {
      name: "Innovators",
      percentage: 2.5,
      color: "red",
      tcolor: "white",
      description:
        "Innovators (2.5%): Technology enthusiasts who are willing to take risks with new tech. They pursue new products aggressively and want to be first—even if there might be bugs.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Innovators",
    },
    {
      name: "Early Adopters",
      percentage: 13.5,
      color: "orange",
      tcolor: "black",
      description:
        "Early Adopters (13.5%): Visionaries who see potential benefits of new tech and adopt quickly to gain competitive advantage.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Early_adopters",
    },
    {
      name: "Early Majority",
      percentage: 34,
      color: "green",
      tcolor: "white",
      description:
        "Early Majority (34%): Pragmatists who wait for proven benefits before investing. They’re a large, important market segment.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Early_majority",
    },
    {
      name: "Late Majority",
      percentage: 34,
      color: "blue",
      tcolor: "white",
      description:
        "Late Majority (34%): Skeptics who adopt only when technology is established—often due to peer pressure or necessity.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Late_majority",
    },
    {
      name: "Laggards",
      percentage: 16,
      color: "purple",
      tcolor: "white",
      description:
        "Laggards (16%): Traditionalists who resist new tech until they have no other choice. Very price‐sensitive and ideologically opposed.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Laggards",
    },
  ];

  // Generate initial bell curve points.now and on window resize
  generateBellCurve();

  describe(
    "An interactive Technology Adoption Curve infographic showing the normal distribution of technology adoption. Hover over segments for descriptions, click to visit Wikipedia.",
    LABEL
  );
}

function draw() {
  
  // Step 1: Draw background for the bell‐curve area in light blue with a light gray border
  fill("aliceblue");
  stroke("silver");
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);


  // Step 2: Draw the title
  fill("black");
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Technology Adoption Lifecycle Curve", canvasWidth / 2, margin / 2);

  // 4) Draw the colored segments under the curve
  drawAdoptionCurve();

  // 5) Draw the infobox + hover‐description
  drawInfoBox();
}

function computeBellBaseY() {
  // Whenever the window or infoBoxHeight/ margin changes, recalc:
  // → Example: let bellBaseY = drawHeight - infoBoxHeight - margin*2
  bellBaseY = drawHeight - infoBoxHeight - margin * 2;

  // Then total canvas height must be at least drawHeight,
  // so containerHeight = drawHeight (no change here).
  containerHeight = drawHeight;
}

function generateBellCurve() {
  bellCurve = [];

  // Vertical amplitude of the bell (60% of drawHeight is okay)
  let maxHeight = drawHeight * 0.5;
  let xSpacing = (canvasWidth - 2 * margin) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    let x = margin + i * xSpacing;

    // Normalize i to range [-3, +3]
    let normalizedI = (i / numPoints) * 6 - 3;

    // Apply skew if any
    let skewedI = normalizedI + (skewness * normalizedI * normalizedI) / 5;

    // Gaussian formula
    let y = maxHeight * Math.exp((-skewedI * skewedI) / 2);

    // Now the bottom of the bell is at bellBaseY, so top is bellBaseY - y
    let yPos = bellBaseY - y;

    bellCurve.push({ x: x, y: yPos });
  }
}

function drawAdoptionCurve() {
  // The baseline for all segments = bellBaseY
  // add the height of the narrow Innovators
  let innovatorsHeight = 20;
  let bellBottomHeight = bellBaseY + innovatorsHeight;

  // Compute cumulative percentages (0, 2.5, 16, 50, 84, 100)
  let cumulativePercentages = [0];
  let sum = 0;
  for (let group of adoptionGroups) {
    sum += group.percentage;
    cumulativePercentages.push(sum);
  }

  // Draw and fill each of the 5 segments
  for (let i = 0; i < adoptionGroups.length; i++) {
    let startPct = cumulativePercentages[i];
    let endPct = cumulativePercentages[i + 1];

    // Which indices in bellCurve array correspond to these percentages?
    let startIdx = Math.floor((startPct / 100) * numPoints);
    let endIdx = Math.floor((endPct / 100) * numPoints);

    // Clamp to [0, numPoints-1]
    startIdx = constrain(startIdx, 0, numPoints - 1);
    endIdx = constrain(endIdx, 0, numPoints - 1);
    
    // hover logic
    // If hovered, draw a thick black stroke around that segment
    if (i === currentHover) {
      stroke("black");
      strokeWeight(6);
    } else {
      noStroke();
    }

    // Fill with that group's color
    fill(adoptionGroups[i].color);

    // Draw polygon: bottom-left → curve points → bottom-right
    beginShape();
      // bottom-left
      vertex(bellCurve[startIdx].x, bellBottomHeight);

      // top: walk along the curve
      for (let j = startIdx; j <= endIdx; j++) {
        vertex(bellCurve[j].x, bellCurve[j].y);
      }

      // bottom-right
      vertex(bellCurve[endIdx].x, bellBottomHeight);
    endShape(CLOSE);

    // Save for hover detection
    adoptionGroups[i].coords = {
      startX: bellCurve[startIdx].x,
      endX: bellCurve[endIdx].x,
    };
  }

  // Finally, draw the black outline of the full bell curve
  stroke("black");
  strokeWeight(2);
  noFill();
  beginShape();
    for (let pt of bellCurve) {
      vertex(pt.x, pt.y);
    }
  endShape();
}

// draw the inforBox on hover
function drawInfoBox() {
  // Infobox sits exactly at bellBaseY, height = infoBoxHeight
  let infoboxY = bellBaseY + margin + 10;

  // Draw the white background rectangle for infobox
  fill("white");
  noStroke();
  rect(margin, infoboxY, canvasWidth - 2 * margin, infoBoxHeight, 5);

  // If hovering over a segment, show its description inside
  if (currentHover !== -1) {
    fill("black");
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(
      adoptionGroups[currentHover].description,
      margin + 10,
      infoboxY + 10,
      canvasWidth - 2 * margin - 20,
      infoBoxHeight - 20
    );
  } else {
    // Default instruction text
    fill("#666666");
    noStroke();
    textSize(constrain(containerWidth * 0.025, 12, 15));
    textAlign(CENTER, CENTER);
    text(
      "Hover over segments to see descriptions, click to visit Wikipedia",
      canvasWidth / 2,
      infoboxY + infoBoxHeight / 2
    );
  }

  // Static segment labels need to be placed ABOVE the curve but below the title.
  // We choose Y = bellBaseY - some offset (so they "sit" on the curve).
  // Feel free to tweak `labelYOffset` if labels overlap:
  let labelYOffset = 20;

  // Innovators (leftmost 2.5%)
  textSize(14);
  fill("black");
  let invX = (adoptionGroups[0].coords.startX + adoptionGroups[0].coords.endX) / 2;
  text("Innovators\n2.5%", invX, bellBaseY - 20);

  // Early Adopters (next 13.5%)
  textSize(13);
  fill("black");
  let eaX = (adoptionGroups[1].coords.startX + adoptionGroups[1].coords.endX) / 2;
  text("Early\nAdopters\n13.5%", eaX, bellBaseY - 50);

  // Early Majority (center-left)
  textSize(20);
  fill("white");
  let emX = (adoptionGroups[2].coords.startX + adoptionGroups[2].coords.endX) / 2;
  text("Early Majority\n34%", emX, bellBaseY - labelYOffset);

  // Late Majority (center-right)
  fill("white");
  let lmX = (adoptionGroups[3].coords.startX + adoptionGroups[3].coords.endX) / 2;
  text("Late Majority\n34%", lmX, bellBaseY - labelYOffset);

  // Laggards (rightmost)
  textSize(20);
  fill("black");
  let lagX = (adoptionGroups[4].coords.startX + adoptionGroups[4].coords.endX) / 2;
  text("Laggards\n16%", lagX, bellBaseY - labelYOffset - 20);
}

function mouseMoved() {
  // If mouse is above the title or below the curve, no hover
  if (mouseY < margin || mouseY > bellBaseY + 20) {
    currentHover = -1;
    return;
  }

  // Otherwise check which segment’s X‐range contains mouseX
  for (let i = 0; i < adoptionGroups.length; i++) {
    let { startX, endX } = adoptionGroups[i].coords;
    if (mouseX >= startX && mouseX <= endX) {
      currentHover = i;
      return;
    }
  }
  currentHover = -1;
}

function mouseClicked() {
  // If click is inside drawHeight and over a valid segment → open URL
  if (currentHover !== -1 && mouseY < drawHeight) {
    window.open(adoptionGroups[currentHover].url, "_blank");
  }
}

function windowResized() {
  // When container resizes, recalc widths & bellBaseY
  updateCanvasSize();
  computeBellBaseY();
  resizeCanvas(containerWidth, containerHeight);
  generateBellCurve();
  redraw();
}

function updateCanvasSize() {
  // Match the <main> container’s width
  const container = document.querySelector("main").getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
