
var box = document.querySelector('.box');
var button = document.querySelector('button');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Registered Service Worker!');
    });
}

button.addEventListener('click', function(event) {
  if (box.classList.contains('visible')) {
    box.classList.remove('visible');
  } else {
    box.classList.add('visible');
  }
});

fetch('https://httpbin.org/ip')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    console.log(data.origin);
    box.style.height = (data.origin.substr(0, 2) * 5) + 'px';
  });
