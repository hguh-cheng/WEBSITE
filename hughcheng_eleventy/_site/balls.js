const balls = [];
const adjacentPairs = []; // Store pairs of adjacent dots
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const maxRepelDistance = 30; // Max repulsion distance for dots
const ballSize = 10; // Size of each ball
const spacing = 15; // Spacing between dots
const neighborRadius = spacing * 1.5; // Define what counts as "neighboring"

// Resize canvas to fit window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

// Draw "GUHH" in canvas to get points (but not render it)
function getTextShapePoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 209px sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Calculate scaling factor to ensure the text fits within the window
  const text = "HUGH";
  let fontSize = Math.min(canvas.width / text.length, 209); // Adjust font size to fit within window width
  ctx.font = `bold ${fontSize}px sans-serif`;

  // Calculate offsets to center the text
  const textWidth = ctx.measureText(text).width;
  const xOffset = canvas.width / 2;
  const yOffset = canvas.height / 2;

  // Draw the text
  ctx.fillText(text, xOffset, yOffset);

  // Extract pixel data from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Get positions of the "HUGH CHENG" shape and return them
  const points = [];
  for (let y = 0; y < canvas.height; y += spacing) {
    for (let x = 0; x < canvas.width; x += spacing) {
      const index = (y * canvas.width + x) * 4;

      // If the pixel is not transparent (i.e., part of the text)
      if (data[index + 3] > 128) {
        points.push({ x, y });
      }
    }
  }

  return points;
}

// Create a ball element for each point and register adjacency
function createBallsFromPoints(points) {
  points.forEach((point, index) => {
    const ball = {
      originalX: point.x,
      originalY: point.y,
      currentX: point.x,
      currentY: point.y,
      element: createBallElement(point.x, point.y),
    };
    balls.push(ball);
    document.body.appendChild(ball.element);
  });

  // Now that all balls are created, we can find neighboring dots
  findAdjacentDots();
}

// Create a ball (dot) element
function createBallElement(x, y) {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  return ball;
}

// Find neighboring dots for each ball
function findAdjacentDots() {
  balls.forEach((ball1, index1) => {
    balls.forEach((ball2, index2) => {
      if (index1 !== index2) {
        const dx = ball1.originalX - ball2.originalX;
        const dy = ball1.originalY - ball2.originalY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If the distance between two dots is less than neighborRadius, they are adjacent
        if (dist <= neighborRadius) {
          adjacentPairs.push([ball1, ball2]);
        }
      }
    });
  });
}

// Move balls away from the cursor and update their positions
document.addEventListener("mousemove", (e) => {
  balls.forEach((ball) => {
    const dx = e.clientX - ball.originalX;
    const dy = e.clientY - ball.originalY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      // Define the distance threshold for repelling
      const angle = Math.atan2(dy, dx);
      const repelDistance = Math.min((150 - dist) / 5, maxRepelDistance); // Max repel of 30px
      const newX = ball.originalX + Math.cos(angle) * -repelDistance;
      const newY = ball.originalY + Math.sin(angle) * -repelDistance;
      ball.currentX = newX;
      ball.currentY = newY;
      ball.element.style.transform = `translate(${
        Math.cos(angle) * -repelDistance
      }px, ${Math.sin(angle) * -repelDistance}px)`;
    } else {
      // Return to original position
      ball.currentX = ball.originalX;
      ball.currentY = ball.originalY;
      ball.element.style.transform = "translate(0, 0)";
    }
  });

  // Draw trampoline-like lines between adjacent balls
  drawLines();
});

// Draw lines between neighboring balls
function drawLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;

  adjacentPairs.forEach((pair) => {
    const [ball1, ball2] = pair;
    ctx.beginPath();
    ctx.moveTo(ball1.currentX + ballSize / 2, ball1.currentY + ballSize / 2);
    ctx.lineTo(ball2.currentX + ballSize / 2, ball2.currentY + ballSize / 2);
    ctx.stroke();
  });
}

// Initialize
function init() {
  const points = getTextShapePoints(); // Get points that form the shape of "GUHH"
  createBallsFromPoints(points); // Create balls from those points
  drawLines(); // Draw the initial lines between adjacent balls
}

// Run initialization when the window loads
window.onload = init;

// Adjust canvas on window resize
window.addEventListener("resize", () => {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on resize
  balls.forEach((ball) => {
    ball.element.remove(); // Remove existing ball elements
  });
  balls.length = 0; // Clear the balls array
  adjacentPairs.length = 0; // Clear the adjacent pairs array
  init(); // Reinitialize the balls and lines
});
