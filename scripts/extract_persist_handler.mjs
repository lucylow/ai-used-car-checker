import fs from 'node:fs';
const source = fs.readFileSync('/home/ubuntu/ai-used-car-checker/App.js', 'utf8');
for (const needle of ['const persistLocalCopy', 'const saveInspection', 'setSaveRetry']) {
  const index = source.indexOf(needle);
  console.log(`\n=== ${needle} @ ${index} ===\n${source.slice(Math.max(0, index - 300), index + 1800)}`);
}
