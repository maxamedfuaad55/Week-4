const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");
const opSymbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function format(str) {
  if (str === "Error") return str;
  const [int, dec] = str.split(".");
  const withCommas = Number(int).toLocaleString("en-US");
  const sign = int === "-0" ? "-0" : withCommas;
  return dec !== undefined ? sign + "." + dec : sign;
}

function update() {
  resultEl.textContent = format(current);
  const len = resultEl.textContent.length;
  resultEl.style.fontSize = len > 12 ? "34px" : len > 8 ? "46px" : "64px";
  historyEl.textContent =
    previous !== null && operator ? `${format(previous)} ${opSymbols[operator]}` : "";
  document.querySelectorAll(".op").forEach(b =>
    b.classList.toggle("active", b.dataset.op === operator && !justEvaluated && current === "0" && previous !== null && false)
  );
}

function inputNumber(n) {
  if (justEvaluated) { current = "0"; justEvaluated = false; }
  if (n === "." && current.includes(".")) return;
  if (current === "0" && n !== ".") current = n;
  else if (current.replace(/[-.]/g, "").length < 15) current += n;
  update();
}

function chooseOperator(op) {
  if (operator && previous !== null && !justEvaluated && current !== "") {
    compute();
  }
  previous = current;
  operator = op;
  current = "0";
  justEvaluated = false;
  update();
}

function compute() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let r;
  switch (operator) {
    case "+": r = a + b; break;
    case "-": r = a - b; break;
    case "*": r = a * b; break;
    case "/": r = b === 0 ? "Error" : a / b; break;
  }
  historyEl.textContent = `${format(previous)} ${opSymbols[operator]} ${format(current)} =`;
  current = r === "Error" ? "Error" : String(parseFloat(r.toPrecision(12)));
  previous = null;
  operator = null;
  justEvaluated = true;
  resultEl.textContent = format(current);
}

function equals() {
  compute();
  update();
  if (current !== "Error") historyEl.textContent = historyEl.textContent;
}

function clearAll() {
  current = "0"; previous = null; operator = null; justEvaluated = false;
  update();
}

function backspace() {
  if (justEvaluated || current === "Error") { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
  update();
}

function percent() {
  if (current === "Error") return;
  current = String(parseFloat(current) / 100);
  update();
}

document.querySelector(".keys").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.num !== undefined) inputNumber(b.dataset.num);
  else if (b.dataset.op) chooseOperator(b.dataset.op);
  else if (b.dataset.action === "equals") equals();
  else if (b.dataset.action === "clear") clearAll();
  else if (b.dataset.action === "back") backspace();
  else if (b.dataset.action === "percent") percent();
});

document.addEventListener("keydown", e => {
  if (/\d/.test(e.key) || e.key === ".") inputNumber(e.key);
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape" || e.key.toLowerCase() === "c") clearAll();
  else if (e.key === "%") percent();
});

const themeBtn = document.getElementById("theme");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

update();