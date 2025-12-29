# Subscription Manager Pro 구독 매니저

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-10.8-FFCA28?logo=firebase)

## ✨ 주요 기능

### 📊 대시보드
- **월간/연간 지출 요약**: 전체 구독 비용을 한눈에 확인
- **카테고리별 분석**: 도넛 차트와 진행 바로 지출 패턴 시각화
- **월별 추이**: 최근 6개월 지출 추이 그래프

### 📅 결제 관리
- **결제 타임라인**: 다가오는 결제일을 시각적으로 표시
- **D-Day 알림**: 3일 이내 결제 예정 서비스 자동 알림
- **무료 체험 추적**: 체험 기간 종료일 관리

### 🎛️ 필터 및 정렬
- **검색**: 서비스 이름으로 빠르게 검색
- **카테고리 필터**: OTT, 음악, 쇼핑 등 카테고리별 필터링
- **정렬 옵션**: 결제일순, 금액순, 이름순 정렬

### ⏸️ 구독 관리
- **간편 등록**: 인기 서비스 프리셋으로 빠르게 추가
- **일시정지**: 일시적으로 구독 중단 표시
- **서비스 바로가기**: URL 등록시 원클릭 이동

### 🌙 테마 & 설정
- **다크 모드**: 눈 피로도를 줄이는 다크 테마 지원
- **데이터 내보내기**: CSV/JSON 형식으로 백업
- **데이터 가져오기**: 기존 데이터 복원

## 🚀 시작하기

### 요구사항
- Node.js 18+ 또는 20+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

### 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_APP_ID=subscription-manager-v1
```

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── Header.jsx       # 헤더 (로고, 테마 토글)
│   ├── TotalCostCard.jsx # 총 비용 카드
│   ├── AlertCard.jsx    # 결제 알림
│   ├── Dashboard.jsx    # 분석 대시보드
│   ├── DonutChart.jsx   # 도넛 차트
│   ├── PaymentTimeline.jsx # 결제 타임라인
│   ├── FilterBar.jsx    # 필터/검색
│   ├── SubscriptionList.jsx # 구독 목록
│   ├── SubscriptionCard.jsx # 개별 카드
│   ├── SubscriptionModal.jsx # 추가/수정 모달
│   └── SettingsPanel.jsx # 설정 패널
├── hooks/               # 커스텀 훅
│   ├── useAuth.js       # Firebase 인증
│   └── useSubscriptions.js # 구독 CRUD
├── utils/               # 유틸리티
│   ├── constants.js     # 상수 정의
│   ├── dateHelpers.js   # 날짜 계산
│   └── exportData.js    # 데이터 내보내기
├── context/             # React Context
│   └── ThemeContext.jsx # 테마 관리
├── config/              # 설정
│   └── firebase.js      # Firebase 설정
├── App.jsx              # 메인 앱
├── main.jsx             # 엔트리 포인트
└── index.css            # 글로벌 스타일
```

## 🎨 지원 카테고리

| 카테고리 | 색상 | 예시 서비스 |
|---------|------|------------|
| OTT | 🔴 빨강 | Netflix, YouTube Premium, Disney+ |
| Music | 🟢 초록 | Spotify, Melon, Apple Music |
| Shopping | 🟠 주황 | Coupang Wow, Naver Plus |
| Work | ⚫ 회색 | Notion, ChatGPT Plus, Figma |
| Education | 🟡 노랑 | 밀리의 서재, Duolingo |
| Health | 🟢 청록 | Nike Training Club |
| Utility | 🔵 파랑 | iCloud+, Google One |
| Etc | ⚪ 회색 | 기타 서비스 |

## 🛠️ 기술 스택

- **Frontend**: React 18, Vite 5
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Backend**: Firebase (Auth, Firestore)
- **Animation**: CSS Animations, Transitions

## 📱 반응형 디자인

- 모바일 (320px+): 최적화된 싱글 컬럼 레이아웃
- 태블릿/데스크톱: 중앙 정렬 max-width 컨테이너

## 🔒 보안

- Firebase Anonymous Auth 지원
- 사용자별 데이터 분리 저장
- 환경 변수로 민감 정보 관리

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management
