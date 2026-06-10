// Porter’s Five Forces Model MicroSim
// Responsive p5.js sketch with hover infobox and click-to-link functionality

let containerWidth;
const containerHeight = 500;

const margin = 20;
// for placement of text within the circles
const defaultTextSize = 18;
// inforbox at the bottom
const infoBoxHeight = 80;

// center of the diagram
let cx = containerWidth / 2;
let cy = (containerHeight - infoBoxHeight) / 2;

let forces = [];
let currentHover = -1;


function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  updateLayout();
  describe(
    "Porter's Five Forces Model interactive diagram. Hover over each force to see its description and click to open its section in the document.",
    LABEL
  );
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  // update the center
  let cx = containerWidth / 2;
}

function updateLayout() {
  forces = [
    {
      label: "Threat of\nNew Entrants",
      description:
        "The risk that new competitors may enter the market, increasing competition and reducing profitability.",
      url:
        "https://en.wikipedia.org/wiki/Porter%27s_five_forces#Threat_of_new_entrants"
    },
    {
      label: "Bargaining Power\nof Suppliers",
      description:
        "The ability of suppliers to drive up input costs, affecting the profit margins of firms in the industry.",
      url:
        "https://en.wikipedia.org/wiki/Porter%27s_five_forces#Bargaining_power_of_suppliers"
    },
    {
      label: "Bargaining Power\nof Buyers",
      description:
        "The influence customers have on pricing and quality, depending on their concentration and alternative options.",
      url:
        "https://en.wikipedia.org/wiki/Porter%27s_five_forces#Bargaining_power_of_buyers"
    },
    {
      label: "Threat of\nSubstitutes",
      description:
        "The extent to which different products or services can replace industry offerings, limiting price potential.",
      url:
        "https://en.wikipedia.org/wiki/Porter%27s_five_forces#Threat_of_substitute_products_or_services"
    },
    {
      label: "Competitive\nRivalry",
      description:
        "The degree of competition among existing firms, influencing pricing, advertising, and product development.",
      url:
        "https://en.wikipedia.org/wiki/Porter%27s_five_forces#Rivalry_among_existing_competitors"
    }
  ];

  // Compute circle positions around a central point
  const cx = containerWidth / 2;
  const cy = (containerHeight - infoBoxHeight) / 2 + margin;
  const bigRadius =
    Math.min(containerWidth, containerHeight - infoBoxHeight) * 0.3;

  forces.forEach((f, i) => {
    const angle = (-HALF_PI + i * TWO_PI / forces.length); // evenly spaced
    const x = cx + bigRadius * cos(angle)*1.5;
    const y = cy + bigRadius * sin(angle);
    f.x = x;
    f.y = y;
    f.r = bigRadius * 0.5;
  });
}

function draw() {
  background("aliceblue");

  // Title
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textSize(24);
  text("Porter's Five Forces Model", containerWidth / 2, margin);
  
  // Your organization blue ellipse with white text in the center
  fill('blue');
  ellipse(containerWidth / 2, cy+margin, 140, 120);
  textSize(20);
  fill('white');
  text("Your\nOrganization", containerWidth / 2, cy-10);
  
  // Draw each force circle
  forces.forEach((f, i) => {
    const hovering = dist(mouseX, mouseY, f.x, f.y) <= f.r;
    if (hovering) {
      currentHover = i;
      stroke("blue");
      strokeWeight(3);
    } else {
      if (currentHover === i) currentHover = -1;
      stroke("black");
      strokeWeight(1);
    }
    fill(255);
    ellipse(f.x, f.y, f.r * 3, f.r * 1);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(defaultTextSize);
    text(f.label, f.x, f.y+2);
  });

  // Draw description infobox at bottom
  const boxY = containerHeight - infoBoxHeight - margin;
  const boxW = containerWidth - 2 * margin;
  const boxH = infoBoxHeight;
  fill(240);
  stroke("silver");
  strokeWeight(1);
  rect(margin, boxY, boxW, boxH, 5);
  noStroke();
  fill(0);
  textAlign(LEFT, TOP);
  textSize(getResponsiveTextSize(defaultTextSize));
  const infoText =
    currentHover !== -1
      ? forces[currentHover].description
      : "Hover over a force to see its description.";
  text(infoText, margin + 10, boxY + 10, boxW - 20, boxH - 20);
}

function mouseMoved() {
  let found = false;
  forces.forEach((f, i) => {
    if (dist(mouseX, mouseY, f.x, f.y) <= f.r) {
      currentHover = i;
      found = true;
    }
  });
  if (!found) currentHover = -1;
}

function mousePressed() {
  if (currentHover !== -1) {
    window.open(forces[currentHover].url, "_blank");
  }
}

function windowResized() {
  updateCanvasSize();
  updateLayout();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function getResponsiveTextSize(baseSize) {
  return constrain(
    baseSize * (containerWidth / 800),
    baseSize * 0.8,
    baseSize * 1.5
  );
}
