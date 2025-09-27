let lastRss = 0;
let lastExternal = 0;

setInterval(() => {
  const mem = process.memoryUsage();
  const rssMB = (mem.rss / 1024 / 1024).toFixed(2);
  const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
  const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
  const externalMB = (mem.external / 1024 / 1024).toFixed(2);

  // Log memory stats
  const logLine = `${new Date().toISOString()} | RSS: ${rssMB} MB | HeapUsed: ${heapUsedMB} MB | HeapTotal: ${heapTotalMB} MB | External: ${externalMB} MB\n`;
  process.stdout.write(logLine);

  // Detect growth in RSS or external memory
  if (lastRss && rssMB - lastRss > 10) {
    console.log(`⚠️ RSS increased by ${(rssMB - lastRss).toFixed(2)} MB`);
  }
  if (lastExternal && externalMB - lastExternal > 10) {
    console.log(`⚠️ External memory increased by ${(externalMB - lastExternal).toFixed(2)} MB`);
  }

  lastRss = parseFloat(rssMB);
  lastExternal = parseFloat(externalMB);
}, 10000);
