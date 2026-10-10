const display = document.getElementById('display');
const history = document.getElementById('history');
const histList = document.getElementById('histList');
const histPanel = document.getElementById('histPanel');
const paymentNotice = document.getElementById('paymentNotice');
const closePaymentNotice = document.getElementById('closePaymentNotice');

let currentInput = '';
let previousInput = '';
let operator = '';
let histories = [];

function animateDisplay() {
  display.classList.remove('pop');
  void display.offsetWidth;
  display.classList.add('pop');
}

document.querySelectorAll('.keys button').forEach((btn) => {
  if (btn.classList.contains('history-btn')) return;

  btn.addEventListener('click', () => {
    const value = btn.innerText;

    if (!isNaN(value) || value === '.') {
      if (value === '.' && currentInput.includes('.')) return;
      currentInput += value;
      display.innerText = currentInput;
      animateDisplay();
      return;
    }

    if (['+', '−', '×', '÷'].includes(value)) {
      if (currentInput === '') return;
      if (previousInput && operator) previousInput = calculate(previousInput, currentInput, operator).toString();
      else previousInput = currentInput;
      operator = value;
      history.innerText = previousInput + ' ' + operator;
      currentInput = '';
      display.innerText = '0';
      return;
    }

    if (value === '=') {
      if (operator && currentInput && previousInput) {
        paymentNotice.hidden = false;
        closePaymentNotice.focus();
      }
      return;
    }

    if (value === 'C') {
      currentInput = '';
      previousInput = '';
      operator = '';
      display.innerText = '0';
      history.innerText = '';
    }

    if (value === '⌫') {
      currentInput = currentInput.slice(0, -1);
      display.innerText = currentInput || '0';
    }
  });
});

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? 'Error' : +(a / b).toFixed(6);
    default:
      return 0;
  }
}

function toggleHist() {
  histPanel.style.display = histPanel.style.display === 'none' ? 'block' : 'none';
}

function addToHistory(text) {
  histories.unshift(text);
  if (histories.length > 10) histories.pop();
  renderHist();
}

function renderHist() {
  if (histories.length === 0) {
    histList.innerHTML = '<div class="hist-item">Belum ada riwayat</div>';
    return;
  }

  histList.innerHTML = histories.map((h) => `<div class="hist-item">${h}</div>`).join('');
}

function clearHist() {
  histories = [];
  renderHist();
}

function hidePaymentNotice() {
  paymentNotice.hidden = true;
}

closePaymentNotice.addEventListener('click', hidePaymentNotice);

paymentNotice.addEventListener('click', (event) => {
  if (event.target === paymentNotice) hidePaymentNotice();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !paymentNotice.hidden) hidePaymentNotice();
});

window.toggleHist = toggleHist;
window.clearHist = clearHist;
