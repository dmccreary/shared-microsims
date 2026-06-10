// --- Consolidated Model Data ---
// Each object: { name: string, elo: number, date: "YYYY-MM-DD", type: "proprietary" | "open" }
// 'type' is inferred from the license.
// "Proprietary" -> proprietary
// Others (Apache 2.0, MIT, Llama, Gemma, CC-BY-NC etc.) -> open (simplification for visualization)

const modelsInputData = [
    // Data from embeddedLeaderboardData and publicationDates, now combined with 'type'
    // Type determined by looking at License field (index 6 in original data)
    // "Proprietary" -> proprietary, others -> open
    { name: "gpt-4-turbo-2024-04-09", elo: 1261, date: "2024-04-09", type: "proprietary" }, // OpenAI, Proprietary
    { name: "gpt-4o-2024-05-13", elo: 1256, date: "2024-05-13", type: "proprietary" },       // OpenAI, Proprietary
    { name: "claude-3-opus-20240229", elo: 1253, date: "2024-02-29", type: "proprietary" }, // Anthropic, Proprietary
    { name: "gpt-4-1106-preview", elo: 1251, date: "2023-11-06", type: "proprietary" },     // OpenAI, Proprietary
    { name: "gemini-1.5-pro-preview-0409", elo: 1232, date: "2024-04-09", type: "proprietary" }, // Google, Proprietary
    { name: "gpt-4-0125-preview", elo: 1229, date: "2024-01-25", type: "proprietary" },     // OpenAI, Proprietary
    { name: "claude-3-sonnet-20240229", elo: 1203, date: "2024-02-29", type: "proprietary" }, // Anthropic, Proprietary
    { name: "qwen1.5-72b-chat", elo: 1195, date: "2024-02-05", type: "open" },              // Alibaba, Tongyi Qianwen LICENSE
    { name: "command-r-plus", elo: 1193, date: "2024-04-04", type: "open" },                // Cohere, CC-BY-NC
    { name: "mistral-large-2402", elo: 1191, date: "2024-02-26", type: "proprietary" },     // Mistral AI, Proprietary
    { name: "gpt-4-0613", elo: 1189, date: "2023-06-13", type: "proprietary" },             // OpenAI, Proprietary
    { name: "wizardlm-2-8x22b", elo: 1188, date: "2024-04-17", type: "open" },              // Microsoft, Llama 2 License
    { name: "llama-3-70b-instruct-hf", elo: 1181, date: "2024-04-18", type: "open" },      // Meta, Llama 3 Community License
    { name: "claude-3-haiku-20240307", elo: 1166, date: "2024-03-07", type: "proprietary" }, // Anthropic, Proprietary
    { name: "gpt-3.5-turbo-0125", elo: 1160, date: "2024-01-25", type: "proprietary" },     // OpenAI, Proprietary
    { name: "dbrx-instruct", elo: 1156, date: "2024-03-27", type: "open" },                // Databricks, Databricks Open Model License
    { name: "qwen1.5-32b-chat", elo: 1150, date: "2024-02-05", type: "open" },              // Alibaba, Tongyi Qianwen LICENSE
    { name: "mixtral-8x7b-instruct-v0.1", elo: 1147, date: "2023-12-11", type: "open" },    // Mistral AI, Apache 2.0
    { name: "yi-34b-chat-0205", elo: 1145, date: "2024-02-05", type: "open" },              // 01.AI, Yi Series Models Community License
    { name: "deepseek-llm-67b-chat", elo: 1143, date: "2023-11-29", type: "open" },        // DeepSeek, DeepSeek LLM Community License
    { name: "llama-2-70b-chat-hf", elo: 1140, date: "2023-07-18", type: "open" },          // Meta, Llama 2
    { name: "command-r", elo: 1137, date: "2024-03-12", type: "open" },                    // Cohere, CC-BY-NC
    { name: "starling-lm-7b-beta", elo: 1130, date: "2023-11-20", type: "open" },          // Nexusflow, Apache 2.0
    { name: "claude-2.1", elo: 1125, date: "2023-11-21", type: "proprietary" },             // Anthropic, Proprietary
    { name: "gemini-pro-dev-api", elo: 1120, date: "2023-12-13", type: "proprietary" },     // Google, Proprietary (gemini-1.0-pro)
    { name: "gemini-1.0-pro-001", elo: 1120, date: "2023-12-06", type: "proprietary" },     // Google, Proprietary
    { name: "llama-3-8b-instruct-hf", elo: 1118, date: "2024-04-18", type: "open" },        // Meta, Llama 3 Community License
    { name: "mistral-7b-instruct-v0.2", elo: 1115, date: "2023-12-11", type: "open" },      // Mistral AI, Apache 2.0
    { name: "gemma-7b-it", elo: 1110, date: "2024-02-21", type: "open" },                  // Google, Gemma Terms of Use
    { name: "claude-2.0", elo: 1105, date: "2023-07-11", type: "proprietary" },             // Anthropic, Proprietary
    { name: "vicuna-33b-v1.3", elo: 1100, date: "2023-06-07", type: "open" },              // LMSYS, Llama (original)
    { name: "gpt-3.5-turbo-1106", elo: 1152, date: "2023-11-06", type: "proprietary" },     // OpenAI, Proprietary
    { name: "gpt-3.5-turbo-0613", elo: 1131, date: "2023-06-13", type: "proprietary" },     // OpenAI, Proprietary
    { name: "claude-1", elo: 1080, date: "2023-03-14", type: "proprietary" },               // Anthropic, Proprietary
    { name: "gpt-4", elo: 1170, date: "2023-03-14", type: "proprietary" },                 // OpenAI, Proprietary (Original GPT-4)
    { name: "palm-2-chat-bison-001", elo: 1090, date: "2023-05-10", type: "proprietary" }, // Google, Proprietary
    { name: "codeLlama-70b-instruct-hf", elo: 1128, date: "2024-01-29", type: "open" },    // Meta, Llama 2
    { name: "mistral-medium", elo: 1175, date: "2023-12-11", type: "proprietary" },         // Mistral AI, Proprietary
    { name: "phi-2", elo: 1070, date: "2023-12-12", type: "open" },                        // Microsoft, MIT
    { name: "qwen-72b-chat", elo: 1178, date: "2023-11-30", type: "open" },                // Alibaba, Tongyi Qianwen LICENSE
    { name: "yi-34b-chat", elo: 1135, date: "2023-11-05", type: "open" },                  // 01.AI, Yi Series Models Community License
    { name: "llama-2-13b-chat-hf", elo: 1095, date: "2023-07-18", type: "open" },          // Meta, Llama 2
    { name: "chatglm3-6b", elo: 1060, date: "2023-10-27", type: "open" },                  // Zhipuai, Apache 2.0
    { name: "openchat-3.5-0106", elo: 1122, date: "2024-01-06", type: "open" },            // OpenChat, Apache 2.0
    { name: "zephyr-7b-beta", elo: 1108, date: "2023-10-24", type: "open" },               // HuggingFace, MIT
    { name: "nous-hermes-2-mixtral-8x7b-dpo", elo: 1142, date: "2023-12-20", type: "open" },// Nous Research, Apache 2.0
    { name: "nous-hermes-2-yi-34b", elo: 1138, date: "2023-11-28", type: "open" },          // Nous Research, Yi Series Models Community License
    { name: "xwin-lm-70b-v0.1", elo: 1133, date: "2023-08-15", type: "open" },              // Xwin-LM, Llama 2
];


let processedModels = [];
let minDate, maxDate, minScore, maxScore;

function setup() {
    createCanvas(windowWidth, windowHeight);
    processData();
    if (processedModels.length === 0) {
        console.warn("No models could be processed. Check input data.");
    }
}

function processData() {
    if (!modelsInputData || modelsInputData.length === 0) {
        console.error("Models input data is not available or empty.");
        return;
    }

    processedModels = [];
    let dates = [];
    let scores = [];

    modelsInputData.forEach(item => {
        const modelName = item.name;
        const eloScore = parseFloat(item.elo);
        const dateStr = item.date;
        const modelType = item.type;

        if (modelName && dateStr && !isNaN(eloScore) && modelType) {
            const dateParts = dateStr.split('-'); // YYYY-MM-DD
            const modelDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            
            if (!isNaN(modelDate.getTime())) {
                processedModels.push({
                    name: modelName,
                    score: eloScore,
                    date: modelDate,
                    type: modelType
                });
                dates.push(modelDate.getTime());
                scores.push(eloScore);
            } else {
                console.warn(`Invalid date string for ${modelName}: ${dateStr}`);
            }
        } else {
            // console.log(`Skipping item (missing data): ${modelName || 'Unknown Model'}`);
        }
    });
    
    if (dates.length > 0 && scores.length > 0) {
        minDate = new Date(Math.min(...dates));
        maxDate = new Date(Math.max(...dates));
        minScore = Math.min(...scores);
        maxScore = Math.max(...scores);

        const scorePadding = (maxScore - minScore) * 0.05;
        minScore -= scorePadding;
        maxScore += scorePadding;

        minDate.setMonth(minDate.getMonth() - 1);
        maxDate.setMonth(maxDate.getMonth() + 1);

    } else {
        minDate = new Date(2023, 0, 1); 
        maxDate = new Date(); 
        minScore = 1000;
        maxScore = 1400;
        console.warn("Not enough data to determine scales, using default ranges.");
    }
    
    processedModels.sort((a, b) => a.date - b.date);
    redraw(); 
}

function draw() {
    background('aliceblue');

    if (processedModels.length === 0) {
        fill(50);
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Loading data or no models to display...", width / 2, height / 2);
        return;
    }

    const margin = { top: 60, right: 60, bottom: 100, left: 70 }; // Increased bottom margin for legend
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    if (plotWidth <= 0 || plotHeight <= 0) return;

    fill(0);
    textSize(constrain(width / 40, 12, 20));
    textAlign(CENTER, TOP);
    text("LMArena Leaderboard: Score vs. Estimated Publication Date", width / 2, margin.top / 3);

    stroke(150);
    strokeWeight(1);
    line(margin.left, margin.top, margin.left, height - margin.bottom);
    line(margin.left, height - margin.bottom, width - margin.right, height - margin.bottom);

    textAlign(RIGHT, CENTER);
    textSize(constrain(width / 100, 8, 10));
    const numYTicks = 8;
    for (let i = 0; i <= numYTicks; i++) {
        const val = minScore + (i / numYTicks) * (maxScore - minScore);
        const y = map(val, minScore, maxScore, height - margin.bottom, margin.top);
        stroke(200);
        line(margin.left - 5, y, margin.left, y);
        line(margin.left, y, width - margin.right, y);
        noStroke();
        fill(50);
        text(val.toFixed(0), margin.left - 10, y);
    }
    push();
    translate(margin.left / 2 - 10, height / 2);
    rotate(-HALF_PI);
    textAlign(CENTER, CENTER);
    textSize(constrain(width / 70, 10, 12));
    fill(0);
    text("LMArena Elo Score", 0, 0);
    pop();

    textAlign(CENTER, TOP);
    textSize(constrain(width / 100, 8, 10));
    const numXTicks = Math.min(12, Math.max(2, Math.floor(plotWidth / (constrain(width/15, 60, 100)) )));
    
    for (let i = 0; i <= numXTicks; i++) {
        const t = i / numXTicks;
        const tickDateTimestamp = minDate.getTime() + t * (maxDate.getTime() - minDate.getTime());
        const tickDate = new Date(tickDateTimestamp);
        const x = map(tickDateTimestamp, minDate.getTime(), maxDate.getTime(), margin.left, width - margin.right);
        
        stroke(200);
        line(x, height - margin.bottom, x, height - margin.bottom + 5);
        line(x, margin.top, x, height - margin.bottom);
        noStroke();
        fill(50);
        const month = tickDate.toLocaleString('default', { month: 'short' });
        const year = tickDate.getFullYear();
        text(`${month}\n${year}`, x, height - margin.bottom + 10);
    }
    textAlign(CENTER, TOP);
    textSize(constrain(width / 70, 10, 12));
    fill(0);
    text("Estimated Publication Date", width / 2, height - margin.bottom + 35);


    let hoveredModel = null;
    const pointSize = constrain(width / 150, 7, 11); // Base size for circle diameter or square side

    for (const model of processedModels) {
        const x = map(model.date.getTime(), minDate.getTime(), maxDate.getTime(), margin.left, width - margin.right);
        const y = map(model.score, minScore, maxScore, height - margin.bottom, margin.top);

        if (dist(mouseX, mouseY, x, y) < pointSize / 2 + 3) {
            hoveredModel = model;
        }
    }
    
    for (const model of processedModels) {
        const x = map(model.date.getTime(), minDate.getTime(), maxDate.getTime(), margin.left, width - margin.right);
        const y = map(model.score, minScore, maxScore, height - margin.bottom, margin.top);
        
        let currentPointSize = pointSize;
        if (model === hoveredModel) {
            // Skip drawing here, will be drawn after loop
        } else {
            noStroke();
            if (model.type === "proprietary") {
                fill(0, 100, 255, 180); // Blue for proprietary
                ellipse(x, y, currentPointSize, currentPointSize);
            } else { // "open"
                fill(34, 139, 34, 180); // Green for open
                rectMode(CENTER);
                square(x, y, currentPointSize);
            }
        }
    }

    if (hoveredModel) {
        const x = map(hoveredModel.date.getTime(), minDate.getTime(), maxDate.getTime(), margin.left, width - margin.right);
        const y = map(hoveredModel.score, minScore, maxScore, height - margin.bottom, margin.top);
        let currentPointSize = pointSize + 4; // Make hovered point larger

        stroke(50);
        strokeWeight(1.5);
        if (hoveredModel.type === "proprietary") {
            fill(0, 100, 255, 230); 
            ellipse(x, y, currentPointSize, currentPointSize);
        } else { // "open"
            fill(34, 139, 34, 230); 
            rectMode(CENTER);
            square(x, y, currentPointSize);
        }
        noStroke();

        const tooltipText = `${hoveredModel.name} (${hoveredModel.type})\nScore: ${hoveredModel.score.toFixed(0)}\nDate: ${hoveredModel.date.toLocaleDateString()}`;
        const tempTextSize = constrain(width / 90, 9, 11);
        textSize(tempTextSize);
        let maxLineW = 0;
        tooltipText.split('\n').forEach(line => {
            maxLineW = Math.max(maxLineW, textWidth(line));
        });
        const textWidthVal = maxLineW + 20;
        const textHeightVal = (tempTextSize + 5) * tooltipText.split('\n').length + 10;
        
        let tooltipX = x + 15;
        let tooltipY = y - textHeightVal / 2;

        if (tooltipX + textWidthVal > width - 10) {
            tooltipX = x - textWidthVal - 15;
        }
        if (tooltipY < 10) {
            tooltipY = 10;
        }
        if (tooltipY + textHeightVal > height - 10) {
            tooltipY = height - 10 - textHeightVal;
        }
        
        fill(255, 255, 240, 230);
        stroke(50);
        strokeWeight(0.5);
        rectMode(CORNER); // Ensure rect mode is CORNER for tooltip
        rect(tooltipX, tooltipY, textWidthVal, textHeightVal, 5);

        fill(0);
        noStroke();
        textAlign(LEFT, TOP);
        text(tooltipText, tooltipX + 10, tooltipY + 5);
    }

    // --- Draw Legend ---
    const legendX = margin.left + 20;
    const legendY = height - margin.bottom + 65; // Position below X-axis title
    const legendPointSize = 10;
    const legendSpacing = 20;
    const legendTextSize = constrain(width / 80, 10, 12);

    textSize(legendTextSize);
    textAlign(LEFT, CENTER);
    fill(50);

    // Proprietary (Circle)
    fill(0, 100, 255, 200); // Blue
    noStroke();
    ellipse(legendX, legendY, legendPointSize, legendPointSize);
    fill(50);
    text("Proprietary", legendX + legendPointSize, legendY);

    // Open (Square)
    const openLegendX = legendX + textWidth("Proprietary") + legendPointSize * 2 + legendSpacing;
    fill(34, 139, 34, 200); // Green
    noStroke();
    rectMode(CENTER);
    square(openLegendX, legendY, legendPointSize);
    fill(50);
    text("Open", openLegendX + legendPointSize, legendY);
    rectMode(CORNER); // Reset rect mode
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redraw();
}