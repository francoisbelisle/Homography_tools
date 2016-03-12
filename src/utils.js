const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function markerLabel(index) {
  return LABELS[index];
}

export const PIN_SVG_PATH = [
  'M 0 0',
  'C 0 -5 -10 -15 -10 -20',
  'S -5 -30 0 -30',
  'S 10 -25 10 -20',
  'S 0 -5 0 0',
].join(' ');
