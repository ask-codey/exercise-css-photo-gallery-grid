// Checks the layout of Trail Photo Club's page: it reads index.html and styles.css the way a browser does,
// then asks each part of the page which grid rules it ended up with.
// Run it with: npm test (run npm install once first). You don't need to change this file.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const read = (file) => (existsSync(path.join(__dirname, file)) ? readFileSync(path.join(__dirname, file), 'utf8') : '');
const html = read('index.html');
const css = read('styles.css');

// A browser loads styles.css through the link line. The checks have no web server, so they add the file to the page
// themselves, after checking that the link line is there.
const { window } = new JSDOM(html);
const { document } = window;
const sheet = document.createElement('style');
sheet.textContent = css;
document.head.append(sheet);

const style = (element) => window.getComputedStyle(element);
const value = (element, property) => style(element).getPropertyValue(property).trim();
const all = (selector) => [...document.querySelectorAll(selector)];
function one(selector) {
  const element = document.querySelector(selector);
  assert.ok(element, `index.html has no ${selector} any more. Keep the page as it is: your work is in styles.css.`);
  return element;
}

const withoutComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '');
const isSet = (text) => text !== '' && text !== 'auto' && text !== 'none' && text !== 'normal';

// How many tracks an item covers in one direction, from what it says: "span 2", "1 / 3", "2 / span 2" or "3 / -1"
// in grid-column (or grid-row), in grid-column-start and grid-column-end, or in grid-area.
function tracksCovered(element, direction) {
  const areaParts = value(element, 'grid-area').split('/').map((part) => part.trim());
  let start = value(element, `grid-${direction}-start`) || 'auto';
  let end = value(element, `grid-${direction}-end`) || 'auto';
  const shorthand = value(element, `grid-${direction}`);
  if (isSet(shorthand)) {
    [start, end = 'auto'] = shorthand.split('/').map((part) => part.trim());
  } else if (areaParts.length === 4) {
    [start, end] = direction === 'row' ? [areaParts[0], areaParts[2]] : [areaParts[1], areaParts[3]];
  }
  const span = (text) => (text.match(/^span\s+(\d+)$/) || [])[1];
  if (span(end)) return Number(span(end));
  if (span(start)) return Number(span(start));
  const [a, b] = [Number(start), Number(end)];
  if (Number.isInteger(a) && Number.isInteger(b) && a > 0 && b > 0) return Math.abs(b - a);
  if ((Number.isInteger(a) || start === 'auto') && end === 'auto') return 1;
  return 0;
}

// The drawing in grid-template-areas, as rows of names: "header header" "sidebar main" gives
// [["header", "header"], ["sidebar", "main"]].
function drawing(element) {
  const areas = value(element, 'grid-template-areas');
  return [...areas.matchAll(/"([^"]*)"|'([^']*)'/g)].map((m) => (m[1] ?? m[2]).trim().split(/\s+/));
}

test('the page still links styles.css', () => {
  assert.ok(document.querySelector('link[rel="stylesheet"][href="styles.css"]'),
    'Keep <link rel="stylesheet" href="styles.css"> in the <head> of index.html.');
});

test('step 1: the page is drawn with grid-template-areas: header, sidebar, main and footer', () => {
  const page = one('.page');
  assert.equal(value(page, 'display'), 'grid', 'Step 1: give .page display: grid.');
  const rows = drawing(page);
  assert.ok(rows.length > 0,
    'Step 1: draw the page on .page with grid-template-areas, one quoted string per row, such as "header header".');
  const widths = new Set(rows.map((row) => row.length));
  assert.equal(widths.size, 1,
    `Every row of the drawing needs the same number of cells, but yours have ${[...widths].join(' and ')}. A browser ignores a drawing like that.`);
  for (const name of ['header', 'sidebar', 'main', 'footer']) {
    assert.ok(rows.some((row) => row.includes(name)), `Step 1: the drawing has no area named ${name}.`);
  }
  assert.ok(rows[0].every((cell) => cell === 'header'), 'The header covers the whole top row: write header in every cell of the first string.');
  assert.ok(rows.at(-1).every((cell) => cell === 'footer'), 'The footer covers the whole bottom row: write footer in every cell of the last string.');
  assert.ok(rows.some((row) => row.includes('sidebar') && row.includes('main')),
    'The sidebar and the main content sit side by side, in the same row of the drawing.');

  const parts = { header: '.page > header', sidebar: '.page > aside', main: '.page > main', footer: '.page > footer' };
  for (const [name, selector] of Object.entries(parts)) {
    assert.equal(value(one(selector), 'grid-area'), name,
      `Put ${selector.replace('.page > ', '<')}> in its area: give it grid-area: ${name}.`);
  }
});

test('step 2: the gallery fits as many columns as there is room for', () => {
  const gallery = one('.gallery');
  assert.equal(value(gallery, 'display'), 'grid', 'Step 2: give .gallery display: grid.');
  const columns = value(gallery, 'grid-template-columns').replace(/\s+/g, '');
  assert.match(columns, /^repeat\(auto-fit,minmax\(.+,1fr\)\)$/,
    `The gallery's columns are "${value(gallery, 'grid-template-columns')}". Let the browser count them with repeat() and auto-fit, and give each column a smallest and a largest size with minmax().`);
  assert.ok(isSet(value(gallery, 'gap')) || isSet(value(gallery, 'column-gap')),
    'Give the gallery a gap, so the photos don\'t touch.');
});

test('step 2: the gallery\'s rows all have one height', () => {
  const gallery = one('.gallery');
  assert.ok(isSet(value(gallery, 'grid-auto-rows')),
    'The gallery never writes its rows, so they are the implicit grid. Give them all one height, such as 12rem.');
});

test('step 3: the photo of the month is two columns wide and two rows tall', () => {
  const featured = one('.featured');
  assert.equal(tracksCovered(featured, 'column'), 2,
    `Step 3: .featured covers ${tracksCovered(featured, 'column')} column(s) so far. Make it two columns wide: span counts tracks, or a range of lines says where it starts and ends.`);
  assert.equal(tracksCovered(featured, 'row'), 2,
    `Step 3: .featured covers ${tracksCovered(featured, 'row')} row(s) so far. Make it two rows tall, the same way you made it two columns wide.`);
});

test('step 4: the members\' picks line up with subgrid', () => {
  const picks = one('.picks');
  assert.equal(value(picks, 'display'), 'grid', 'Step 4: make .picks a grid, so the cards sit in columns.');
  assert.ok(isSet(value(picks, 'grid-template-columns')), 'Step 4: give .picks its columns with grid-template-columns.');
  const cards = all('.pick');
  assert.ok(cards.length > 0, 'Keep the four cards, <article class="pick">.');
  for (const card of cards) {
    assert.equal(value(card, 'display'), 'grid', 'Step 4: each .pick is a grid too, so it can use its parent\'s rows.');
    assert.equal(value(card, 'grid-template-rows'), 'subgrid',
      'Step 4: each .pick should use the rows of .picks instead of making its own. Which value of grid-template-rows does that?');
    assert.equal(tracksCovered(card, 'row'), card.children.length,
      `A card has ${card.children.length} parts (a photo, a title, a caption and the stats), so it spans ${card.children.length} rows of .picks: grid-row: span ${card.children.length}.`);
  }
});

test('no media queries: the grids fit the width by themselves', () => {
  assert.doesNotMatch(withoutComments(css), /@media/i,
    'styles.css has an @media rule. This page needs none: auto-fit and minmax() fit the gallery to any width.');
});
