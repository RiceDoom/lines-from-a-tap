const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlzWpkJU1L2-NKUzn0Hoe08-zIZ4rSTN-5RRneQPhdfMF5zQNUBOA1vG5dv9g3uc-Ue3DsMld6l3vI/pub?gid=0&single=true&output=csv';

let masterLines = []; // 1. Stores the permanent list from Google Sheets
let hat = [];         // 2. Stores only the lines left to be played

async function loadLines() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const text = await response.text();
    
    // Clean and store the master list
    masterLines = text.split('\n')
                      .map(line => line.trim())
                      .filter(line => line.length > 0);
    
    // 3. Clone the master list into our active "hat"
    hat = [...masterLines];
    
    displayRandomLine();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    document.getElementById('line-display').innerText = "Error loading lines.";
  }
}

function displayRandomLine() {
  if (masterLines.length === 0) return;
  
  // 4. If the hat runs completely out of paper, refill it from the master list!
  if (hat.length === 0) {
    hat = [...masterLines];
    console.log("The hat has been refilled with all lines!");
  }
  
  // 5. Pick a random index based on what is *left* in the hat
  const randomIndex = Math.floor(Math.random() * hat.length);
  
  // 6. .splice(index, 1) removes the item from the hat array and returns it
  let selectedLine = hat.splice(randomIndex, 1)[0];
  
  // Clean up surrounding quotes
  if (selectedLine.startsWith('"') && selectedLine.endsWith('"')) {
    selectedLine = selectedLine.slice(1, -1).replace(/""/g, '"');
  }
  
  document.getElementById('line-display').innerText = selectedLine;
}

// Safe Initialization
document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', displayRandomLine);
  loadLines();
});