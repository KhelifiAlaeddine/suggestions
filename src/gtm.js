// Create a new script element
var script = document.createElement('script');

// Set the source attribute to the CDN URL
script.src = 'https://www.googletagmanager.com/gtag/js?id=G-D8TTVWM6DD';

// Append the script element to the document body
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-D8TTVWM6DD');