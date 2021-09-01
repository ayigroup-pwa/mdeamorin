
var deferredPrompt;

if (!window.Promise) {
  //PolyFills -> browsers legacy
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

var promise = new Promise(function(resolve, reject){
  setTimeout(function() {
    //console.log('This is executed once the timer is done!');
    //resolve(This is executed once the timer is done!);
    reject({code: 409, message: 'Error...'});
  }, 3000);
});

var xhr = new XMLHttpRequest();
xhr.open('GET','https://httpbin.org/ip');
xhr.responseType = 'json';
xhr.onload = function() {
  console.log('Response con AJAX...');
  console.log(xhr.response);
}

xhr.onerror = function() {
  console.log('Error on ajax call...');
}

xhr.send();

fetch('https://httpbin.org/ip')
.then(function(response) {
  console.log('Response con FETCH...');
  console.log(response);
  return response.json();
})
.then(function(data) {
  console.log(data);
})
.catch(function(err){
  console.log(err);
  console.log('Error on fetch call...');
});

fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type':'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors', // no-cors
  body: JSON.stringify({message: 'Body is Ok'})
})
.then(function(data) {
  console.log(data);
})
.catch(function(err) {
  console.log(err);
});

promise.then(function(text) {
  return text;
})
.then(function(updateText) {
  console.log(updateText);
})
.catch(function(err) {
  console.log(err.code, err.message);
});

console.log('This is executed right after setTimeout()');
