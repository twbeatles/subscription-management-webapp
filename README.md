# 구독 매니저 Pro 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-gray)

## ✨ 주요 기능

### 📊 대시보드
- **월간/연간 지출 요약**: 전체 구독 비용을 한눈에 확인
- **카테고리별 분석**: 도넛 차트로 지출 패턴 시각화
- **월별 추이**: 최근 6개월 지출 추이 그래프

### 📅 결제 관리
- **결제 타임라인**: 다가오는 결제일을 시각적으로 표시
- **D-Day 알림**: 3일 이내 결제 예정 서비스 자동 표시
- **무료 체험 추적**: 체험 기간 종료일 관리

### 🔔 브라우저 알림 (NEW!)
- **결제일 리마인더**: 결제 3일/1일 전 브라우저 알림
- **설정 패널에서 활성화**: 원클릭으로 알림 켜기/끄기
- **권한 관리**: 브라우저 Notification API 활용

### 🎛️ 필터 및 정렬
- **검색**: 서비스 이름으로 빠르게 검색
- **카테고리 필터**: OTT, 음악, 쇼핑 등 카테고리별 필터링
- **정렬 옵션**: 결제일순, 금액순, 이름순, 카테고리순 정렬

### ⏸️ 구독 관리
- **간편 등록**: 인기 서비스 프리셋으로 빠르게 추가
- **일시정지**: 일시적으로 구독 중단 표시
- **서비스 바로가기**: URL 등록시 원클릭 이동

### 🌙 테마 & 설정
- **다크 모드**: 눈 피로도를 줄이는 다크 테마 지원
- **데이터 내보내기**: CSV/JSON 형식으로 백업
- **데이터 가져오기**: 기존 데이터 복원

### 👤 사용자 관리
- **다중 프로필**: 여러 프로필 생성 및 전환
- **데모 모드**: 로그인 없이 30분간 기능 체험
- **로컬 저장**: 모든 데이터는 브라우저에 안전하게 저장

## 🚀 시작하기

### 요구사항
- Node.js 18+ 또는 20+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/           # UI 컴포넌트
│   ├── Header.jsx        # 헤더 (로고, 테마 토글)
│   ├── TotalCostCard.jsx # 총 비용 카드
│   ├── AlertCard.jsx     # 결제 알림
│   ├── Dashboard.jsx     # 분석 대시보드
│   ├── DonutChart.jsx    # 도넛 차트
│   ├── PaymentTimeline.jsx # 결제 타임라인
│   ├── FilterBar.jsx     # 필터/검색
│   ├── SubscriptionList.jsx # 구독 목록
│   ├── SubscriptionCard.jsx # 개별 카드
│   ├── SubscriptionModal.jsx # 추가/수정 모달
│   ├── SettingsPanel.jsx # 설정 패널
│   └── DemoBanner.jsx    # 데모 모드 배너
├── context/              # React Context
│   ├── AuthContext.jsx   # 인증/프로필 관리
│   └── ThemeContext.jsx  # 테마 관리
├── hooks/                # 커스텀 훅
│   └── useSubscriptions.js # 구독 CRUD
├── pages/                # 페이지 컴포넌트
│   ├── LoginPage.jsx     # 로그인/프로필 선택
│   ├── ProfilePage.jsx   # 프로필 설정
│   └── ForgotPasswordPage.jsx
├── utils/                # 유틸리티
│   ├── constants.js      # 상수 정의
│   ├── dateHelpers.js    # 날짜 계산
│   ├── exportData.js     # 데이터 내보내기
│   ├── demoData.js       # 데모 데이터
│   ├── localStorageManager.js # 로컬 저장소 관리
│   └── notifications.js  # 브라우저 알림
├── App.jsx               # 메인 앱
├── main.jsx              # 엔트리 포인트
└── index.css             # 글로벌 스타일
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
- **Charts**: Recharts
- **Storage**: LocalStorage (브라우저 내장)
- **Animation**: CSS Animations, Transitions

## 📱 반응형 디자인

- 모바일 (320px+): 최적화된 싱글 컬럼 레이아웃
- 태블릿/데스크톱: 중앙 정렬 max-width 컨테이너

## 🔒 데이터 저장

- 모든 데이터는 브라우저의 LocalStorage에 저장됩니다
- 서버 전송 없이 완전한 오프라인 사용 가능
- 브라우저 데이터 삭제 시 데이터도 함께 삭제되므로 주기적 백업 권장

## 🚢 배포

빌드 후 `dist/` 폴더를 정적 호스팅 서비스에 배포:

- **Vercel**: `vercel --prod`
- **Netlify**: 드래그 앤 드롭 또는 CLI
- **GitHub Pages**: `gh-pages` 패키지 사용
- **Firebase Hosting**: `firebase deploy`

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management
