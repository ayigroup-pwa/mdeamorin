TASK:
1) Identify the strategy we currently use in the Service Worker (for caching)

The estrategy is: APP - SW - CACHE WITH NETWORK FALLBACK;

2) Replace it with a "Network only" strategy => Clear Storage (in Dev Tools),
reload & try using your app offline
3) Replace it with a "Cache only" strategy => Clear Storage (in Dev Tools), reload &
try using your app offline
4) Replace it with "Network, cache fallback" strategy =>  => Clear Storage (in Dev Tools),
reload & try using your app offline
5) Replace it with a "Cache, then network" strategy => Clear Storage (in Dev Tools), reload
& try using your app offline
6) Add "Routing"/ URL Parsing to pick the right strategies: Try to implement "Cache, then network",
"Cache with network fallback" and "Cache only" (all of these, with appropriate URL selection)

Important: Clear your Application Storage first to get rid of the old SW & Cache
from the Main Project!
