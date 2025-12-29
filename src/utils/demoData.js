// Demo mode sample data
export const DEMO_SUBSCRIPTIONS = [
    {
        id: 'demo-1',
        name: 'Netflix',
        cost: 17000,
        billingDay: 15,
        billingCycle: 'monthly',
        category: 'OTT',
        url: 'https://www.netflix.com',
        customColor: '#E50914',
        isPaused: false,
        notes: '프리미엄 요금제'
    },
    {
        id: 'demo-2',
        name: 'Spotify',
        cost: 10900,
        billingDay: 20,
        billingCycle: 'monthly',
        category: 'Music',
        url: 'https://www.spotify.com',
        customColor: '#1DB954',
        isPaused: false,
        notes: ''
    },
    {
        id: 'demo-3',
        name: 'YouTube Premium',
        cost: 14900,
        billingDay: 5,
        billingCycle: 'monthly',
        category: 'OTT',
        url: 'https://www.youtube.com',
        customColor: '#FF0000',
        isPaused: false,
        notes: '가족 요금제'
    },
    {
        id: 'demo-4',
        name: 'ChatGPT Plus',
        cost: 28600,
        billingDay: 10,
        billingCycle: 'monthly',
        category: 'Work',
        url: 'https://chat.openai.com',
        customColor: '#10A37F',
        isPaused: false,
        notes: 'GPT-4 사용'
    },
    {
        id: 'demo-5',
        name: 'Coupang Wow',
        cost: 7890,
        billingDay: 1,
        billingCycle: 'monthly',
        category: 'Shopping',
        url: 'https://www.coupang.com',
        customColor: '#342971',
        isPaused: false,
        notes: '로켓배송 무료'
    },
    {
        id: 'demo-6',
        name: 'iCloud+',
        cost: 1100,
        billingDay: 25,
        billingCycle: 'monthly',
        category: 'Utility',
        url: 'https://www.icloud.com',
        customColor: '#3478F6',
        isPaused: true,
        notes: '50GB 저장공간'
    },
    {
        id: 'demo-7',
        name: 'Notion',
        cost: 10000,
        billingDay: 12,
        billingCycle: 'monthly',
        category: 'Work',
        url: 'https://www.notion.so',
        customColor: '#000000',
        isPaused: false,
        notes: 'Plus 요금제'
    },
    {
        id: 'demo-8',
        name: '밀리의 서재',
        cost: 9900,
        billingDay: 18,
        billingCycle: 'monthly',
        category: 'Education',
        url: 'https://www.millie.co.kr',
        customColor: '#FFD700',
        isPaused: false,
        notes: ''
    }
];

// Get demo subscriptions from localStorage or use defaults
export function getDemoSubscriptions() {
    const stored = localStorage.getItem('demoSubscriptions');
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with sample data
    localStorage.setItem('demoSubscriptions', JSON.stringify(DEMO_SUBSCRIPTIONS));
    return DEMO_SUBSCRIPTIONS;
}

// Save demo subscription
export function saveDemoSubscription(subscription) {
    const subs = getDemoSubscriptions();
    const index = subs.findIndex(s => s.id === subscription.id);

    if (index >= 0) {
        subs[index] = subscription;
    } else {
        subscription.id = `demo-${Date.now()}`;
        subs.push(subscription);
    }

    localStorage.setItem('demoSubscriptions', JSON.stringify(subs));
    return subscription;
}

// Delete demo subscription
export function deleteDemoSubscription(id) {
    const subs = getDemoSubscriptions();
    const filtered = subs.filter(s => s.id !== id);
    localStorage.setItem('demoSubscriptions', JSON.stringify(filtered));
}

// Clear all demo data
export function clearDemoData() {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoSubscriptions');
}

// Get demo mode info
export function getDemoModeInfo() {
    const stored = localStorage.getItem('demoMode');
    if (!stored) return null;

    const data = JSON.parse(stored);
    const expiresAt = new Date(data.expiresAt);
    const now = new Date();

    if (expiresAt <= now) {
        clearDemoData();
        return null;
    }

    const remainingMs = expiresAt - now;
    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

    return {
        ...data,
        remainingMinutes,
        isExpired: false
    };
}
