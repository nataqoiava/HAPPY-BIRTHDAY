document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  let particles = [], audioCtx, isPlaying = false;

  window.onresize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#e84393', '#70a1ff'];

  function spawnConfetti() {
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: w / 2, y: h / 2, sz: Math.random() * 8 + 4, c: colors[i % 6],
        vx: (Math.random() - 0.5) * 12, vy: Math.random() * -12 - 6,
        r: Math.random() * 360, rs: (Math.random() - 0.5) * 10, op: 1
      });
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, w, h);
    particles = particles.filter(p => p.op > 0);
    particles.forEach(p => {
      p.vx *= 0.98; p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.r += p.rs; p.op -= 0.008;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.r * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.op);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz);
      ctx.restore();
    });
    requestAnimationFrame(loop);
  })();

  const confettiBtn = document.getElementById('confetti-btn');
  if (confettiBtn) confettiBtn.onclick = spawnConfetti;
  setTimeout(spawnConfetti, 300);

  const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25 };
  const melody = [['C4',.75],['C4',.25],['D4',1],['C4',1],['F4',1],['E4',2],['C4',.75],['C4',.25],['D4',1],['C4',1],['G4',1],['F4',2],['C4',.75],['C4',.25],['C5',1],['A4',1],['F4',1],['E4',1],['D4',1],['B4',.75],['B4',.25],['A4',1],['F4',1],['G4',1],['F4',2]];

  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.onclick = function() {
      if (isPlaying) return;
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      isPlaying = true;
      this.textContent = '🎶 Playing...';
      
      let t = audioCtx.currentTime;
      melody.forEach(([note, dur]) => {
        let osc = audioCtx.createOscillator(), g = audioCtx.createGain(), d = dur * 0.5;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(N[note], t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + d);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t); osc.stop(t + d);
        t += d;
      });

      setTimeout(() => { isPlaying = false; this.textContent = '🎵 Play Song'; }, (t - audioCtx.currentTime) * 1000);
    };
  }
});