// Hand Pose Painting with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let painting;
let px = 0;
let py = 0;
let targetX, targetY; // 目標點座標
let score = 0; // 玩家得分
let timer = 60; // 遊戲時間（秒）

function preload() {
  // Initialize HandPose model without flipped video input
  handPose = ml5.handPose(video, { flipped: false }, modelReady);
}

function modelReady() {
  console.log("HandPose model loaded!");
  handPose.on('predict', gotHands); // Listen for predictions
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);

  // Create an off-screen graphics buffer for painting
  painting = createGraphics(640, 480);
  painting.clear();

  // Capture video without flipping
  video = createCapture(VIDEO, { flipped: false });
  video.hide();

  // 初始化目標點
  generateTarget();

  // 設定計時器
  setInterval(() => {
    if (timer > 0) timer--;
  }, 1000);
}

function draw() {
  image(video, 0, 0);

  // 繪製目標點
  fill(255, 0, 0);
  noStroke();
  ellipse(targetX, targetY, 20, 20);

  // 繪製玩家得分與剩餘時間
  fill(255);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
  text(`Time: ${timer}s`, 10, 60);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    let hand = hands[0];
    let index = hand.landmarks[8]; // Index finger tip landmark

    if (index) {
      let x = index[0];
      let y = index[1];

      // Initialize previous position if not set
      if (px === 0 && py === 0) {
        px = x;
        py = y;
      }

      // Draw a line from the previous position to the current position
      painting.stroke(255, 255, 0);
      painting.strokeWeight(8);
      painting.line(px, py, x, y);

      // Update previous position
      px = x;
      py = y;

      // 檢測是否碰到目標點
      if (dist(x, y, targetX, targetY) < 10) {
        score++; // 增加得分
        generateTarget(); // 生成新的目標點
      }
    }
  }

  // Overlay painting on top of the video
  image(painting, 0, 0);

  // 遊戲結束邏輯
  if (timer === 0) {
    noLoop(); // 停止繪製
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`Game Over! Your Score: ${score}`, width / 2, height / 2);
  }
}

// 隨機生成目標點
function generateTarget() {
  targetX = random(20, width - 20);
  targetY = random(20, height - 20);
}
