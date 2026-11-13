# Exercise: A Photo Gallery Grid

Exercise code for the lesson **Exercise: A Photo Gallery Grid** in the CSS in Depth course on [ask-codey.com](https://www.ask-codey.com).

Trail Photo Club, a hiking club, has a page full of trail photos and no layout yet: everything stacks in one long column. You'll lay it out with CSS Grid in `styles.css`: the page drawn as named areas, a gallery that fits itself to any width, a big photo of the month, and members' picks whose parts line up across the row with subgrid. Tests check every step.

## Before you start

You need VS Code with the Live Server extension, a browser, and Node.js. The lesson **Setup: VS Code, a Browser and Node.js** installs all three.

## What's here

- `index.html`: the club's page, with every class the steps need. Ready to use: you don't need to change it.
- `styles.css`: the page's look (colors, fonts, the header's links, the captions on the photos) is ready. The four layout steps at the bottom are for you to finish.
- `images/`: drawings of trails standing in for photos, free to use. Ready to use.
- `page.test.js`: the tests that check your layout. You don't need to change this file.
- `package.json`: tells `npm` which checking tool the tests use (jsdom, which reads your page the way a browser does). Ready to use.
- `.gitignore`: keeps the downloaded tool out of your copy on GitHub. Ready to use.

## Run it

Open the folder in VS Code, right-click `index.html` and choose **Open with Live Server**. The page opens in your browser and reloads every time you save.

## Check your work

Open VS Code's terminal (**Terminal > New Terminal**). The first time only, download the checking tool:

```bash
npm install
```

Then run the tests, as often as you like:

```bash
npm test
```

At first 5 of the 7 tests fail: that is expected. The other two check that the page still links `styles.css` and that there's no `@media` rule, and they should stay green. A failing test's message says which step it checks and what it found.

## What to do

1. **The page.** Make `.page` a grid with two columns, a sidebar about 16rem wide and the main content taking the rest. Draw it with `grid-template-areas`: the header across the top row, the sidebar and the main content side by side, the footer across the bottom row. Name the areas `header`, `sidebar`, `main` and `footer`, and put each part in its area with `grid-area` (the parts are `.page > header`, `.page > aside`, `.page > main` and `.page > footer`).
2. **The gallery.** Make `.gallery` a grid that fits as many columns as there is room for, each at least 14rem wide, stretching to fill the row. Give it a gap, and give its rows one height with `grid-auto-rows` (12rem looks good).
3. **The photo of the month.** Make `.featured` two columns wide and two rows tall.
4. **The members' picks.** Make `.picks` a grid of columns at least 14rem wide. Then make each `.pick` card a subgrid, so the titles, the captions and the stats line up across each row of cards, however long their text is.

## The rules

- Keep `index.html` as it is: every change goes in `styles.css`.
- No `@media` rules. The gallery should fit any width by itself.
- No fixed heights on the cards' titles or captions: subgrid lines them up.

## Tips

- **Turn on the grid overlay.** In the developer tools, click the `grid` badge beside `.page`, `.gallery` or `.picks` in the **Elements** panel (Firefox: **Inspector**), and tick **Show area names** or **Show line numbers** in the **Layout** pane.
- **Draw the page on paper first.** Two columns, three rows: write a name in each of the six cells, then copy your drawing into `grid-template-areas`, one quoted string per row.
- **Read the gallery's columns piece by piece.** At least 14rem, at most one share of the space; as many as fit.
- **Count each card's parts.** A pick has a photo, a title, a caption and the stats. It covers one row of `.picks` for each.
- **Make the window narrow and wide.** The gallery should drop from four columns to three and then two as you drag. (On a window narrower than two columns, the photo of the month makes the page wider than the screen; Module 4 shows how to handle that.)

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Page Online for Free* walks through every screen.
