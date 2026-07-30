const relationshipStart = new Date("2024-04-07T00:00:00");
const dayMs = 24 * 60 * 60 * 1000;

function daysTogether() {
  return Math.max(0, Math.floor((Date.now() - relationshipStart.getTime()) / dayMs));
}

function setDayCounters() {
  const days = daysTogether().toLocaleString();
  document.querySelectorAll("#days-together, #timeline-days, #surprise-days").forEach((element) => {
    element.textContent = days;
  });
}

function setupLetter() {
  const button = document.querySelector("#open-letter");
  const letter = document.querySelector("#love-letter");

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    letter.hidden = isOpen;
    button.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(!isOpen));
  });
}

function setupReasonCards() {
  document.querySelectorAll(".reason-card").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
  });
}

function setupGallery() {
  document.querySelectorAll(".photo-frame").forEach((frame) => {
    const input = frame.querySelector("input");
    const image = frame.querySelector("img");

    input.addEventListener("change", () => {
      const [file] = input.files;
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        image.src = reader.result;
        frame.classList.add("has-image");
      });
      reader.readAsDataURL(file);
    });
  });
}

function setupSurprise() {
  const button = document.querySelector("#reveal-surprise");
  const prompt = document.querySelector("#surprise-prompt");
  const message = document.querySelector("#surprise-message");

  button.addEventListener("click", () => {
    prompt.hidden = true;
    message.hidden = false;
    burstHearts();
  });
}

let musicOn = false;

function setupMusic() {
  const button = document.querySelector("#music-toggle");
  const icon = button.querySelector(".music-icon");
  const label = button.querySelector("span:last-child");
  const song = document.querySelector("#background-song");
  song.volume = 0.45;

  button.addEventListener("click", async () => {
    if (musicOn) {
      song.pause();
      musicOn = false;
      button.setAttribute("aria-pressed", "false");
      icon.textContent = "♪";
      label.textContent = "Play music";
      return;
    }

    try {
      await song.play();
      musicOn = true;
      button.setAttribute("aria-pressed", "true");
      icon.textContent = "♫";
      label.textContent = "Music on";
    } catch {
      label.textContent = "Unable to play";
    }
  });
}

const canvas = document.querySelector("#heart-canvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let animationFrame;

function resizeCanvas() {
  const scale = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
}

function newHeart(isBurst = false) {
  return {
    x: Math.random() * canvas.width,
    y: isBurst ? canvas.height * (0.5 + Math.random() * 0.4) : Math.random() * canvas.height,
    size: (8 + Math.random() * 13) * (window.devicePixelRatio || 1),
    speed: (0.28 + Math.random() * 0.65) * (window.devicePixelRatio || 1),
    drift: (Math.random() - 0.5) * 0.32,
    phase: Math.random() * Math.PI * 2,
    opacity: 0.22 + Math.random() * 0.35,
  };
}

function drawHeart(context, x, y, size) {
  context.beginPath();
  context.moveTo(x, y + size * 0.25);
  context.bezierCurveTo(x, y, x - size * 0.55, y, x - size * 0.55, y + size * 0.3);
  context.bezierCurveTo(x - size * 0.55, y + size * 0.65, x, y + size * 0.8, x, y + size);
  context.bezierCurveTo(x, y + size * 0.8, x + size * 0.55, y + size * 0.65, x + size * 0.55, y + size * 0.3);
  context.bezierCurveTo(x + size * 0.55, y, x, y, x, y + size * 0.25);
  context.fill();
}

function animateHearts() {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((heart, index) => {
    heart.y += heart.speed;
    heart.x += heart.drift + Math.sin(heart.phase + heart.y / 90) * 0.25;
    if (heart.y > canvas.height + heart.size) particles[index] = newHeart();
    context.save();
    context.globalAlpha = heart.opacity;
    context.fillStyle = "#d96a84";
    drawHeart(context, heart.x, heart.y, heart.size);
    context.restore();
  });
  animationFrame = window.requestAnimationFrame(animateHearts);
}

function burstHearts() {
  if (reducedMotion) return;
  particles.push(...Array.from({ length: 18 }, () => newHeart(true)));
  window.setTimeout(() => { particles = particles.slice(-24); }, 3000);
}

function startHearts() {
  if (reducedMotion) return;
  resizeCanvas();
  particles = Array.from({ length: 24 }, newHeart);
  animateHearts();
  window.addEventListener("resize", resizeCanvas);
}

document.addEventListener("DOMContentLoaded", () => {
  setDayCounters();
  setupLetter();
  setupReasonCards();
  setupGallery();
  setupSurprise();
  setupMusic();
  startHearts();
});

window.addEventListener("beforeunload", () => {
  window.cancelAnimationFrame(animationFrame);
});
