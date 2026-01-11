/**
 * Service Worker for 구독 매니저 Pro v5.0
 * PWA 오프라인 지원 및 푸시 알림
 */

const CACHE_NAME = 'sub-manager-v5';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and chrome extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response to cache it
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request);
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    let data = {
        title: '💳 구독 매니저',
        body: '결제일이 다가오는 구독이 있습니다.',
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'subscription-reminder',
        requireInteraction: true
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            tag: data.tag,
            requireInteraction: data.requireInteraction,
            data: data.data || {},
            actions: [
                { action: 'view', title: '확인하기' },
                { action: 'dismiss', title: '닫기' }
            ]
        })
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Open or focus the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Focus existing window if available
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Scheduled notification check (via message from main app)
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { title, body, delay, tag } = event.data;
        setTimeout(() => {
            self.registration.showNotification(title, {
                body,
                icon: '/vite.svg',
                badge: '/vite.svg',
                tag: tag || 'scheduled-reminder',
                requireInteraction: true,
                actions: [
                    { action: 'view', title: '확인하기' },
                    { action: 'dismiss', title: '닫기' }
                ]
            });
        }, delay || 0);
    }

    if (event.data.type === 'PAYMENT_REMINDER') {
        const { subscription, daysUntil } = event.data;
        const dayText = daysUntil === 0 ? '오늘' : `${daysUntil}일 후`;
        self.registration.showNotification('💳 결제일 알림', {
            body: `${subscription.name} 결제일이 ${dayText}입니다. (${Number(subscription.cost).toLocaleString()}원)`,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: `payment-${subscription.id}`,
            requireInteraction: daysUntil <= 1,
            data: { subscriptionId: subscription.id, type: 'payment' },
            actions: [
                { action: 'view', title: '확인하기' },
                { action: 'dismiss', title: '닫기' }
            ]
        });
    }

    if (event.data.type === 'TRIAL_EXPIRY') {
        const { subscription, daysRemaining } = event.data;
        const dayText = daysRemaining === 0 ? '오늘 만료' : `${daysRemaining}일 후 만료`;
        self.registration.showNotification('⏰ 무료 체험 만료 알림', {
            body: `${subscription.name} 무료 체험이 ${dayText}됩니다! 자동 결제 전 확인하세요.`,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: `trial-${subscription.id}`,
            requireInteraction: true,
            data: { subscriptionId: subscription.id, type: 'trial' },
            actions: [
                { action: 'view', title: '확인하기' },
                { action: 'cancel', title: '해지하기' }
            ]
        });
    }

    if (event.data.type === 'BUDGET_ALERT') {
        const { currentSpending, budget, percentUsed } = event.data;
        self.registration.showNotification('📊 예산 알림', {
            body: `이번 달 구독 지출이 예산의 ${percentUsed}%입니다. (${Number(currentSpending).toLocaleString()}원 / ${Number(budget).toLocaleString()}원)`,
            icon: '/vite.svg',
            badge: '/vite.svg',
            tag: 'budget-alert',
            requireInteraction: percentUsed >= 100,
            data: { type: 'budget' },
            actions: [
                { action: 'view', title: '분석 보기' },
                { action: 'dismiss', title: '닫기' }
            ]
        });
    }

    if (event.data.type === 'CHECK_SUBSCRIPTIONS') {
        console.log('[SW] Subscription check requested');
    }
});
