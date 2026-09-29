// ============================================================
// TOY HAVEN - SERVICE WORKER
// ============================================================
// Purpose:
// This file supports the Progressive Web App (PWA) requirement.
// It runs separately from the normal page JavaScript.
// You do not directly see this code as a section on the website.
// Instead, it works in the background when the website is loaded.
// ============================================================

// The "install" event runs when the browser installs this service worker.
self.addEventListener("install", function () {

  // skipWaiting() tells the new service worker to become active sooner.
  self.skipWaiting();
});


// The "fetch" event runs whenever the page requests a file/resource.
self.addEventListener("fetch", function (event) {

  // respondWith() lets the service worker decide how the request is answered.
  event.respondWith(

    // First try to get the requested file from the network.
    fetch(event.request).catch(function () {

      // If the network request fails, try to find a matching cached file.
      return caches.match(event.request);
    })
  );
});
