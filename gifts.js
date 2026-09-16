document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  if (!container) return;


  const availableNumbers = Array.from({ length: 8 }, (_, i) => i + 1);
  availableNumbers.sort(() => Math.random() - 0.5);

  for (let i = 0; i < 8; i++) {
    const box = document.createElement('div');
    box.className = 'gift-box';
    box.textContent = '🎁';

    box.onclick = function() {
      if (!this.classList.contains('opened') && availableNumbers.length > 0) {
        const uniqueNumber = availableNumbers.pop();
        this.textContent = uniqueNumber;
        this.classList.add('opened');
      }
    };
    container.appendChild(box);
  }
});
