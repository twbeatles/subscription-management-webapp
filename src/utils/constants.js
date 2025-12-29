// Category colors
export const CATEGORY_COLORS = {
    OTT: '#E50914',
    Music: '#1DB954',
    Shopping: '#FF9900',
    Utility: '#00A4EF',
    Work: '#5A5A5A',
    Education: '#FFD700',
    Health: '#10B981',
    Finance: '#8B5CF6',
    Etc: '#808080',
};

// Category labels in Korean
export const CATEGORY_LABELS = {
    OTT: '영상/스트리밍',
    Music: '음악',
    Shopping: '쇼핑/이커머스',
    Utility: '유틸리티',
    Work: '업무/생산성',
    Education: '교육/학습',
    Health: '건강/운동',
    Finance: '금융/투자',
    Etc: '기타',
};

// Popular services preset
export const POPULAR_SERVICES = [
    // OTT
    { name: 'Netflix', category: 'OTT', color: '#E50914', url: 'https://www.netflix.com', defaultCost: 17000 },
    { name: 'YouTube Premium', category: 'OTT', color: '#FF0000', url: 'https://www.youtube.com', defaultCost: 14900 },
    { name: 'Disney+', category: 'OTT', color: '#113CCF', url: 'https://www.disneyplus.com', defaultCost: 9900 },
    { name: 'Wavve', category: 'OTT', color: '#1C1B1F', url: 'https://www.wavve.com', defaultCost: 13900 },
    { name: 'Tving', category: 'OTT', color: '#FF153C', url: 'https://www.tving.com', defaultCost: 13900 },
    { name: 'Watcha', category: 'OTT', color: '#FF0558', url: 'https://watcha.com', defaultCost: 12900 },

    // Music
    { name: 'Spotify', category: 'Music', color: '#1DB954', url: 'https://www.spotify.com', defaultCost: 10900 },
    { name: 'Melon', category: 'Music', color: '#00CD3C', url: 'https://www.melon.com', defaultCost: 10900 },
    { name: 'Apple Music', category: 'Music', color: '#FA233B', url: 'https://music.apple.com', defaultCost: 10900 },
    { name: 'Genie', category: 'Music', color: '#3D85C6', url: 'https://www.genie.co.kr', defaultCost: 10900 },
    { name: 'Bugs', category: 'Music', color: '#FF3366', url: 'https://music.bugs.co.kr', defaultCost: 9500 },

    // Shopping
    { name: 'Coupang Wow', category: 'Shopping', color: '#342971', url: 'https://www.coupang.com', defaultCost: 7890 },
    { name: 'Naver Plus', category: 'Shopping', color: '#03C75A', url: 'https://nid.naver.com', defaultCost: 4900 },
    { name: 'SSG 유니버스', category: 'Shopping', color: '#FF5A5A', url: 'https://www.ssg.com', defaultCost: 4900 },

    // Work
    { name: 'Notion', category: 'Work', color: '#000000', url: 'https://www.notion.so', defaultCost: 10000 },
    { name: 'ChatGPT Plus', category: 'Work', color: '#10A37F', url: 'https://chat.openai.com', defaultCost: 20000 },
    { name: 'Figma', category: 'Work', color: '#F24E1E', url: 'https://www.figma.com', defaultCost: 15000 },
    { name: 'GitHub Copilot', category: 'Work', color: '#000000', url: 'https://github.com', defaultCost: 10000 },
    { name: 'Slack', category: 'Work', color: '#4A154B', url: 'https://slack.com', defaultCost: 10000 },
    { name: 'Zoom', category: 'Work', color: '#2D8CFF', url: 'https://zoom.us', defaultCost: 16000 },
    { name: 'Adobe CC', category: 'Work', color: '#FF0000', url: 'https://www.adobe.com', defaultCost: 24000 },

    // Education
    { name: '밀리의 서재', category: 'Education', color: '#FFD700', url: 'https://www.millie.co.kr', defaultCost: 9900 },
    { name: 'Duolingo', category: 'Education', color: '#58CC02', url: 'https://www.duolingo.com', defaultCost: 14900 },
    { name: 'Coursera', category: 'Education', color: '#0056D2', url: 'https://www.coursera.org', defaultCost: 59000 },
    { name: '클래스101', category: 'Education', color: '#FF6B00', url: 'https://class101.net', defaultCost: 19900 },

    // Health
    { name: 'Nike Training Club', category: 'Health', color: '#000000', url: 'https://www.nike.com', defaultCost: 0 },
    { name: 'Keep', category: 'Health', color: '#00C8FF', url: 'https://www.gotokeep.com', defaultCost: 9900 },

    // Utility
    { name: 'iCloud+', category: 'Utility', color: '#3478F6', url: 'https://www.icloud.com', defaultCost: 1100 },
    { name: 'Google One', category: 'Utility', color: '#4285F4', url: 'https://one.google.com', defaultCost: 2400 },
    { name: 'Dropbox', category: 'Utility', color: '#0061FF', url: 'https://www.dropbox.com', defaultCost: 12000 },
    { name: '1Password', category: 'Utility', color: '#1A8CFF', url: 'https://1password.com', defaultCost: 5000 },
    { name: 'NordVPN', category: 'Utility', color: '#4687FF', url: 'https://nordvpn.com', defaultCost: 15000 },
];

// Billing cycle options
export const BILLING_CYCLES = {
    monthly: { label: '월간', multiplier: 1 },
    yearly: { label: '연간', multiplier: 12 },
    weekly: { label: '주간', multiplier: 0.25 },
};

// Sort options
export const SORT_OPTIONS = [
    { value: 'daysLeft', label: '결제일 순' },
    { value: 'cost-desc', label: '금액 높은 순' },
    { value: 'cost-asc', label: '금액 낮은 순' },
    { value: 'name', label: '이름 순' },
    { value: 'category', label: '카테고리 순' },
];

// Currency options
export const CURRENCIES = {
    KRW: { symbol: '₩', label: '원', locale: 'ko-KR' },
    USD: { symbol: '$', label: 'USD', locale: 'en-US' },
    JPY: { symbol: '¥', label: '엔', locale: 'ja-JP' },
    EUR: { symbol: '€', label: 'EUR', locale: 'de-DE' },
};
