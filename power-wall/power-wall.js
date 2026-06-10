// CPU Clock Speed Visualization: "The Power Wall"
// This code can be pasted directly into the p5.js editor

// Canvas dimensions
let canvasWidth = 800;
let canvasHeight = 600;
let margin = 60;
let plotWidth = canvasWidth - 3 * margin;
let plotHeight = canvasHeight - 2 * margin;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize

// UI controls
let scaleToggleButton;
let isLogScale = false; // Default to linear scale for clock speeds
let hoverInfo = null;
let pointRadius = 3; // Radius of data points

// Comprehensive dataset of CPU clock speeds from 1965 to 2025
const cpuData = [
  { year: 1965, name: "IBM System/360 Model 75", clockSpeed: 1, manufacturer: "IBM", architecture: "System/360", process: "SLT", watts: 13, description: "One of the first systems with a clock generator, 1 MHz" },
  { year: 1967, name: "PDP-8/I", clockSpeed: 1.5, manufacturer: "DEC", architecture: "PDP-8", process: "TTL", watts: 15, description: "1.5 MHz clock speed, successor to the original PDP-8" },
  { year: 1970, name: "Intel 4004", clockSpeed: 0.74, manufacturer: "Intel", architecture: "4-bit", process: "10000nm", watts: 1, description: "First commercially available microprocessor, 740 kHz" },
  { year: 1972, name: "Intel 8008", clockSpeed: 0.8, manufacturer: "Intel", architecture: "8-bit", process: "10000nm", watts: 1, description: "800 kHz, early 8-bit CPU" },
  { year: 1974, name: "Intel 8080", clockSpeed: 2, manufacturer: "Intel", architecture: "8-bit", process: "6000nm", watts: 3.5, description: "2 MHz, influential in early personal computers" },
  { year: 1975, name: "MOS 6502", clockSpeed: 1, manufacturer: "MOS Technology", architecture: "8-bit", process: "8000nm", watts: 2, description: "1 MHz, powered Apple II, Commodore 64, and early Nintendo" },
  { year: 1977, name: "Zilog Z80", clockSpeed: 2.5, manufacturer: "Zilog", architecture: "8-bit", process: "4000nm", watts: 1.5, description: "2.5 MHz, popular 8-bit CPU used in many early computers" },
  { year: 1978, name: "Intel 8086", clockSpeed: 5, manufacturer: "Intel", architecture: "x86 16-bit", process: "3000nm", watts: 5, description: "5 MHz, first x86 processor" },
  { year: 1979, name: "Motorola 68000", clockSpeed: 8, manufacturer: "Motorola", architecture: "32/16-bit", process: "3500nm", watts: 7, description: "8 MHz, powered early Macintosh computers" },
  { year: 1982, name: "Intel 80286", clockSpeed: 6, manufacturer: "Intel", architecture: "x86 16-bit", process: "1500nm", watts: 5, description: "6 MHz initial version, later models increased to 12.5 MHz" },
  { year: 1985, name: "Intel 80386", clockSpeed: 16, manufacturer: "Intel", architecture: "x86 32-bit", process: "1500nm", watts: 8, description: "16 MHz, first 32-bit x86 processor" },
  { year: 1989, name: "Intel 80486", clockSpeed: 25, manufacturer: "Intel", architecture: "x86 32-bit", process: "1000nm", watts: 12, description: "25 MHz, first with integrated FPU" },
  { year: 1993, name: "Intel Pentium", clockSpeed: 60, manufacturer: "Intel", architecture: "x86 32-bit", process: "800nm", watts: 16, description: "60 MHz initial version, 66 MHz common" },
  { year: 1995, name: "Intel Pentium Pro", clockSpeed: 200, manufacturer: "Intel", architecture: "x86 32-bit", process: "500nm", watts: 35, description: "200 MHz, introduced out-of-order execution" },
  { year: 1997, name: "Intel Pentium II", clockSpeed: 300, manufacturer: "Intel", architecture: "x86 32-bit", process: "350nm", watts: 43, description: "300 MHz, included MMX technology" },
  { year: 1999, name: "Intel Pentium III", clockSpeed: 600, manufacturer: "Intel", architecture: "x86 32-bit", process: "250nm", watts: 34, description: "600 MHz Katmai core, SSE instructions" },
  { year: 2000, name: "Intel Pentium 4", clockSpeed: 1500, manufacturer: "Intel", architecture: "x86 32-bit", process: "180nm", watts: 55, description: "1.5 GHz, NetBurst microarchitecture" },
  { year: 2001, name: "Intel Pentium 4 Willamette", clockSpeed: 2000, manufacturer: "Intel", architecture: "x86 32-bit", process: "180nm", watts: 75, description: "2.0 GHz, showed early signs of power scaling issues" },
  { year: 2002, name: "Intel Pentium 4 Northwood", clockSpeed: 2800, manufacturer: "Intel", architecture: "x86 32-bit", process: "130nm", watts: 68, description: "2.8 GHz, smaller process helped power efficiency" },
  { year: 2003, name: "AMD Athlon 64 FX-51", clockSpeed: 2200, manufacturer: "AMD", architecture: "x86-64", process: "130nm", watts: 89, description: "2.2 GHz, first 64-bit consumer CPU" },
  { year: 2004, name: "Intel Pentium 4 Prescott", clockSpeed: 3400, manufacturer: "Intel", architecture: "x86 32-bit", process: "90nm", watts: 103, description: "3.4 GHz, peak of single-core clock speeds, severe heat issues" },
  { year: 2005, name: "Intel Pentium D 840", clockSpeed: 3200, manufacturer: "Intel", architecture: "x86-64", process: "90nm", watts: 130, description: "3.2 GHz, dual-core but power problems limited speeds" },
  { year: 2006, name: "Intel Core 2 Extreme X6800", clockSpeed: 2930, manufacturer: "Intel", architecture: "x86-64", process: "65nm", watts: 75, description: "2.93 GHz, moved away from Pentium 4's power-hungry approach" },
  { year: 2007, name: "Intel Core 2 Extreme QX6850", clockSpeed: 3000, manufacturer: "Intel", architecture: "x86-64", process: "65nm", watts: 130, description: "3.0 GHz, quad-core CPU, power wall evident" },
  { year: 2008, name: "Intel Core i7-965", clockSpeed: 3200, manufacturer: "Intel", architecture: "x86-64", process: "45nm", watts: 130, description: "3.2 GHz, Nehalem architecture with HyperThreading" },
  { year: 2009, name: "AMD Phenom II X4 965", clockSpeed: 3400, manufacturer: "AMD", architecture: "x86-64", process: "45nm", watts: 125, description: "3.4 GHz, Black Edition with unlocked multiplier" },
  { year: 2010, name: "Intel Core i7-980X", clockSpeed: 3330, manufacturer: "Intel", architecture: "x86-64", process: "32nm", watts: 130, description: "3.33 GHz, 6-core Gulftown, focus on cores not clocks" },
  { year: 2011, name: "AMD FX-8150", clockSpeed: 3600, manufacturer: "AMD", architecture: "x86-64", process: "32nm", watts: 125, description: "3.6 GHz, Bulldozer architecture, high clocks but thermal issues" },
  { year: 2012, name: "Intel Core i7-3770K", clockSpeed: 3500, manufacturer: "Intel", architecture: "x86-64", process: "22nm", watts: 77, description: "3.5 GHz, Ivy Bridge, first 3D tri-gate transistors" },
  { year: 2013, name: "Intel Core i7-4770K", clockSpeed: 3500, manufacturer: "Intel", architecture: "x86-64", process: "22nm", watts: 84, description: "3.5 GHz, Haswell architecture, focus on efficiency" },
  { year: 2014, name: "Intel Core i7-5960X", clockSpeed: 3000, manufacturer: "Intel", architecture: "x86-64", process: "22nm", watts: 140, description: "3.0 GHz base, 8-core HEDT processor, prioritized cores over clocks" },
  { year: 2015, name: "Intel Core i7-6700K", clockSpeed: 4000, manufacturer: "Intel", architecture: "x86-64", process: "14nm", watts: 91, description: "4.0 GHz, Skylake architecture, clock speeds rising with process improvement" },
  { year: 2016, name: "Intel Core i7-7700K", clockSpeed: 4200, manufacturer: "Intel", architecture: "x86-64", process: "14nm+", watts: 91, description: "4.2 GHz, Kaby Lake, higher clocks through refined process" },
  { year: 2017, name: "Intel Core i7-8700K", clockSpeed: 3700, manufacturer: "Intel", architecture: "x86-64", process: "14nm++", watts: 95, description: "3.7 GHz base, 6-core, added cores at cost of base clocks" },
  { year: 2018, name: "Intel Core i9-9900K", clockSpeed: 3600, manufacturer: "Intel", architecture: "x86-64", process: "14nm++", watts: 95, description: "3.6 GHz base, 8-core, increasing cores while maintaining high boost" },
  { year: 2019, name: "AMD Ryzen 9 3950X", clockSpeed: 3500, manufacturer: "AMD", architecture: "x86-64", process: "7nm", watts: 105, description: "3.5 GHz base, 16-core, efficiency improvements enabling more cores" },
  { year: 2020, name: "Intel Core i9-10900K", clockSpeed: 3700, manufacturer: "Intel", architecture: "x86-64", process: "14nm+++", watts: 125, description: "3.7 GHz base, 5.3 GHz boost, pushing thermal limits" },
  { year: 2021, name: "AMD Ryzen 9 5950X", clockSpeed: 3400, manufacturer: "AMD", architecture: "x86-64", process: "7nm", watts: 105, description: "3.4 GHz base, 16-core, focusing on IPC over raw clock speed" },
  { year: 2022, name: "Intel Core i9-12900K", clockSpeed: 3200, manufacturer: "Intel", architecture: "x86-64", process: "10nm (Intel 7)", watts: 125, description: "3.2 GHz P-core base, hybrid architecture with efficiency cores" },
  { year: 2023, name: "AMD Ryzen 9 7950X", clockSpeed: 4500, manufacturer: "AMD", architecture: "x86-64", process: "5nm", watts: 170, description: "4.5 GHz base, higher thermal envelope enabling higher clocks" },
  { year: 2024, name: "Intel Core Ultra 9 285K", clockSpeed: 4400, manufacturer: "Intel", architecture: "x86-64", process: "Intel 4", watts: 150, description: "4.4 GHz base on P-cores, increased efficiency from new node" },
  { year: 2025, name: "AMD Ryzen 9 8950X", clockSpeed: 4800, manufacturer: "AMD", architecture: "x86-64", process: "3nm", watts: 170, description: "4.8 GHz base, improved efficiency from advanced node technology" }
];

// Initialize canvas
function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textAlign(CENTER, CENTER);
  
  // Create toggle button
  scaleToggleButton = createButton('Switch to Log Scale');
  scaleToggleButton.position(canvasWidth/2 - 80, 20);
  scaleToggleButton.mousePressed(toggleScale);
  
  // Add accessibility description
  describe('An interactive visualization of "The Power Wall" showing the evolution of CPU clock speeds from 1965 to 2025.', LABEL);
}

// Update canvas size based on container size
function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);  // Avoid fractional pixels
  canvasWidth = containerWidth;
  
  // Update the plot width with the new canvas width
  plotWidth = canvasWidth - 2 * margin;
}

// Main draw function
function draw() {
  background('aliceblue');
  
  // Draw title and description
  fill(0);
  textSize(22);
  textAlign(CENTER, TOP);
  text("The Power Wall: CPU Clock Speeds (1965-2025)", canvasWidth/2, 50);
  
  textSize(14);
  textAlign(CENTER, TOP);
  text("Visualization of how CPU clock speeds hit thermal and power constraints after 2004", canvasWidth/2, 80);
  
  // for moving chart and axis
  push();
    translate(40,0);
    // Draw axes
    drawAxes();

    // Plot data points
    plotDataPoints();

    // Draw hover information if applicable
    if (hoverInfo) {
      drawHoverInfo();
    }
  pop();
  
  // Draw annotations
  drawAnnotations();
  
  // Draw info text at the bottom
  // drawInfoText();
}

// Draw x and y axes
function drawAxes() {
  stroke(0);
  strokeWeight(1);
  
  // X-axis
  line(margin, canvasHeight - margin, canvasWidth - margin, canvasHeight - margin);
  
  // Y-axis
  line(margin, canvasHeight - margin, margin, margin);
  
  // Draw x-axis ticks and labels
  textAlign(CENTER, TOP);
  textSize(12);
  fill(0);
  noStroke();
  for (let year = 1965; year <= 2025; year += 10) {
    let x = map(year, 1965, 2025, margin, canvasWidth - margin);
    stroke(0);
    line(x, canvasHeight - margin, x, canvasHeight - margin + 5);
    noStroke();
    text(year, x, canvasHeight - margin + 10);
  }
  
  // X-axis label
  textAlign(CENTER, TOP);
  textSize(14);
  text("Year", canvasWidth/2, canvasHeight - 20);
  
  // Draw y-axis ticks and labels
  textAlign(RIGHT, CENTER);
  textSize(12);
  
  if (isLogScale) {
    // Log scale ticks (powers of 10 for MHz)
    for (let i = 0; i <= 4; i++) {  // From 10^0 (1 MHz) to 10^4 (10,000 MHz)
      let y = map(i, 0, 4, canvasHeight - margin, margin);
      stroke(220);
      strokeWeight(0.5);
      line(margin, y, canvasWidth - margin, y); // Grid line
      stroke(0);
      strokeWeight(1);
      line(margin - 5, y, margin, y); // Tick
      noStroke();
      text("10^" + i + " MHz", margin - 10, y);
    }
    
    // Y-axis label
    push();
       translate(20, canvasHeight/2);
       rotate(-PI/2);
       textAlign(CENTER, BOTTOM);
       textSize(14);
       text("Clock Speed (MHz, Log Scale)", 0, -30);
    pop();
  } else {
    // Linear scale ticks
    let maxClockSpeed = 5000; // 5000 MHz (5 GHz) max
    let tickStep = 1000; // 1000 MHz per tick
    
    for (let i = 0; i <= 5; i++) {
      let value = i * tickStep;
      let y = map(value, 0, maxClockSpeed, canvasHeight - margin, margin);
      stroke(220);
      strokeWeight(0.5);
      line(margin, y, canvasWidth - margin, y); // Grid line
      stroke(0);
      strokeWeight(1);
      line(margin - 5, y, margin, y); // Tick
      noStroke();
      text(value + " MHz", margin - 10, y);
    }
    
    // Y-axis label
    push();
       translate(20, canvasHeight/2);
       rotate(-PI/2);
       textAlign(CENTER, BOTTOM);
       textSize(14);
       text("Clock Speed (MHz)", 0, -30);
    pop();
  }
}

// Plot data points and trend lines
function plotDataPoints() {
  // Draw data points
  for (let i = 0; i < cpuData.length; i++) {
    let cpu = cpuData[i];
    let pos = getPlotPosition(cpu.year, cpu.clockSpeed);
    
    // Check if mouse is hovering over the point
    // Add 40 because we shifted chart
    if (dist(mouseX, mouseY, pos.x+40, pos.y) < 10) {
      hoverInfo = {
        cpu: cpu,
        x: pos.x,
        y: pos.y
      };
      fill(255, 0, 0); // Red for hovered point
      stroke(150);
      circle(pos.x, pos.y, pointRadius * 4);
    } else {
      // Color points by manufacturer
      if (cpu.manufacturer === "Intel") {
        fill(0, 113, 197); // Intel blue
      } else if (cpu.manufacturer === "AMD") {
        fill(237, 28, 36); // AMD red
      } else {
        fill(80, 80, 80); // Gray for others
      }
      
      noStroke();
      circle(pos.x, pos.y, pointRadius * 3);
    }
  }
  
  // Connect the points with a line to show the trend
  stroke(100, 100, 100, 150); // Semi-transparent gray
  strokeWeight(1.5);
  noFill();
  beginShape();
  for (let i = 0; i < cpuData.length; i++) {
    let cpu = cpuData[i];
    let pos = getPlotPosition(cpu.year, cpu.clockSpeed);
    vertex(pos.x, pos.y);
  }
  endShape();
}

// Draw annotations highlighting key points in CPU clock speed history
function drawAnnotations() {
  // Find specific points to annotate
  let powerWallPoint = null;
  let multiCoreStart = null;
  let modernResurgence = null;
  
  for (let i = 0; i < cpuData.length; i++) {
    if (cpuData[i].year === 2004 && cpuData[i].name.includes("Prescott")) {
      powerWallPoint = cpuData[i];
    }
    if (cpuData[i].year === 2006 && cpuData[i].name.includes("Core 2")) {
      multiCoreStart = cpuData[i];
    }
    if (cpuData[i].year === 2023 && cpuData[i].name.includes("7950X")) {
      modernResurgence = cpuData[i];
    }
  }
  
  // Draw annotation for the "Power Wall" around 2004
  if (powerWallPoint) {
    let pos = getPlotPosition(powerWallPoint.year, powerWallPoint.clockSpeed);
    
    // Draw line and box
    stroke(200, 0, 0);
    strokeWeight(1);
    line(pos.x, pos.y - 10, pos.x, pos.y - 60);
    
    // Draw annotation text
    fill(200, 0, 0);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text("Power Wall: 3.4 GHz", pos.x, pos.y - 65);
    textSize(10);
    text("Thermal issues limited", pos.x, pos.y - 80);
    text("further clock increases", pos.x, pos.y - 95);
  }
  
  // Draw annotation for the multi-core transition
  if (multiCoreStart) {
    let pos = getPlotPosition(multiCoreStart.year, multiCoreStart.clockSpeed);
    
    // Draw line and box
    stroke(0, 100, 200);
    strokeWeight(1);
    line(pos.x, pos.y - 10, pos.x, pos.y - 60);
    
    // Draw annotation text
    fill(0, 100, 200);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text("Multi-core Era Begins", pos.x, pos.y - 65);
    textSize(10);
    text("Focus shifts to more cores", pos.x, pos.y - 80);
    text("rather than higher clocks", pos.x, pos.y - 95);
  }
  
  // Draw annotation for modern clock speeds
  if (modernResurgence) {
    let pos = getPlotPosition(modernResurgence.year, modernResurgence.clockSpeed);
    
    // Draw line and box
    stroke(0, 150, 0);
    strokeWeight(1);
    line(pos.x, pos.y - 10, pos.x, pos.y - 60);
    
    // Draw annotation text
    fill(0, 150, 0);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text("Advanced Process Nodes", pos.x, pos.y - 65);
    textSize(10);
    text("New fabrication techniques", pos.x, pos.y - 80);
    text("enable higher clocks again", pos.x, pos.y - 95);
  }
}

// Get plotting position for a data point
function getPlotPosition(year, clockSpeed) {
  let x = map(year, 1965, 2025, margin, canvasWidth - margin);
  let y;
  
  if (isLogScale) {
    // Log scale: map log10 of clock speed
    let logValue = Math.max(0, Math.log10(clockSpeed)); // Ensure non-negative log value
    y = map(logValue, 0, 4, canvasHeight - margin, margin);
  } else {
    // Linear scale
    y = map(clockSpeed, 0, 5000, canvasHeight - margin, margin);
  }
  
  return { x, y };
}

// Draw hover info box
function drawHoverInfo() {
  let cpu = hoverInfo.cpu;
  let boxWidth = 280;
  let boxHeight = 150;
  let boxX = hoverInfo.x + 15;
  let boxY = hoverInfo.y - 15;
  
  // Make sure box stays within canvas
  if (boxX + boxWidth > canvasWidth) {
    boxX = hoverInfo.x - boxWidth - 15;
  }
  
  if (boxY + boxHeight > canvasHeight - 20) {
    boxY = canvasHeight - boxHeight - 20;
  }
  
  if (boxY < 110) {
    boxY = 110;
  }
  
  // Draw info box
  fill(255, 255, 245);
  stroke(100);
  strokeWeight(1);
  rect(boxX, boxY, boxWidth, boxHeight, 5);
  
  // Format clock speed for display
  let speedDisplay = cpu.clockSpeed < 1000 ? 
                     cpu.clockSpeed + " MHz" : 
                     (cpu.clockSpeed / 1000).toFixed(1) + " GHz";
  
  // Draw text
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  text(cpu.name + " (" + cpu.year + ")", boxX + 10, boxY + 10);
  
  textSize(12);
  text("Clock Speed: " + speedDisplay, boxX + 10, boxY + 35);
  text("Manufacturer: " + cpu.manufacturer, boxX + 10, boxY + 55);
  text("Process: " + cpu.process, boxX + 10, boxY + 75);
  text("TDP: " + cpu.watts + " watts", boxX + 10, boxY + 95);
  text("Description: " + cpu.description, boxX + 10, boxY + 115, boxWidth - 20, 50);
}

// Toggle between logarithmic and linear scales
function toggleScale() {
  isLogScale = !isLogScale;
  scaleToggleButton.html(isLogScale ? 'Switch to Linear Scale' : 'Switch to Log Scale');
}

// Draw informational text at the bottom
function drawInfoText() {
  fill(80);
  noStroke();
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text("The Power Wall refers to the thermal/power constraints that limited CPU clock speed scaling in the mid-2000s.", margin, canvasHeight - 15);
  textAlign(RIGHT, BOTTOM);
  text("After 2004, the focus shifted to multi-core designs rather than higher frequencies.", canvasWidth - margin, canvasHeight - 15);
}

// Reset hover information when mouse moves
function mouseMoved() {
  hoverInfo = null;
}

// Handle window resizing
function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Update button position
  scaleToggleButton.position(canvasWidth/2 - 80, 20);
}