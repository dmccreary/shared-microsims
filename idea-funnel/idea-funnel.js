
// GenAI CoE Idea Funnel Infographic
// This code creates an interactive funnel infographic for the 
// GenAI Center of Excellence idea submission process.
// It includes stages from training through deployment, with hover details.
// The funnel is designed to visualize the flow of ideas and their progression through the process.
// It features side panels for idea submission and a dashboard summary, with responsive design 
// for different screen sizes.
// Dan McCreary - June 2025

let canvasWidth = 1200;
let canvasHeight = 700;
let containerWidth;
let containerHeight = canvasHeight;

// Funnel stages data
let funnelStages = [];
let currentHover = -1;

// Layout parameters
let margin = 40;
let funnelCenterX;
let funnelStartY = 100;
let funnelEndY = 600;
let funnelTopWidth = 300;
let funnelBottomWidth = 100;

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(containerWidth, containerHeight);
    canvas.parent(document.querySelector('main'));

    funnelCenterX = containerWidth / 2;

    // Define funnel stages with descriptions
    funnelStages = [
        {
            name: "Training Program",
            shortLabel: "AI Training",
            color: "#FF6B6B",
            textColor: "white",
            y: funnelStartY,
            height: 60,
            description: "1-hour online training program teaches employees to identify high-value AI opportunities, understand feasibility constraints, and calculate ROI for potential projects."
        },
        {
            name: "Idea Submission",
            shortLabel: "Submit Ideas",
            color: "#4ECDC4",
            textColor: "white",
            y: funnelStartY + 80,
            height: 60,
            description: "Universal web form allows all employees to submit GenAI ideas with problem statements, proposed solutions, expected benefits, and resource requirements."
        },
        {
            name: "Expert Review",
            shortLabel: "Review & Feedback",
            color: "#45B7D1",
            textColor: "white",
            y: funnelStartY + 160,
            height: 60,
            description: "GenAI expert panel conducts technical feasibility assessment, business value analysis, and provides detailed feedback to submitters and managers within 2 weeks."
        },
        {
            name: "Scoring & Categorization",
            shortLabel: "Score & Categorize",
            color: "#96CEB4",
            textColor: "black",
            y: funnelStartY + 240,
            height: 60,
            description: "Ideas scored on feasibility, risk, and benefits (1-5 scale). Categorized by problem type, complexity level, department, and implementation timeframe."
        },
        {
            name: "Monthly Selection",
            shortLabel: "Fund Projects",
            color: "#FECA57",
            textColor: "black",
            y: funnelStartY + 320,
            height: 60,
            description: "Expert panel meets monthly to select 2-5 highest-scoring ideas for development funding based on strategic alignment and available resources."
        },
        {
            name: "Development",
            shortLabel: "Build Solution",
            color: "#FF9FF3",
            textColor: "black",
            y: funnelStartY + 400,
            height: 60,
            description: "Dedicated development teams build solutions with bi-weekly progress reports, technical support from GenAI CoE, and milestone tracking."
        },
        {
            name: "Deployment",
            shortLabel: "Go Live",
            color: "#54A0FF",
            textColor: "white",
            y: funnelStartY + 480,
            height: 60,
            description: "Successful solutions deployed to production with user training, performance monitoring, and measurement of ROI and business impact."
        }
    ];

    describe('GenAI Center of Excellence Idea Funnel showing the flow from training through deployment with interactive hover details.', LABEL);
}

function draw() {
    background('aliceblue');

    // Draw title
    fill('#2c3e50');
    noStroke();
    textSize(28);
    textAlign(CENTER, TOP);
    text("GenAI Center of Excellence: Idea Funnel", containerWidth / 2, 20);

    // Draw side panels
    drawSidePanels();

    // Draw funnel outline
    drawFunnelOutline();

    // Draw funnel stages
    drawFunnelStages();

    // Draw flow indicators
    drawFlowIndicators();

    // Draw hover info box on the top of the funnel
    if (currentHover !== -1) {
        drawInfoBox();
    }

}

function drawSidePanels() {
    // Left panel - New Idea Form
    let leftPanelX = margin;
    let leftPanelY = funnelStartY + 50;
    let panelWidth = 180;
    let panelHeight = 300;

    fill('#e8f4fd');
    stroke('#3498db');
    strokeWeight(2);
    rect(leftPanelX, leftPanelY, panelWidth, panelHeight, 10);

    fill('#2980b9');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text("New GenAI", leftPanelX + panelWidth / 2, leftPanelY + 15);
    text("Idea Form", leftPanelX + panelWidth / 2, leftPanelY + 35);

    // Form elements
    fill('#34495e');
    textSize(12);
    textAlign(LEFT, TOP);
    let formY = leftPanelY + 70;
    text("• Problem Statement", leftPanelX + 15, formY);
    text("• Proposed Solution", leftPanelX + 15, formY + 25);
    text("• Expected Benefits", leftPanelX + 15, formY + 50);
    text("• Resource Needs", leftPanelX + 15, formY + 75);
    text("• Success Metrics", leftPanelX + 15, formY + 100);
    text("• Risk Assessment", leftPanelX + 15, formY + 125);

    // Submit button
    fill('#27ae60');
    noStroke();
    rect(leftPanelX + 30, formY + 160, panelWidth - 60, 35, 5);
    fill('white');
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Submit Idea", leftPanelX + panelWidth / 2, formY + 177);

    // Right panel - Dashboard
    let rightPanelX = containerWidth - margin - panelWidth;
    let rightPanelY = leftPanelY;

    fill('#fff5e6');
    stroke('#f39c12');
    strokeWeight(2);
    rect(rightPanelX, rightPanelY, panelWidth, panelHeight, 10);

    fill('#e67e22');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text("Summary", rightPanelX + panelWidth / 2, rightPanelY + 15);
    text("Dashboard", rightPanelX + panelWidth / 2, rightPanelY + 35);

    // KPI elements
    fill('#34495e');
    textSize(12);
    textAlign(LEFT, TOP);
    let dashY = rightPanelY + 70;
    text("Ideas Submitted: 156", rightPanelX + 15, dashY);
    text("In Review: 23", rightPanelX + 15, dashY + 25);
    text("In Development: 8", rightPanelX + 15, dashY + 50);
    text("Deployed: 12", rightPanelX + 15, dashY + 75);
    text("Total ROI: $2.4M", rightPanelX + 15, dashY + 100);
    text("Avg Time: 45 days", rightPanelX + 15, dashY + 125);

    // Chart representation
    fill('#3498db');
    noStroke();
    rect(rightPanelX + 15, dashY + 160, 40, 20);
    fill('#e74c3c');
    rect(rightPanelX + 60, dashY + 160, 30, 20);
    fill('#2ecc71');
    rect(rightPanelX + 95, dashY + 160, 50, 20);
}

function drawFunnelOutline() {
    // Calculate funnel shape
    stroke('#7f8c8d');
    strokeWeight(2);
    noFill();

    // Left side of funnel
    let leftTop = funnelCenterX - funnelTopWidth / 2;
    let leftBottom = funnelCenterX - funnelBottomWidth / 2;
    let rightTop = funnelCenterX + funnelTopWidth / 2;
    let rightBottom = funnelCenterX + funnelBottomWidth / 2;

    line(leftTop, funnelStartY, leftBottom, funnelEndY);
    line(rightTop, funnelStartY, rightBottom, funnelEndY);
}

function drawFunnelStages() {
    currentHover = -1;

    for (let i = 0; i < funnelStages.length; i++) {
        let stage = funnelStages[i];

        // Calculate width at this Y position
        let progress = (stage.y - funnelStartY) / (funnelEndY - funnelStartY);
        let currentWidth = funnelTopWidth - (funnelTopWidth - funnelBottomWidth) * progress;
        let stageWidth = currentWidth * 0.9; // Slightly smaller than funnel outline

        let x = funnelCenterX - stageWidth / 2;
        let y = stage.y;

        // Check for hover
        let isHovered = mouseX > x && mouseX < x + stageWidth &&
            mouseY > y && mouseY < y + stage.height;

        if (isHovered) {
            currentHover = i;
            strokeWeight(4);
            stroke('#2c3e50');
        } else {
            strokeWeight(2);
            stroke('#34495e');
        }

        // Draw stage rectangle
        fill(stage.color);
        rect(x, y, stageWidth, stage.height, 8);

        // Draw stage label
        fill(stage.textColor);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text(stage.shortLabel, funnelCenterX, y + stage.height / 2);

        // Draw stage number
        fill('#2c3e50');
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(14);
        let numberX = x - 25;
        circle(numberX, y + stage.height / 2, 20);
        fill('white');
        text(i + 1, numberX, y + stage.height / 2);
    }
}

function drawFlowIndicators() {
    // Draw arrows between stages
    fill('#7f8c8d');
    noStroke();
    for (let i = 0; i < funnelStages.length - 1; i++) {
        let currentStage = funnelStages[i];
        let nextStage = funnelStages[i + 1];
        let arrowY = currentStage.y + currentStage.height + 10;

        // Draw arrow
        triangle(funnelCenterX, arrowY + 10,
            funnelCenterX - 5, arrowY,
            funnelCenterX + 5, arrowY);
    }

    // Draw entry arrow from form
    fill('#3498db');
    let formToFunnelY = funnelStartY + 25;
    triangle(margin + 190, formToFunnelY,
        margin + 200, formToFunnelY - 5,
        margin + 200, formToFunnelY + 5);

    // Draw exit arrow to dashboard
    let funnelToDashY = funnelStartY + 200;
    triangle(containerWidth - margin - 190, funnelToDashY,
        containerWidth - margin - 200, funnelToDashY - 5,
        containerWidth - margin - 200, funnelToDashY + 5);
}

function drawInfoBox() {
    let stage = funnelStages[currentHover];
    let boxWidth = 350;
    let boxHeight = 100;
    let boxX = mouseX + 15;
    let boxY = mouseY - 50;

    // Keep box within canvas bounds
    if (boxX + boxWidth > containerWidth - 20) {
        boxX = mouseX - boxWidth - 15;
    }
    if (boxY < 20) {
        boxY = 20;
    }
    if (boxY + boxHeight > containerHeight - 20) {
        boxY = containerHeight - boxHeight - 20;
    }

    // Draw info box
    fill(255, 255, 255, 240);
    stroke('#2c3e50');
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight, 8);

    // Draw title
    fill('#2c3e50');
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);
    text(stage.name, boxX + 15, boxY + 15);

    // Draw description
    fill('#34495e');
    textSize(12);
    text(stage.description, boxX + 15, boxY + 40, boxWidth - 30, boxHeight - 50);
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    funnelCenterX = containerWidth / 2;
    redraw();
}

function updateCanvasSize() {
    const container = document.querySelector('main').getBoundingClientRect();
    containerWidth = Math.floor(container.width);
    canvasWidth = containerWidth;
}
