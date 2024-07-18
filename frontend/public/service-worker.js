self.addEventListener('push', function(event) {
    const options = {
        icon: '/favicon.ico',
        body: event.data.text(),
    };

    const promiseChain = self.registration.showNotification("IoMT Notification", options);

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
            if (client.url === "/admin/default" && 'focus' in client) return client.focus()
        }
        if (clients.openWindow) clients.openWindow("/admin/default");
    }));
});