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
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  // Add matrix cells with row headings
  matrix.forEach((row, rowIndex) => {
    const rowElement = document.createElement("tr");

    // Add row heading (A1, A2, etc.)
    const rowHeader = document.createElement("th");
    rowHeader.textContent = `A${rowIndex + 1}`;
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
    table.appendChild(rowElement);
  });
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

function calculateNashEquilibria() {
  const pureNashEquilibria = [];
  const resultContainer = document.getElementById("result-container");

  // Calculate pure Nash equilibria as before
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[0].length; col++) {
      const { p1, p2 } = matrix[row][col];

      // Find the maximum payoff for Player 1 in column `col`
      const maxP1InColumn = Math.max(...matrix.map((r) => r[col].p1));

      // Find the maximum payoff for Player 2 in row `row`
      const maxP2InRow = Math.max(...matrix[row].map((cell) => cell.p2));

      // Check if both players have no incentive to deviate
      const isNashEquilibrium = p1 === maxP1InColumn && p2 === maxP2InRow;

      if (isNashEquilibrium) {
        pureNashEquilibria.push(`(A${row + 1}, B${col + 1})`);
      }
    }
  }

  let output =
    pureNashEquilibria.length > 0
      ? `Pure Nash Equilibria: ${pureNashEquilibria.join(", ")}`
      : "Pure Nash Equilibria: None";

  // Calculate mixed Nash equilibrium
  const { p, q, exists } = calculateMixedNash();

  if (exists) {
    output +=
      `<br>Mixed Nash Equilibria: Player 1 - [A1: ${p.toFixed(2)}, A2: ${(
        1 - p
      ).toFixed(2)}], ` +
      `Player 2 - [B1: ${q.toFixed(2)}, B2: ${(1 - q).toFixed(2)}]`;
  } else {
    output += "<br>Mixed Nash Equilibria: None";
  }

  resultContainer.innerHTML = output;
}

// Function to calculate mixed Nash equilibrium probabilities
function calculateMixedNash() {
  const a11 = matrix[0][0].p1,
    a12 = matrix[0][1].p1;
  const a21 = matrix[1][0].p1,
    a22 = matrix[1][1].p1;

  const b11 = matrix[0][0].p2,
    b12 = matrix[0][1].p2;
  const b21 = matrix[1][0].p2,
    b22 = matrix[1][1].p2;

  // Solve for Player 1's mixed strategy (p) where expected payoffs are equal
  const pNumerator = b22 - b12;
  const pDenominator = b11 - b12 - (b21 - b22);
  const p = pDenominator !== 0 ? pNumerator / pDenominator : null;

  // Solve for Player 2's mixed strategy (q) where expected payoffs are equal
  const qNumerator = a22 - a12;
  const qDenominator = a11 - a12 - (a21 - a22);
  const q = qDenominator !== 0 ? qNumerator / qDenominator : null;

  // Check if the probabilities are within the valid range [0, 1]
  const exists =
    p !== null && q !== null && p >= 0 && p <= 1 && q >= 0 && q <= 1;
  return { p, q, exists };
}

renderMatrix();
