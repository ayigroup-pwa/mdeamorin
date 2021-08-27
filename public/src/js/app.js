
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    //.register('/sw.js', {scope: '/help/'}) HTTPS: requested for pwa sw
    .register('/sw.js')
    .then(function() {
      console.log('Service worker registered!');
    });
}
