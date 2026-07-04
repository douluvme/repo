# KOSPI Dashboard

A live dashboard for monitoring the KOSPI (Korea Composite Stock Price Index, `^KS11`).

## Features

- Current index price, daily change, day high/low, 52-week high/low, and volume
- Historical price chart with selectable ranges (1D / 1M / 6M / 1Y / 5Y)
- Auto-refreshes every 30 seconds
- Light/dark mode

## Data source

Price data is fetched server-side (via a Next.js API route at `/api/kospi`) from
Yahoo Finance's public chart endpoint for the `^KS11` symbol, so no API key is
required.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```
