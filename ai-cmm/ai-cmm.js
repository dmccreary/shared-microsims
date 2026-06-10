// Responsive AI Capability Maturity Model visualization (ai-cmm.js)

let containerWidth;
const canvasHeight = 560; // Fixed vertical size
let canvasWidth;

let layers = [];
let descriptions = [];
let currentHover = -1;

// Layout parameters (will be recalculated)
let m = 20;        // margin around steps (will be used in updateLayout)
let sh = 80;       // step height (fixed)
let stepUnit = 0;  // will be calculated as (canvasWidth - 2*m) / 5

function setup() {
  // Calculate initial container width
  updateCanvasSize();
  // Create canvas using the current container width
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Define descriptions for AI maturity levels (static content)
  descriptions = [
    "Level 1 - Ad Hoc: Organizations at this level have little to no formal AI strategy. AI initiatives are isolated, experimental, or driven by individual enthusiasm. There's limited understanding of AI capabilities, no governance framework, and scattered pilot projects with unclear ROI. Data infrastructure is fragmented and AI literacy is low across the organization.",
    "Level 2 - Experimental: Organizations begin exploring AI through small-scale pilots and proof-of-concepts. There's growing awareness of AI potential, but implementation remains departmental. Basic data infrastructure exists, some staff receive AI training, and initial governance policies are drafted. Success metrics are being defined, but scaling remains challenging.",
    "Level 3 - Systematic: AI initiatives become more coordinated with established governance frameworks. Organizations have dedicated AI teams, standardized processes for AI development, and systematic data management. Multiple AI use cases are deployed in production, ROI is measurable, and there's organization-wide AI literacy programs. Risk management practices are formalized.",
    "Level 4 - Strategic: AI is integrated into core business strategy and operations. Organizations have comprehensive AI governance, advanced data platforms, and centers of excellence. AI drives significant business value, competitive advantage is clear, and there's continuous innovation in AI capabilities. Ethical AI practices are embedded throughout the organization.",
    "Level 5 - Transformative: AI is fundamental to the organization's identity and operations. The organization leads in AI innovation, has autonomous AI systems, and demonstrates measurable transformation of business models. AI capabilities are a core differentiator, enabling new markets and revenue streams. The organization contributes to AI advancement in their industry."
  ];

  // Build initial layout
  updateLayout();

  // Accessibility description
  describe(
    'AI Capability Maturity Model showing five levels of organizational AI maturity from Ad Hoc to Transformative, displayed as ascending steps with detailed descriptions available on hover.',
    LABEL
  );
}

function draw() {
  background('aliceblue');
  
  // Title
  fill(50);
  textSize(28);
  textAlign(CENTER, TOP);
  text("AI Capability Maturity Model", canvasWidth / 2, 10);
  
  // Draw each layer
  textSize(18);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < layers.length; i++) {
    let l = layers[i];
    if (i === currentHover) {
      stroke(50);
      strokeWeight(4);
    } else {
      stroke(100);
      strokeWeight(2);
    }
    fill(l.color);
    rect(l.x, l.y, l.w, l.h, 5);
    fill(l.tcolor);
    noStroke();
    text(l.level, l.x + l.w / 2, l.y + l.h / 2);
  }
  
  // Description area
  if (currentHover !== -1) {
    fill(255, 255, 255, 240);
    stroke(150);
    strokeWeight(1);
    rect(10, 460, canvasWidth - 20, 95, 5);
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text(descriptions[currentHover], 20, 465, canvasWidth - 40, 120);
  } else {
    fill(100);
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      "Hover over each level to explore AI maturity characteristics",
      canvasWidth / 2,
      520
    );
  }
}

function mouseMoved() {
  currentHover = -1;
  for (let i = 0; i < layers.length; i++) {
    let l = layers[i];
    if (
      mouseX >= l.x &&
      mouseX <= l.x + l.w &&
      mouseY >= l.y &&
      mouseY <= l.y + l.h
    ) {
      currentHover = i;
      break;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  updateLayout();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

function updateLayout() {
  // Recalculate unit width for steps
  m = max(20, containerWidth * 0.03);
  stepUnit = (containerWidth - 2 * m) / 5;
  
  // Rebuild the layers array based on current containerWidth
  layers = [
    {
      x: m,
      y: sh * 4 + 2 * m,
      w: stepUnit * 5,
      h: sh,
      level: "Level 1 - Ad Hoc",
      color: "#FF6B6B",
      tcolor: "white"
    },
    {
      x: m + stepUnit * 1,
      y: sh * 3 + 2 * m,
      w: stepUnit * 4,
      h: sh,
      level: "Level 2 - Experimental",
      color: "#FF9F43",
      tcolor: "white"
    },
    {
      x: m + stepUnit * 2,
      y: sh * 2 + 2 * m,
      w: stepUnit * 3,
      h: sh,
      level: "Level 3 - Systematic",
      color: "#FFC048",
      tcolor: "black"
    },
    {
      x: m + stepUnit * 3,
      y: sh * 1 + 2 * m,
      w: stepUnit * 2,
      h: sh,
      level: "Level 4 - Strategic",
      color: "#5F9EA0",
      tcolor: "white"
    },
    {
      x: stepUnit * 4,
      y: 2 * m,
      w: stepUnit * 1 + m,
      h: sh,
      level: "L5 - Transformative",
      color: "#2E86AB",
      tcolor: "white"
    }
  ];
}
