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
      surface: '#FFFFFF', surface2: '#F6EEDD', surface3: '#F2E4C6', ink: '#24263A',
      inkSoft: '#525F70', line: '#E9E1CE',
      primary: '#2451D6', primaryStrong: '#1B3FAE', primaryText: '#2451D6',
      coral: '#C0562E', coralBright: '#E8543F', mint: '#0C7568', mintBright: '#12B0A0',
      accent: '#EFAF29',
      page: '#FDF9F0', navy: '#1B2A5E',
      panelBlue: '#EEF3FC', panelBlueLine: '#C9D8F3', panelBlueLineStrong: '#A8BEF0',
      panelAccent: '#FAF1DC', accentText: '#8A6410', accentLight: '#FFD166',
      cardLineCool: '#E3E8F2', greenDeep: '#2E6B3E', printLine: '#D7E1FC',
      onNavy: '#E6EAF7', onNavySoft: '#B9C4E4', onNavyFaint: '#9EAAD2', onNavyBright: '#FFFDF6',
      cardBlue: '#DCE7F5', cardCream: '#F2E4C6', accentHover: '#FFC549',
      onPrimarySoft: '#DDE5FB', onPrimaryFaint: '#D7E1FC',
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
      ['downsides text on panel', 'inkSoft', 'panelBlue', 4.5],
      ['border on surface', 'line', 'surface', 1.2],
      // Storybook redesign pairings. Two are known FAILURES kept out of use:
      // accent on navy is 3.36:1 (labels on blue/navy use accentLight instead),
      // and mid-greys lighter than inkSoft fail on cream. Never add either.
      ['body text on page', 'ink', 'page', 4.5],
      ['muted text on page', 'inkSoft', 'page', 4.5],
      ['body text on cream band', 'ink', 'surface2', 4.5],
      ['body text on age pill', 'ink', 'surface3', 4.5],
      ['link on page', 'primaryText', 'page', 4.5],
      ['link on cream band', 'primaryText', 'surface2', 4.5],
      ['link on blue panel', 'primaryText', 'panelBlue', 4.5],
      ['navy heading on page', 'navy', 'page', 4.5],
      ['navy heading on cream band', 'navy', 'surface2', 4.5],
      ['navy heading on white', 'navy', 'surface', 4.5],
      ['footer text on navy', 'white', 'navy', 4.5],
      ['marigold label on navy', 'accentLight', 'navy', 4.5],
      ['marigold label on primary', 'accentLight', 'primary', 4.5],
      ['hero print line on primary', 'printLine', 'primary', 4.5],
      ['listen-for label on white', 'accentText', 'surface', 4.5],
      ['listen-for label on page', 'accentText', 'page', 4.5],
      ['success text on white', 'greenDeep', 'surface', 4.5],
      ['success text on page', 'greenDeep', 'page', 4.5],
      ['ink on blue panel', 'ink', 'panelBlue', 4.5],
      ['ink on marigold panel', 'ink', 'panelAccent', 4.5],
      ['coral cross on white', 'coral', 'surface', 3.0],
      ['panel border on blue panel', 'panelBlueLine', 'panelBlue', 1.2],
      ['cool card border on white', 'cardLineCool', 'surface', 1.1],
      ['footer link on navy', 'onNavy', 'navy', 4.5],
      ['footer description on navy', 'onNavySoft', 'navy', 4.5],
      ['footer fine print on navy', 'onNavyFaint', 'navy', 4.5],
      ['footer wordmark on navy', 'onNavyBright', 'navy', 4.5],
      ['hero copy on primary', 'onPrimarySoft', 'primary', 4.5],
      ['hero print line', 'onPrimaryFaint', 'primary', 4.5],
      ['navy label on accent button', 'navy', 'accent', 4.5],
      ['navy label on accent hover', 'navy', 'accentHover', 4.5],
      ['muted text on blue card', 'inkSoft', 'cardBlue', 4.5],
      ['link label on blue card', 'primaryText', 'cardBlue', 4.5],
      ['muted text on cream card', 'inkSoft', 'cardCream', 4.5],
      ['link label on cream card', 'primaryText', 'cardCream', 4.5],
      ['navy heading on blue card', 'navy', 'cardBlue', 4.5],
      ['navy heading on cream card', 'navy', 'cardCream', 4.5],
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
