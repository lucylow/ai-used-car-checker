import { readFileSync } from 'node:fs';
const [file, needle, radius = '1600'] = process.argv.slice(2);
const source = readFileSync(file, 'utf8');
const index = source.indexOf(needle);
if (index < 0) process.exit(2);
console.log(source.slice(Math.max(0, index - Number(radius)), index + Number(radius)).replaceAll('\n', ' '));
