const createElement = (elementName, attrs = {}) => Object.assign(document.createElement(elementName), attrs);
const find = (element) => document.querySelector(element);

const $app = find("#app");
const $canvasContainer = createElement("div", { className: "canvas-container" });
const $canvas = createElement("canvas");
const context = $canvas.getContext("2d");

$canvas.width = 800;
$canvas.height = 500;

$canvasContainer.append($canvas);
$app.append($canvasContainer);

function canvasLine(x, y, width, height) {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeRect(x, y, width, height);
}

const packages = {
  points: [20, 40, 0, 60, 80, 95, 75, 0, 80, 40, 30, 20],
  padding: { left: 10, right: 10, top: 20, bottom: 20 },

  get clientWidth() {
    return $canvas.width - this.padding.left - this.padding.right;
  },

  get clientHeight() {
    return $canvas.height - this.padding.top - this.padding.bottom;
  },

  get gap() {
    return this.clientWidth / (this.points.length - 1);
  },

  get percentLimit() {
    return 100 / Math.max(...this.points);
  },

  get heightLimit() {
    return this.clientHeight / 100;
  },

  getCanvasY(point) {
    const percent = this.percentLimit * point; // 백분율
    return $canvas.height - this.padding.bottom - percent * this.heightLimit;
  },
};

packages.points.reduce((acc, point) => {
  const [positionX, positionY] = [acc, packages.getCanvasY(point)];
  context.beginPath();
  context.arc(positionX, positionY, 3, 0, Math.PI * 2);
  context.fill();

  return acc + packages.gap;
}, packages.padding.left);

context.beginPath();
context.moveTo(packages.padding.left, packages.getCanvasY(packages.points[0]));
packages.points.slice(0, -1).reduce(
  (acc, point, index) => {
    const [positionX, positionY] = [acc.x, packages.getCanvasY(point)];
    const [nextPositionX, nextPositionY] = [acc.x + packages.gap, packages.getCanvasY(packages.points[index + 1])];
    const [middleX, middleY] = [(positionX + nextPositionX) / 2, (positionY + nextPositionY) / 2];
    const [cpX1, cpX2] = [(positionX + middleX) / 2, (middleX + nextPositionX) / 2];

    context.quadraticCurveTo(cpX1, positionY, middleX, middleY);
    context.quadraticCurveTo(cpX2, nextPositionY, nextPositionX, nextPositionY);
    return { x: acc.x + packages.gap };
  },
  { x: packages.padding.left, beforeUp: false }
);
context.stroke();

canvasLine(1, 1, $canvas.width - 2, $canvas.height - 2);
// canvasLine(padding.left, padding.top, canvasClientWidth, canvasClientHeight);
