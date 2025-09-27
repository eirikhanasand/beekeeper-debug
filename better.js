const fs = require('fs');
const path = require('path');

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    rss: mem.rss,
    heapTotal: mem.heapTotal,
    heapUsed: mem.heapUsed,
    external: mem.external,
  };
}

function getProcStatm() {
  const statm = fs.readFileSync('/proc/self/statm', 'utf8');
  const fields = statm.split(' ');
  const pageSize = 4096; // bytes
  const rssPages = parseInt(fields[1], 10);
  return rssPages * pageSize;
}

function getCgroupMemory() {
  const cgroupPath = '/sys/fs/cgroup';
  let memoryUsageBytes = 0;
  let kernelMemoryUsageBytes = 0;
  let memoryStat = '';

  if (fs.existsSync(path.join(cgroupPath, 'memory.current'))) {
    // cgroup v2
    memoryUsageBytes = parseInt(fs.readFileSync(path.join(cgroupPath, 'memory.current'), 'utf8'), 10);
    memoryStat = fs.readFileSync(path.join(cgroupPath, 'memory.stat'), 'utf8');
  } else {
    // cgroup v1
    memoryUsageBytes = parseInt(fs.readFileSync(path.join(cgroupPath, 'memory', 'memory.usage_in_bytes'), 'utf8'), 10);
    memoryStat = fs.readFileSync(path.join(cgroupPath, 'memory', 'memory.stat'), 'utf8');
    kernelMemoryUsageBytes = parseInt(fs.readFileSync(path.join(cgroupPath, 'memory', 'memory.kmem.usage_in_bytes'), 'utf8').trim(), 10);
  }

  return {
    memoryUsageBytes,
    kernelMemoryUsageBytes,
    memoryStat,
  };
}

function getThreadCount() {
  const status = fs.readFileSync('/proc/self/status', 'utf8');
  const threadsLine = status.split('\n').find(line => line.startsWith('Threads:'));
  return parseInt(threadsLine.split(/\s+/)[1], 10);
}

setInterval(() => {
  const mem = getMemoryUsage();
  const procRss = getProcStatm();
  const cgroup = getCgroupMemory();
  const threads = getThreadCount();

  const timestamp = new Date().toISOString();

  console.log(JSON.stringify({
    timestamp,
    processMemory: {
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
    },
    procRss,
    cgroupMemory: {
      memoryUsageBytes: cgroup.memoryUsageBytes,
      kernelMemoryUsageBytes: cgroup.kernelMemoryUsageBytes,
    },
    threads,
  }));

}, 10000);
