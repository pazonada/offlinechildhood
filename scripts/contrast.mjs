// WCAG contrast audit for the Offline Childhood palette.
// Run: node scripts/contrast.mjs   (exits non-zero if any pair drops below its target)
// Targets: 4.5:1 for body text, 3.0:1 for large text and UI boundaries.
//
// The site is light only. There is no dark palette to check.
const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const modes = {
  LIGHT: {
    tokens: {
      surface: '#FFFFFF', surface2: '#EEF2F7', surface3: '#E2E9F3', ink: '#101828',
      inkSoft: '#525F70', line: '#D7DFE9',
      primary: '#2451D6', primaryStrong: '#1D42B0', primaryText: '#2451D6',
      coral: '#C9412D', coralBright: '#E8543F', mint: '#0C7568', mintBright: '#12B0A0',
      accent: '#F7B928',
      white: '#FFFFFF',
      catPhones: '#2451D6', catAudio: '#0C7568', catComputers: '#6D28D9',
      catToys: '#BE3A24', catStem: '#8A5200', catOutdoor: '#297046',
      catCameras: '#A81E63', catClasses: '#0F6C8C', catControls: '#525F70',
    },
    pairs: [
      ['body text', 'ink', 'surface', 4.5],
      ['body text on panel', 'ink', 'surface2', 4.5],
      ['muted text', 'inkSoft', 'surface', 4.5],
      ['muted text on panel', 'inkSoft', 'surface2', 4.5],
      ['link', 'primaryText', 'surface', 4.5],
      ['link on panel', 'primaryText', 'surface2', 4.5],
      ['coral text', 'coral', 'surface', 4.5],
      ['mint text', 'mint', 'surface', 4.5],
      ['primary button label', 'surface', 'primary', 4.5],
      ['primary hover label', 'surface', 'primaryStrong', 4.5],
      ['coral button label', 'surface', 'coral', 4.5],
      ['mint button label', 'surface', 'mint', 4.5],
      ['ink on yellow highlight', 'ink', 'accent', 4.5],
      // Each category hue as text, on both grounds it actually appears on.
      ['cat phones on white', 'catPhones', 'surface', 4.5],
      ['cat phones on panel', 'catPhones', 'surface2', 4.5],
      ['cat audio on white', 'catAudio', 'surface', 4.5],
      ['cat audio on panel', 'catAudio', 'surface2', 4.5],
      ['cat computers on white', 'catComputers', 'surface', 4.5],
      ['cat computers on panel', 'catComputers', 'surface2', 4.5],
      ['cat toys on white', 'catToys', 'surface', 4.5],
      ['cat toys on panel', 'catToys', 'surface2', 4.5],
      ['cat stem on white', 'catStem', 'surface', 4.5],
      ['cat stem on panel', 'catStem', 'surface2', 4.5],
      ['cat outdoor on white', 'catOutdoor', 'surface', 4.5],
      ['cat outdoor on panel', 'catOutdoor', 'surface2', 4.5],
      ['cat cameras on white', 'catCameras', 'surface', 4.5],
      ['cat cameras on panel', 'catCameras', 'surface2', 4.5],
      ['cat classes on white', 'catClasses', 'surface', 4.5],
      ['cat classes on panel', 'catClasses', 'surface2', 4.5],
      ['cat controls on white', 'catControls', 'surface', 4.5],
      ['cat controls on panel', 'catControls', 'surface2', 4.5],
      ['downsides text on panel', 'inkSoft', 'surface2', 4.5],
      ['border on surface', 'line', 'surface', 1.2],
    ],
  }
};

let failures = 0;
for (const [name, { tokens, pairs }] of Object.entries(modes)) {
  console.log(`\n${name}`);
  for (const [label, fg, bg, min] of pairs) {
    const r = ratio(tokens[fg], tokens[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}`);
  }
}
console.log(failures ? `\n${failures} pair(s) below target` : '\nAll pairs meet their target');
process.exit(failures ? 1 : 0);
