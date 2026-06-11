// 1. Your published Google Sheets CSV URL
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlzWpkJU1L2-NKUzn0Hoe08-zIZ4rSTN-5RRneQPhdfMF5zQNUBOA1vG5dv9g3uc-Ue3DsMld6l3vI/pub?gid=0&single=true&output=csv';

let lines = [];

// 2. Fetch the data from the Google Sheet
async function loadLines() {
  try {
    const response = await fetch(SHEET_URL);
    
    // Check if the server actually returned a 200 OK response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Break the CSV text into an array of lines
    lines = text.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);
    
    // Display the first random line once data is loaded
    displayRandomLine();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    document.getElementById('line-display').innerText = "Error loading lines. Check console for details.";
  }
}

// 3. Pick and display a random line
function displayRandomLine() {
  if (lines.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * lines.length);
  let selectedLine = lines[randomIndex];
  
  // Clean up surrounding quotes
  if (selectedLine.startsWith('"') && selectedLine.endsWith('"')) {
    selectedLine = selectedLine.slice(1, -1).replace(/""/g, '"');
  }
  
  document.getElementById('line-display').innerText = selectedLine;
}

// 4. Safe Initialization: Wait until the HTML DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.getElementById('next-btn');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', displayRandomLine);
  } else {
    console.error("Could not find an element with id='next-btn' in your HTML.");
  }

  // Kick off the sheet fetch
  loadLines();
});