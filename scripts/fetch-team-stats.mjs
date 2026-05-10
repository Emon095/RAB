import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TEAM_ID = '394229';
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'team-stats.json');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const fallback = {
  name: 'Rea11y Annoying Bots(RAB)',
  country: 'BD',
  countryName: 'BANGLADESH',
  globalRank: 42,
  countryRank: 2,
  rating: '365.87 pts',
  activeSince: '2017',
  source: 'fallback',
  updatedAt: new Date().toISOString(),
};

const countryMap = {
  BD: 'BANGLADESH',
  CO: 'COLOMBIA',
  US: 'UNITED STATES',
};

const toDisplayStats = (stats) => {
  const currentYear = new Date().getFullYear();
  const yearStats = stats.rating?.[currentYear] || stats.rating?.[currentYear - 1] || {};
  const activeSince = Object.keys(stats.rating || {})
    .filter((year) => Object.keys(stats.rating[year] || {}).length > 0)
    .sort()[0] || fallback.activeSince;

  return {
    name: stats.name || fallback.name,
    country: stats.country || fallback.country,
    countryName: countryMap[stats.country] || stats.country || fallback.countryName,
    globalRank: yearStats.rating_place || 'N/A',
    countryRank: yearStats.country_place || 'N/A',
    rating: yearStats.rating_points ? `${yearStats.rating_points.toFixed(2)} pts` : 'N/A',
    activeSince,
    source: 'ctftime',
    updatedAt: new Date().toISOString(),
  };
};

const writeStats = async (stats) => {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(stats, null, 2)}\n`);
};

try {
  const response = await fetch(`https://ctftime.org/api/v1/teams/${TEAM_ID}/`, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`CTFtime responded with ${response.status}`);
  }

  const stats = await response.json();
  await writeStats(toDisplayStats(stats));
  console.log(`Wrote CTFtime stats to ${OUTPUT_PATH}`);
} catch (error) {
  console.warn(`Unable to fetch CTFtime stats: ${error.message}`);
  await writeStats(fallback);
  console.log(`Wrote fallback stats to ${OUTPUT_PATH}`);
}
