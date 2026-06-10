// Technology Adoption Curve Infographic
// This script creates an interactive infographic visualizing the Technology Adoption Lifecycle Curve
// using p5.js. 
// It allows users to hover over segments to see a detailed descriptions of each
// section and allows them to click on a section to visit the Wikipedia page for that section.
// Dan McCreary - June 2025
// Canvas dimensions
let canvasWidth = 500;
let drawHeight = 400;
let canvasHeight = drawHeight;

let margin = 25;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Variables for the visualization
let currentHover = -1;
let adoptionGroups = [];

// Infobox properties
let infoBoxHeight = 80;

// Bell curve properties
let bellCurveY = containerHeight - infoBoxHeight;
let bellCurve = [];
let numPoints = 200;

// Slider for skewness
let skewnessSlider;
let skewness = 0; // Default is symmetric bell curve

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Define the adoption groups and their properties
  adoptionGroups = [
    {
      name: "Innovators",
      percentage: 2.5,
      color: "red",
      tcolor: "white",
      description: "Innovators (2.5%): These are technology enthusiasts who are willing to take risks with new technologies. They pursue new products aggressively and are intrigued by any new product release. They want to be the first to try new things, even if there might be bugs or issues.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Innovators"
    },
    {
      name: "Early Adopters",
      percentage: 13.5,
      color: "orange",
      tcolor: "black",
      description: "Early Adopters (13.5%): These are visionaries who understand and appreciate the benefits of new technology and relate potential benefits to their own needs. They're quick to adopt new technologies that they believe will provide them with a competitive advantage.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Early_adopters"
    },
    {
      name: "Early Majority",
      percentage: 34,
      color: "green",
      tcolor: "white",
      description: "Early Majority (34%): These are pragmatists who adopt new technology when they see proven benefits but avoid risks. They tend to be practical and want to see how the technology works for others before investing. They're an important group as they represent a large segment of the market.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Early_majority"
    },
    {
      name: "Late Majority",
      percentage: 34,
      color: "blue",
      tcolor: "white",
      description: "Late Majority (34%): These are conservatives who are skeptical of new technology and will only adopt it after it has become an established standard. They're often driven by economic necessity or peer pressure rather than a desire for improvement or competitive advantage.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Late_majority"
    },
    {
      name: "Laggards",
      percentage: 16,
      color: "purple",
      tcolor: "white",
      description: "Laggards (16%): These are traditionalists who are very suspicious of new technology and will only adopt it when they have no other choice. They tend to be very price-sensitive and may have strong ideological resistance to innovation.",
      url: "https://en.wikipedia.org/wiki/Technology_adoption_life_cycle#Laggards"
    }
  ];
  
  // Generate initial bell curve points
  generateBellCurve();
  
  describe('An interactive Technology Adoption Curve infographic showing the normal distribution of technology adoption across population segments. Hover over segments to see descriptions, click to visit Wikipedia.', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // Generate bell curve with current skewness
  generateBellCurve();
  
  // Draw the title
  fill('black');
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP);
  text("Technology Adoption Lifecycle Curve", canvasWidth/2, margin/2);
  
  // Draw bell curve and fill segments
  drawAdoptionCurve();
  
  // Draw segment labels
  // This was our attempt to automate the placement of labels on the curve
  // It failed to be precise enough
  // drawSegmentLabels();
  
  // Draw description
  drawDescriptionManualPlacement()
}

function generateBellCurve() {
  // Generate bell curve points with adjustable skewness
  bellCurve = [];
  
  let maxHeight = drawHeight * 0.6;
  let xSpacing = (canvasWidth - 2 * margin) / numPoints;
  
  for (let i = 0; i < numPoints; i++) {
    let x = margin + i * xSpacing;
    
    // Normalize i to be between -3 and 3 for the bell curve
    let normalizedI = (i / numPoints) * 6 - 3;
    
    // Apply skewness
    let skewedI = normalizedI + skewness * normalizedI * normalizedI / 5;
    
    // Bell curve formula
    let y = maxHeight * Math.exp(-skewedI * skewedI / 2);
    
    // Y position from top - invert because p5.js has 0,0 at top-left
    let yPos = drawHeight - margin - y - 60;
    
    bellCurve.push({ x: x, y: yPos });
  }
}

// draw the curve
function drawAdoptionCurve() {
  
  // Horizontal line hight for the bottom of curve
  bellBottomHeight = drawHeight - infoBoxHeight - margin + 98;
  // Calculate segment boundaries based on cumulative percentages
  let cumulativePercentages = [0];
  let sum = 0;
  for (let group of adoptionGroups) {
    sum += group.percentage;
    cumulativePercentages.push(sum);
  }
  
  // Draw and fill segments
  for (let i = 0; i < adoptionGroups.length; i++) {
    let startPercent = cumulativePercentages[i];
    let endPercent = cumulativePercentages[i + 1];
    
    // Calculate start and end indices in the bellCurve array
    let startIndex = Math.floor((startPercent / 100) * numPoints);
    let endIndex = Math.floor((endPercent / 100) * numPoints);
    
    // Ensure indices are within bounds
    startIndex = Math.max(0, Math.min(startIndex, numPoints - 1));
    endIndex = Math.max(0, Math.min(endIndex, numPoints - 1));
    
    // Segment is hovered - highlight it
    if (i === currentHover) {
      stroke('black');
      strokeWeight(2);
    } else {
      noStroke();
    }
    
    // Fill the segment with its color
    fill(adoptionGroups[i].color);
    
    // Draw the segment as a polygon
    beginShape();
    // Bottom left corner
    vertex(bellCurve[startIndex].x, bellBottomHeight);
    
    // Top curve points
    for (let j = startIndex; j <= endIndex; j++) {
      vertex(bellCurve[j].x, bellCurve[j].y);
    }
    
    // Bottom right corner
    vertex(bellCurve[endIndex].x, bellBottomHeight);
    
    endShape(CLOSE);
    
    // Store segment coordinates for hover detection
    adoptionGroups[i].coords = {
      startX: bellCurve[startIndex].x,
      endX: bellCurve[endIndex].x
    };
  }
  
  // Draw the curve outline
  stroke('black');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let point of bellCurve) {
    vertex(point.x, point.y);
  }
  endShape();
}

function drawDescriptionManualPlacement() {
  // this needs to take into account the infoBoxHeight
  let descriptionY = drawHeight - margin * 2.5 - infoBoxHeight + 110;
  // get this from the global parameter
  let descriptionHeight = infoBoxHeight;
  
  // Use Manual Placement of the labels within each region
  // This is a very precise process and it is hard to get right
  
  noStroke();
  textAlign(CENTER, CENTER);
  
  // Place the Innovators label above the curve
  // because there is no room inside the region to draw it
  textSize(14);
  fill("black");
  text('Innovators\n2.5%', canvasWidth*.047, descriptionY - 30);
  // draw a line to the center of the region
  stroke('black');
  strokeWeight(2);
  xOffset = margin + canvasWidth*.01
  yOffset = descriptionY;
  line(xOffset, descriptionY - 10, xOffset, descriptionY - 30)
  
  // Place the Early Adopters inside the area.  It just barly fits
  textSize(13);
  noStroke();
  fill("black");
  xOffset = margin + canvasWidth*.088
  text('Early Adopters\n13.5%', xOffset, descriptionY - 30);
  
  
  // these two labels are placed placed at the center of the bell curve regions
  // they have the same font size and fill
  textSize(20);
  fill("white");
  xOffset = margin + canvasWidth*.34
  text('Early Majority\n34%', xOffset, descriptionY - 20);
  xOffset = margin + canvasWidth*.6
  text('Late Majority\n34%', xOffset, descriptionY - 20);
  
  // Laggards
  fill('gray');
  textSize(15);
  text('Laggards\n16%', canvasWidth*.87, descriptionY - 20);
  
  // Draw the background for thedescription box
  fill('white');
  rect(margin, descriptionY, canvasWidth - 2 * margin, descriptionHeight, 5);
    
  // Display description for hovered segment
  if (currentHover !== -1) {
    fill('black');
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    
    
    fill(0);
     text(adoptionGroups[currentHover].description, margin + 10, descriptionY + 10, 
          canvasWidth - 2 * margin - 20, descriptionHeight - 20);
  } else {
    // Display instruction when no segment is hovered
    fill('#666666');
    noStroke();
    textSize(constrain(containerWidth * 0.025, 12, 15));
    textAlign(CENTER, CENTER);
    text("Hover over segments to see descriptions, click to visit Wikipedia", 
         canvasWidth / 2, descriptionY + descriptionHeight / 2);
  }
}

function mouseMoved() {
  // Check if mouse is within the drawing area (bell curve region)
  if (mouseY > drawHeight - margin || mouseY < margin) {
    currentHover = -1;
    return;
  }
  
  // Find which segment the mouse is over
  for (let i = 0; i < adoptionGroups.length; i++) {
    if (mouseX >= adoptionGroups[i].coords.startX && 
        mouseX <= adoptionGroups[i].coords.endX) {
      currentHover = i;
      return;
    }
  }
  
  currentHover = -1;
}

function mouseClicked() {
  // Check if a segment is clicked and open its URL
  if (currentHover !== -1 && mouseY < drawHeight) {
    window.open(adoptionGroups[currentHover].url, '_blank');
  }
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  
  // Regenerate bell curve with new dimensions
  generateBellCurve();
  
  redraw();
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
}