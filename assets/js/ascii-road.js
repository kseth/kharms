(() => {
  const roads = document.querySelectorAll('.ascii-road');
  if (!roads.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rows = 10;
  const center = rows - 1;
  let animation;
  let previousTime;
  let distance = 0;

  function draw() {
    const lines = [];

    for (let row = 0; row < rows; row++) {
      const line = Array(center * 2 + 1).fill(' ');

      if (row === 0) {
        line[center] = '.';
      } else {
        line[center - row] = '/';
        line[center + row] = '\\';

        // Project evenly spaced lane markings into perspective. As distance
        // increases, each dash approaches the viewer and grows taller.
        const depth = 9 / (row + 0.7);
        if ((depth + distance) % 2 < 0.7) {
          line[center] = row < 3 ? '.' : '|';
        }
      }

      lines.push(line.join(''));
    }

    const frame = lines.join('\n');
    roads.forEach(road => { road.textContent = frame; });
  }

  function animate(time) {
    if (previousTime === undefined) previousTime = time;
    const elapsed = time - previousTime;

    // Twelve text updates per second are enough for this small animation.
    if (elapsed >= 1000 / 12) {
      distance = (distance + elapsed * 0.0012) % 2;
      previousTime = time;
      draw();
    }

    animation = requestAnimationFrame(animate);
  }

  function updateMotion() {
    cancelAnimationFrame(animation);
    previousTime = undefined;

    if (!reducedMotion.matches && !document.hidden) {
      animation = requestAnimationFrame(animate);
    }
  }

  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  updateMotion();
})();
