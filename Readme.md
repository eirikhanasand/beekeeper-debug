## Flow chart

```
                ┌───────────────────┐
                │   Kubernetes Pod  │
                │ (Docker Container)│
                └─────────┬─────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
 ┌────────▼─────────┐            ┌────────▼──────────┐
 │ Cron Job (1/min) │            │ Fastify API       │
 │ Process Data     │            │ - Serves API      │
 │ - Reads data     │            │ - Caches 10 pages │
 │ - Writes to PSQL │            │   per namespace   │
 └────────┬─────────┘            │   per context     │
          │                      └────────┬──────────┘
          │                               │
          │                               │
          ▼                               ▼
   ┌───────────────┐                ┌─────────────┐
   │ PostgreSQL DB │                │ In-memory   │
   │               │                │ Cache       │
   └───────────────┘                └─────────────┘
```

## api.log
```
while true; do
  kubectl top pod beekeeper-api-5b46b4b6bd-65r8b -n beekeeper
  sleep 5
done
```

## better.js

Logging script to capture 
```
{
    "timestamp":"2025-09-27T16:55:00.741Z",
    "processMemory":{
        "rss":42405888,
        "heapTotal":4694016,
        "heapUsed":4072728,
        "external":1421170
    },
    "procRss":42405888,
    "cgroupMemory":{
        "memoryUsageBytes":583331840,
        "kernelMemoryUsageBytes":0
    },
    "threads":7
}
```

## betterMonitor.json

Output from `better.js`

## currentMemoryTop10Processes.log

```
while true; do
   date +"%T %F"
   cat /sys/fs/cgroup/memory.current
   ps -o pid,user,rss,comm -A | sort -k3 -nr | head -n10
   sleep 5
done
```

## htop.png

Sample picture of current htop output

## memoryUsage.log
Output from `node -e "setInterval(()=>console.log(process.memoryUsage()),10000)"`

```
{
  rss: 41742336,
  heapTotal: 4694016,
  heapUsed: 3435832,
  external: 1487477,
  arrayBuffers: 10475
}
```

## memoryUsageExternal.log

Output from `node -e "setInterval(()=>console.log(process.memoryUsage().external),10000)"`

```
1191056
1490095
1490095
1490095
```

## monitor.js

Another monitoring script, captures output in this format

```
2025-09-27T17:22:03.224Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
2025-09-27T17:22:13.232Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
2025-09-27T17:22:23.240Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
```

## monitor.log

Full log from monitor.js

```
2025-09-27T17:22:03.224Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
2025-09-27T17:22:13.232Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
2025-09-27T17:22:23.240Z | RSS: 41.00 MB | HeapUsed: 3.45 MB | HeapTotal: 5.23 MB | External: 1.35 MB
```