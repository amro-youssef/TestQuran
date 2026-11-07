/**
 * The verse selection is a list of items:
 *   { type: 'surah', from, to }         a surah, or a run of surahs (from..to)
 *   { type: 'surah', from, to, sv, ev } a single surah narrowed to verses sv..ev
 *   { type: 'juz', from, to }           a juz, or a run of juz
 */
import data from '../../quran_data.json';

export const chapters = data.chapters.map(c => ({
  id: c.id,
  name: c.name_simple,
  verses: c.verses_count,
  label: `${c.id} ${c.name_simple}`,
}));

export const versesIn = (chapter) => chapters[chapter - 1].verses;
export const chapterName = (chapter) => chapters[chapter - 1].name;

// [chapter, verse] where each juz begins
const JUZ_STARTS = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 82], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1],
];
export const JUZ_COUNT = JUZ_STARTS.length;

const juzEnd = (juz) => {
  if (juz === JUZ_COUNT) return [114, versesIn(114)];
  const [c, v] = JUZ_STARTS[juz];
  return v === 1 ? [c - 1, versesIn(c - 1)] : [c, v - 1];
};

let nextId = 1;
export const newItem = (fields) => ({ id: nextId++, type: 'surah', sv: null, ev: null, ...fields });
export const withIds = (items) => items.map(newItem);
export const withoutIds = (items) => items.map(({ id, ...rest }) => rest);

export const isNarrowed = (item) => item.type === 'surah' && item.from === item.to && !!item.sv;

/** Inclusive verse range covered by an item: { sc, sv, ec, ev } */
export const itemRange = (item) => {
  if (item.type === 'juz') {
    const [sc, sv] = JUZ_STARTS[item.from - 1];
    const [ec, ev] = juzEnd(item.to);
    return { sc, sv, ec, ev };
  }
  if (isNarrowed(item)) return { sc: item.from, sv: item.sv, ec: item.from, ev: item.ev };
  return { sc: item.from, sv: 1, ec: item.to, ev: versesIn(item.to) };
};

export const itemLabel = (item) => {
  if (item.type === 'juz') return item.from === item.to ? `Juz ${item.from}` : `Juz ${item.from}–${item.to}`;
  if (item.from !== item.to) return `${chapterName(item.from)} – ${chapterName(item.to)}`;
  return isNarrowed(item) ? `${chapterName(item.from)} ${item.sv}–${item.ev}` : chapterName(item.from);
};

/** "Al-Mulk, Al-'Adiyat – An-Nas and Al-Kahf 1–10" */
export const selectionSummary = (items) => {
  const labels = items.map(itemLabel);
  if (labels.length <= 1) return labels[0] ?? '';
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`;
};

/** Every verse the selection covers, in mushaf order, without duplicates */
export const selectionVerses = (items) => {
  const seen = new Set();
  const verses = [];
  for (const { sc, sv, ec, ev } of items.map(itemRange)) {
    for (let c = sc; c <= ec; c++) {
      const last = c === ec ? ev : versesIn(c);
      for (let v = c === sc ? sv : 1; v <= last; v++) {
        const key = `${c}:${v}`;
        if (seen.has(key)) continue;
        seen.add(key);
        verses.push({ chapterNumber: c, verseNumber: v });
      }
    }
  }
  return verses.sort((a, b) => a.chapterNumber - b.chapterNumber || a.verseNumber - b.verseNumber);
};

export const WHOLE_QURAN = [{ type: 'surah', from: 1, to: 114 }];

/**
 * Compact text form for URLs: "s67,s100-114,s18:1-10,j30"
 * (s = surah or run of surahs, optionally :verses; j = juz or run of juz)
 */
export const encodeSelection = (items) => items.map(item => {
  if (item.type === 'juz') return item.from === item.to ? `j${item.from}` : `j${item.from}-${item.to}`;
  if (isNarrowed(item)) return `s${item.from}:${item.sv}-${item.ev}`;
  return item.from === item.to ? `s${item.from}` : `s${item.from}-${item.to}`;
}).join(',');

export const decodeSelection = (text) => (text ?? '').split(',').map(part => {
  const juz = part.match(/^j(\d+)(?:-(\d+))?$/);
  if (juz) {
    const from = Number(juz[1]), to = Number(juz[2] ?? juz[1]);
    return from >= 1 && to >= from && to <= JUZ_COUNT ? { type: 'juz', from, to } : null;
  }
  const verses = part.match(/^s(\d+):(\d+)-(\d+)$/);
  if (verses) {
    const [c, sv, ev] = verses.slice(1).map(Number);
    return c >= 1 && c <= 114 && sv >= 1 && ev >= sv && ev <= versesIn(c) ? { type: 'surah', from: c, to: c, sv, ev } : null;
  }
  const surahs = part.match(/^s(\d+)(?:-(\d+))?$/);
  if (surahs) {
    const from = Number(surahs[1]), to = Number(surahs[2] ?? surahs[1]);
    return from >= 1 && to >= from && to <= 114 ? { type: 'surah', from, to } : null;
  }
  return null;
}).filter(Boolean);
