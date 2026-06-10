// Responsive MMLU Benchmark Line Chart (v4) with Human Level line

const data = [
  { date: '2020-06', GPT3:   43.9 },
  { date: '2021-06', GPT3:   45.2 },
  { date: '2022-03', GPT3:   46.8, PaLM:     55.0 },
  { date: '2023-03', GPT4:   86.4, Claude1:  71.2, PaLM: 58.2 },
  { date: '2023-07', GPT4:   86.8, Claude2:  75.0, Gemini:   77.5,  LLaMA2: 68.0 },
  { date: '2023-12', GPT4:   87.0, Claude3:  82.1, Gemini:   81.2,  LLaMA2: 69.2 },
  { date: '2024-03', GPT4:   87.2, Claude3:  84.5, Gemini:   83.0,  Mistral: 79.1 },
  { date: '2024-06', GPT4o:  87.4, Claude35: 88.7, Gemini15: 85.1,  Mistral: 80.7 },
  { date: '2024-10', GPT4o:  87.6, Claude35: 89.1, Gemini2:  87.3,  Llama3: 82.5 },
  { date: '2025-02', GPT4o1: 91.5, Claude37: 88.0, Gemini25: 89.5,  Llama4: 85.5 },
  { date: '2025-04', GPT41:  90.2, Claude37: 87.0, Gemini25: 89.8,  Llama4: 85.5, Grok3: 92.7 }
];

let models = ['GPT3', 'GPT4', 'GPT4o', 'GPT4o1', 'GPT4o1', 'GPT41', 'Claude1', 'Claude2', 'Claude3', 'Claude35', 'Claude37','PaLM', 'Gemini', 'Gemini2', 'Gemini15', 'Gemini25', 'LLaMA2','Llama3', 'Llama4', 'Mistral', 'Grok3'];
let colors;

let margin = 60;
let graphW, graphH;
let dotRadius = 6;
let dates = [];

function setup() {
createCanvas(windowWidth * 0.95, 550);
textFont('Helvetica');
noLoop();

colors = {
  GPT3:     'lightgreen',
  GPT4:     'olive',
  GPT4o:    'green',
  GPT4o1:   'green',
  GPT41:   ' green',
  Claude1:  'gold',
  Claude2:  'gold',
  Claude3:  'gold',
  Claude35: 'gold',
  Claude37: 'gold',
  PaLM:    'cyan',
  Gemini:  'red',
  Gemini2:  'red',
  Gemini15:  'red',
  Gemini25:  'red',
  LLaMA2:  'navy',
  Llama3:  'navy',
  Llama4:  'navy',
  Mistral: 'violet',
  Grok3: 'purple'
};

for (let row of data) {
  dates.push(row.date);
}
}

function draw() {
background('aliceblue');
graphW = width - 2 * margin;
graphH = height - 2 * margin - 40;

drawTitle();
drawAxes();

// Draw the Human Level reference line at 89.8%
stroke('blue');
strokeWeight(3);
// Technically it is 89.8 but we lowered it a bit to avoide the 90% line
let yHuman = map(89.5, 40, 90, graphH + margin + 40, margin + 40);
line(margin, yHuman, margin + graphW, yHuman);
noStroke();
fill('blue');
textSize(12);
textAlign(LEFT, CENTER);
text('Human Level (89.9%)', margin + 150, yHuman - 20);

drawLines();
drawLegendTopLeft();
}

function drawTitle() {
textAlign(CENTER, CENTER);
textSize(24);
fill(0);
text('Massive Multitask Language Understanding (MMLU) Benchmark', width / 2, 30);
}

function drawAxes() {
stroke(0);
// Y-axis
line(margin, margin + 40, margin, margin + 40 + graphH);
// X-axis
line(margin, margin + 40 + graphH, margin + graphW, margin + 40 + graphH);

textSize(12);

// Y-axis labels and grid lines
for (let i = 40; i <= 90; i += 10) {
  let y = map(i, 40, 90, graphH + margin + 40, margin + 40);
  stroke(0);
  line(margin - 5, y, margin, y);
  noStroke();
  fill(0);
  textAlign(RIGHT, CENTER);
  text(i + '%', margin - 10, y);
  stroke(200);
  line(margin, y, margin + graphW, y);
}

// X-axis labels
let xGap = graphW / (dates.length - 1);
for (let i = 0; i < dates.length; i++) {
  let x = margin + i * xGap;
  stroke(0);
  line(x, margin + 40 + graphH, x, margin + 40 + graphH + 5);
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  text(dates[i], x, margin + 40 + graphH + 10);
}
}

// draw lines connecting the same model name
function drawLines() {
let xGap = graphW / (dates.length - 1);

for (let model of models) {
  stroke(colors[model]);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < data.length; i++) {
    let val = data[i][model];
    if (val !== undefined) {
      let x = margin + i * xGap;
      let y = map(val, 40, 90, graphH + margin + 40, margin + 40);
      vertex(x, y);
    }
  }
  endShape();

  for (let i = 0; i < data.length; i++) {
    let val = data[i][model];
    if (val !== undefined) {
      let x = margin + i * xGap;
      let y = map(val, 40, 90, graphH + margin + 40, margin + 40);
      fill(colors[model]);
      noStroke();
      ellipse(x, y, dotRadius * 2);
    }
  }
}
}

function drawLegendTopLeft() {
let x = margin + 15;
let y = margin;
legendWidth = 60;
legendHeight = 365;
// white background
fill('white');
rect(x-10, y-10, legendWidth+20, legendHeight+10);
textAlign(LEFT, CENTER);
textSize(12);

for (let model of models) {
  fill(colors[model]);
  noStroke();
  ellipse(x, y, 10);
  fill(0);
  text(model, x + 14, y);
  y += 18;
}
}

function windowResized() {
resizeCanvas(windowWidth * 0.95, 550);
redraw();
}
