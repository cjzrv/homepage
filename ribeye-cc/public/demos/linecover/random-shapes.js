// Candidates for interactive exploration; the C++ core validates brush fit before use.
// These are not samples from the paper's fixed-area statistical experiment.
export function randomVertices(kind, random = Math.random) {
  const between = (low, high) => Math.floor(low + random() * (high - low + 1));
  if (kind === 'triangle') {
    const vertices = [
      [between(40, 170), between(320, 430)],
      [between(100, 500), between(50, 190)],
      [between(430, 560), between(300, 430)],
    ];
    // Reflect the triangle for variety while staying inside the editable bounds.
    if (random() < .5) for (const p of vertices) p[0] = 600 - p[0];
    if (random() < .5) for (const p of vertices) p[1] = 480 - p[1];
    return vertices;
  }
  if (kind === 'trapezoid') {
    const top = between(50, 180), bottom = between(300, 430);
    return [[between(40, 220), top], [between(380, 560), top],
      [between(380, 560), bottom], [between(40, 220), bottom]];
  }
  throw new Error('shape');
}
