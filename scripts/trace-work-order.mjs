import { readdir, readFile } from 'node:fs/promises';

const directory = new URL('../fixtures/runs/', import.meta.url);
for (const filename of (await readdir(directory)).filter(name => name.endsWith('.json')).sort()) {
  const recording = JSON.parse(await readFile(new URL(filename, directory), 'utf8'));
  console.log(`${recording.workOrderId}: ${recording.issue.title} [${recording.outcome}]`);
  recording.events.forEach((event, index) => {
    console.log(`${String(index + 1).padStart(2, '0')} ${event.station}: ${event.status}`);
    console.log(`   ${event.summary}`);
  });
  console.log();
}
