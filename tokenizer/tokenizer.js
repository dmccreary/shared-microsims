// p5.js sketch to demonstrate LLM tokenization with more realistic token ID 
// simulation
// This MicroSim was inspired by the tokenizer demo from the OpenAI site
// https://platform.openai.com/tokenizer

// Global variables for UI elements
let inputLabel, inputTextArea;
let dropdownLabel, sampleTextsDropdown;
let tokenizedLabel, tokenizedTextArea;
let showStringTokensCheckbox;

let currentInput = '';

// Global map to store token strings to their assigned pseudo-IDs
// This simulates a tokenizer's vocabulary.
const tokenToIdMap = new Map();
let nextPseudoIdBase = 0; // Used to make hashes more unique if needed

// Sample texts for the dropdown menu, updated with user examples
const sampleTexts = [
  "Hello world!",
  "Many words map to one token, but some don't: indivisible.",
  "Unicode characters like emojis may be split into many tokens containing the underlying bytes: 🤚🏾",
  "Sequences of characters commonly found next to each other may be grouped together: 1234567890",
  "Test with punctuation!! And more... 😄👍🚀"
];

// Simple hashing function to generate pseudo-random looking IDs
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Return a positive integer, scaled to look like common token IDs
  return Math.abs(hash % 90000) + 10000; // Generates IDs roughly between 10000 and 99999
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background('aliceblue');

  // --- Input Text Area ---
  inputLabel = createP('Input Text:');
  inputLabel.style('font-size', '16px');
  inputLabel.style('font-family', 'Arial, sans-serif');
  inputLabel.position(20, 5);

  inputTextArea = createElement('textarea');
  inputTextArea.size(windowWidth - 45, 100);
  inputTextArea.position(20, 40);
  inputTextArea.input(handleInput);
  inputTextArea.style('font-size', '14px');
  inputTextArea.style('font-family', 'monospace');
  inputTextArea.style('resize', 'none');
  inputTextArea.style('border', '1px solid #ccc');
  inputTextArea.style('border-radius', '4px');

  // --- Sample Texts Dropdown ---
  dropdownLabel = createP('Select Sample Text:');
  dropdownLabel.style('font-size', '16px');
  dropdownLabel.style('font-family', 'Arial, sans-serif');
  dropdownLabel.position(20, 150);

  sampleTextsDropdown = createSelect();
  sampleTextsDropdown.position(20, 185);
  sampleTextsDropdown.option('-- Select an Example --');
  for (let i = 0; i < sampleTexts.length; i++) {
    sampleTextsDropdown.option(sampleTexts[i], i);
  }
  sampleTextsDropdown.changed(selectSampleText);
  sampleTextsDropdown.style('font-size', '14px');
  sampleTextsDropdown.style('padding', '5px');
  sampleTextsDropdown.style('border-radius', '4px');

  // --- Tokenized Text Area & Controls ---
  tokenizedLabel = createP('Tokenized Text:');
  tokenizedLabel.style('font-size', '16px');
  tokenizedLabel.style('font-family', 'Arial, sans-serif');
  tokenizedLabel.position(20, 220);

  showStringTokensCheckbox = createCheckbox('Show String Tokens', false);
  showStringTokensCheckbox.position(20, 245);
  showStringTokensCheckbox.style('font-family', 'Arial, sans-serif');
  showStringTokensCheckbox.style('font-size', '13px');
  showStringTokensCheckbox.changed(updateTokenizationDisplay);

  tokenizedTextArea = createElement('textarea');
  tokenizedTextArea.size(windowWidth - 45, 150);
  tokenizedTextArea.position(20, 275);
  tokenizedTextArea.attribute('readonly', true);
  tokenizedTextArea.style('font-size', '14px');
  tokenizedTextArea.style('font-family', 'monospace');
  tokenizedTextArea.style('background-color', '#e6f3ff');
  tokenizedTextArea.style('color', '#333');
  tokenizedTextArea.style('resize', 'none');
  tokenizedTextArea.style('border', '1px solid #ccc');
  tokenizedTextArea.style('border-radius', '4px');

  tokenizeText(currentInput);
}

function draw() {
  // No continuous drawing needed
}

function handleInput() {
  currentInput = inputTextArea.value();
  tokenizeText(currentInput);
}

function selectSampleText() {
  const selectedValue = sampleTextsDropdown.value();
  if (selectedValue !== '-- Select an Example --') {
    currentInput = sampleTexts[parseInt(selectedValue)];
    inputTextArea.value(currentInput);
    tokenizeText(currentInput);
  } else {
    currentInput = "";
    inputTextArea.value("");
    tokenizeText(currentInput);
  }
}

function updateTokenizationDisplay() {
  tokenizeText(currentInput);
}

function tokenizeText(text) {
  if (text.trim() === "") {
    tokenizedTextArea.value("");
    return;
  }

  // Regex to get initial broad tokens (words, numbers, punctuation, emojis)
  const rawTokens = text.match(/[\w']+|[^\s\w']+/g) || [];
  let tokenizedOutput = "";

  if (showStringTokensCheckbox.checked()) {
    // Display string tokens (as they are from the regex)
    rawTokens.forEach((token) => {
      tokenizedOutput += `"${token}" `;
    });
    tokenizedTextArea.value(tokenizedOutput.trim());
  } else {
    // Display numerical IDs
    const finalTokensForIdGeneration = [];
    for (const rawToken of rawTokens) {
      // If it's a word-like token OR a single character (e.g. basic emoji, punctuation)
      if (rawToken.match(/^[\w']+$/) || rawToken.length === 1) {
        finalTokensForIdGeneration.push(rawToken);
      } else {
        // It's a multi-character, non-word token (e.g., "!!", "🤚🏾")
        // Split it into individual characters for ID generation
        // This simulates breaking down complex graphemes or sequences.
        finalTokensForIdGeneration.push(...rawToken.split(''));
      }
    }

    const idList = [];
    for (const tokenStr of finalTokensForIdGeneration) {
      if (!tokenToIdMap.has(tokenStr)) {
        // Assign a new pseudo-ID if token is not in our "vocabulary"
        // Add nextPseudoIdBase to hash input to further differentiate if simpleHash has collisions for short strings
        tokenToIdMap.set(tokenStr, simpleHash(tokenStr + nextPseudoIdBase));
        nextPseudoIdBase++; // Increment to change hash landscape slightly for next new token
      }
      idList.push(tokenToIdMap.get(tokenStr));
    }
    tokenizedTextArea.value(`[${idList.join(', ')}]`);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('aliceblue');

  inputLabel.position(20, 5);
  inputTextArea.size(windowWidth - 45, 100);
  inputTextArea.position(20, 40);

  dropdownLabel.position(20, 150);
  sampleTextsDropdown.position(20, 185);

  tokenizedLabel.position(20, 220);
  showStringTokensCheckbox.position(20, 245);
  tokenizedTextArea.size(windowWidth - 45, 150);
  tokenizedTextArea.position(20, 275);
}
