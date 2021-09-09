var CACHE_STATIC_NAME = 'static-v2';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  "/offline.html"
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});




// 2 - Network only - The APP wont work offline because it depends exclusively on the fetch to be resolved.

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (res) {
//         console.log("Network response: ", res)
//         return res;
//       })
//       .catch(function (err) {
//         console.log("No hay conexión.")
//       })
//   );
// });


//3 - Cache-only -The APP will work offline only with those assets that been statically cached. Any asset outside the static will fail (even online because it will try to find it in the static cache and that promise will fail)

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(res){
//       console.log("Cache response: ", res)
//       return res;
//     })
//     .catch(function(err){
//       console.log("No se ha encontrado el asset en el static cache.")
//     })
//   );
// });

// 4 - Network -> Cache Fallback. This strategy will try to find the resource in network first, if it fails it will go to cache and will try to find the resource in the cache, if it is not there it will fail.

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (res) {
//         console.log("Network response: ", res)
//         return caches.open(CACHE_DYNAMIC_NAME)
//         .then(function(cache){
//           cache.put(event.request.url, res.clone())
//           return res;
//         })
//       })
//       .catch(function (err) {
//         console.log("No hay conexión.")

//         return caches.match(event.request)
//           .then(function (response) {
//             if(response){
//               console.log("Cache Fallback: ", response)
//               return response;
//             } else{
//               console.log("The resource doesnt exists in the cache")
//             }
//           })
//       })
//   );
// });


// 5 - Cache -> Network Fallback - This will try to find the request in the dynamic or static cache. If the SW doesnt find it then it will fetch it from Network and save it on a dynamic CACHE. If we go offline will get the response in the case that the user navigated to that page (because it got cached in the dynamic cache), else it will fail and return 404.

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 });
//             })
//             .catch(function(err) {

//             });
//         }
//       })
//   );
// });

//6 - Combination of strategies. This strategy work intercepting main.js request. In code order it implements: network only (dinamically caching the request), cache only (searching if the request it is in the app shell), and finally cache with network fallback. And if it all fails, the last catch redirect the user to a fallback page.

function isInArray(url, cache) {
  for (let i = 0; i < cache.length; i++) {
    if (url === cache[i]) {
      return true;
    }
  }
  return false;
}

self.addEventListener("fetch", function (event) {
  if (event.request.url.indexOf("https://httpbin.org/ip" > -1)) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (data) {
              console.log("Network only response: ", data)
              cache.put(event.request.url, data.clone());
              return data;
            })
        })
    )
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
      caches.match(event.request)
        .then(function (res) {
          console.log("Cache only static: ", res)
          return res;
        })
        .catch(function () {
          console.log("No asset found in static cache")
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          if (response) {
            console.log("Dynamic cache response: ", response)
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    console.log("Network fallback response: ", res)
                    return res;
                  });
              })
              .catch(function () {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    return cache.match("/offline.html")
                  })
              });
          }
        })
    );
  }
})