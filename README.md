# F1 Race Tracker

A vibe-coded F1 race tracker web app built with SvelteKit that displays race schedules, session results, and stint information for Formula 1 Grand Prix weekends.

## Features

- **Season Selection**: Browse F1 races by year (2023-2026)
- **Race Calendar**: View all Grand Prix with circuit information
- **Session Results**: Track race and sprint races results
- **Stint Visualization**: See tire compound usage throughout each race
- **Persistent State**: Selected season is saved in localStorage
- **Caching**: Data is cached in memory to avoid redundant API calls

## Tech Stack

- **SvelteKit** with Svelte 5 runes + experimental remote functions
- **OpenF1 API** for F1 race data
- **Moment.js** for date formatting

## Developing

```sh
nvm use
npm install
npm run dev
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── Circuit.svelte    # Circuit SVG renderer
│   ├── data.remote.js       # Remote functions for API calls
│   ├── functions.js        # Date formatting utilities
│   └── store.svelte.js     # Cache store for data
└── routes/
    ├── +layout.svelte      # App layout with header
    ├── +page.svelte       # Home page with race calendar
    └── [gp]/
        └── +page.svelte   # GP detail page with results
```
