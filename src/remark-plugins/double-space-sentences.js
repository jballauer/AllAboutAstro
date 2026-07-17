// Inserts a second, non-breaking space after sentence-ending punctuation so the
// "double-space after a period" look survives HTML's whitespace collapsing.
// Skips common abbreviations and single-letter tokens (initials, "U.S.") so it
// doesn't widen the gap mid-abbreviation.

const ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'jr', 'sr', 'vs', 'etc', 'inc', 'co', 'ltd',
  'no', 'fig', 'figs', 'vol', 'st', 'ave', 'blvd', 'approx', 'ca',
  'pp', 'ed', 'eds', 'al', 'univ', 'dept', 'govt', 'assn', 'mfg', 'corp',
]);

const NBSP = ' ';
const SENTENCE_BOUNDARY = /(\w+)([.!?]) (?=[A-Z0-9"'(])/g;

function doubleSpaceText(value) {
  return value.replace(SENTENCE_BOUNDARY, (match, word, punct) => {
    if (word.length <= 1) return match;
    if (ABBREVIATIONS.has(word.toLowerCase())) return match;
    return word + punct + ' ' + NBSP;
  });
}

function walk(node) {
  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = doubleSpaceText(node.value);
    return;
  }
  if (Array.isArray(node.children)) {
    node.children.forEach(walk);
  }
}

export default function remarkDoubleSpaceSentences() {
  return (tree) => {
    walk(tree);
  };
}
