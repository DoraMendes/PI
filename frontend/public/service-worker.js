self.addEventListener('push', function(event) {
    const options = {
        icon: '/favicon.ico',
        body: event.data.text(),
    };

    const promiseChain = self.registration.showNotification("IoMT Notification", options);

    event.waitUntil(promiseChain);
});