let matrix = [
  [
    { p1: 3, p2: 3 },
    { p1: 0, p2: 5 },
  ],
  [
    { p1: 5, p2: 0 },
    { p1: 1, p2: 1 },
  ],
];

function renderMatrix() {
  const table = document.getElementById("matrix-table");
  table.innerHTML = "";

  // Add column headings
  const headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th></th>"; // empty corner cell
  matrix[0].forEach((_, colIndex) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = `B${colIndex + 1}`;
      // Add remove button for last column if more than one column exists
      if (colIndex === matrix[0].length - 1 && matrix[0].length > 1) {
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "×";
          removeBtn.className = "remove-btn";
          removeBtn.onclick = removeColumn;
          removeBtn.title = "Remove last column";
          headerCell.appendChild(removeBtn);
      }
      headerRow.appendChild(headerCell);
  });
  
  // Add column add button
  const addColHeader = document.createElement("th");
  const addColBtn = document.createElement("button");
  addColBtn.textContent = "+";
  addColBtn.className = "add-btn";
  addColBtn.onclick = addColumn;
  addColBtn.title = "Add column";
  addColHeader.appendChild(addColBtn);
  headerRow.appendChild(addColHeader);
  
  table.appendChild(headerRow);

  // Add matrix cells with row headings
  matrix.forEach((row, rowIndex) => {
      const rowElement = document.createElement("tr");

      // Add row heading with remove button for last row
      const rowHeader = document.createElement("th");
      rowHeader.textContent = `A${rowIndex + 1}`;
      if (rowIndex === matrix.length - 1 && matrix.length > 1) {
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "×";
          removeBtn.className = "remove-btn";
          removeBtn.onclick = removeRow;
          removeBtn.title = "Remove last row";
          rowHeader.appendChild(removeBtn);
      }
      rowElement.appendChild(rowHeader);

      row.forEach((cell, colIndex) => {
          const cellElement = document.createElement("td");
          cellElement.innerHTML = `
              <input class="matrix-input p1-input" type="number" placeholder="p1" 
                     value="${cell.p1}" 
                     onchange="updateMatrix(${rowIndex}, ${colIndex}, 'p1', this.value)">
              <input class="matrix-input p2-input" type="number" placeholder="p2" 
                     value="${cell.p2}" 
                     onchange="updateMatrix(${rowIndex}, ${colIndex}, 'p2', this.value)">
          `;
          rowElement.appendChild(cellElement);
      });
      
      // Add empty cell for the add column column
      rowElement.appendChild(document.createElement("td"));
      
      table.appendChild(rowElement);
  });

  // Add row for the add row button
  const addRowElement = document.createElement("tr");
  const addRowHeader = document.createElement("th");
  const addRowBtn = document.createElement("button");
  addRowBtn.textContent = "+";
  addRowBtn.className = "add-btn";
  addRowBtn.onclick = addRow;
  addRowBtn.title = "Add row";
  addRowHeader.appendChild(addRowBtn);
  addRowElement.appendChild(addRowHeader);
  
  // Add empty cells for the rest of the row
  for (let i = 0; i <= matrix[0].length; i++) {
      addRowElement.appendChild(document.createElement("td"));
  }
  
  table.appendChild(addRowElement);
}

function updateMatrix(row, col, player, value) {
  if (player === "p1") {
    matrix[row][col].p1 = Number(value);
  } else if (player === "p2") {
    matrix[row][col].p2 = Number(value);
  }
}

function addRow() {
  const numCols = matrix[0].length;
  const newRow = Array.from({ length: numCols }, () => ({ p1: 0, p2: 0 }));
  matrix.push(newRow);
  renderMatrix();
}

function addColumn() {
  matrix.forEach((row) => row.push({ p1: 0, p2: 0 }));
  renderMatrix();
}

function removeRow() {
  if (matrix.length <= 1) {
      alert("Cannot remove the last row!");
      return;
  }
  matrix.pop();
  renderMatrix();
}

function removeColumn() {
  if (matrix[0].length <= 1) {
      alert("Cannot remove the last column!");
      return;
  }
  matrix.forEach(row => row.pop());
  renderMatrix();
}

function calculateNashEquilibria() {
  const resultContainer = document.getElementById("result-container");
  let output = "";

  // Calculate pure Nash equilibria
  const pureNashEquilibria = [];
  for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
          const { p1, p2 } = matrix[row][col];

          // Find the maximum payoff for Player 1 in column `col`
          const maxP1InColumn = Math.max(...matrix.map(r => r[col].p1));

          // Find the maximum payoff for Player 2 in row `row`
          const maxP2InRow = Math.max(...matrix[row].map(cell => cell.p2));

          // Check if both players have no incentive to deviate
          if (p1 === maxP1InColumn && p2 === maxP2InRow) {
              pureNashEquilibria.push(`(A${row + 1}, B${col + 1})`);
          }
      }
  }

  output += pureNashEquilibria.length > 0
      ? `Pure Nash Equilibria: ${pureNashEquilibria.join(", ")}`
      : "Pure Nash Equilibria: None";

  // Calculate mixed Nash equilibrium
  const mixedResult = calculateMixedNash();
  
  output += "<br>";
  if (mixedResult.exists) {
      output += "Mixed Nash Equilibria: "
      output += `<br>Player 1 strategy: [A1: ${mixedResult.p.toFixed(3)}, A2: ${(1-mixedResult.p).toFixed(3)}]`;
      output += `<br>Player 2 strategy: [B1: ${mixedResult.q.toFixed(3)}, B2: ${(1-mixedResult.q).toFixed(3)}]`;
      output += `<br>Expected Payoffs: (${mixedResult.expectedPayoffs.player1.toFixed(3)}, ${mixedResult.expectedPayoffs.player2.toFixed(3)})`;
  } else {
      output += mixedResult.message;
  }

  resultContainer.innerHTML = output;
}

// Function to calculate mixed Nash equilibrium probabilities
function calculateMixedNash() {
  // Check if matrix is 2x2
  if (matrix.length !== 2 || matrix[0].length !== 2) {
      return { exists: false, message: "Mixed strategy calculation only available for 2x2 games" };
  }

  // Extract payoffs
  const a11 = matrix[0][0].p1, a12 = matrix[0][1].p1;
  const a21 = matrix[1][0].p1, a22 = matrix[1][1].p1;
  
  const b11 = matrix[0][0].p2, b12 = matrix[0][1].p2;
  const b21 = matrix[1][0].p2, b22 = matrix[1][1].p2;

  // Calculate q (probability of Player 2 playing B1)
  // For Player 1 to be indifferent: q*a11 + (1-q)*a12 = q*a21 + (1-q)*a22
  const qDenom = (a11 - a12 - a21 + a22);
  if (Math.abs(qDenom) < 1e-10) {
      return { exists: false, message: "No mixed strategy equilibrium exists" };
  }
  const q = (a22 - a12) / qDenom;

  // Calculate p (probability of Player 1 playing A1)
  // For Player 2 to be indifferent: p*b11 + (1-p)*b21 = p*b12 + (1-p)*b22
  const pDenom = (b11 - b12 - b21 + b22);
  if (Math.abs(pDenom) < 1e-10) {
      return { exists: false, message: "No mixed strategy equilibrium exists" };
  }
  const p = (b22 - b21) / pDenom;

  // Check if probabilities are valid (between 0 and 1)
  if (p < 0 || p > 1 || q < 0 || q > 1) {
      return { exists: false, message: "No mixed strategy equilibrium exists" };
  }

  // Calculate expected payoffs for verification
  const player1Payoff = q * (p*a11 + (1-p)*a21) + (1-q) * (p*a12 + (1-p)*a22);
  const player2Payoff = p * (q*b11 + (1-q)*b12) + (1-p) * (q*b21 + (1-q)*b22);

  return {
      exists: true,
      p,
      q,
      expectedPayoffs: {
          player1: player1Payoff,
          player2: player2Payoff
      }
  };
}

renderMatrix();
