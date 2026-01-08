# 구독 매니저 Pro v5.1 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-5.1.0-blue)

## ✨ v5.1 업데이트 (2026-01-08)

### 🚀 성능 최적화

| 컴포넌트 | 최적화 내용 |
|---------|-----------|
| `TotalCostCard` | React.memo 적용으로 불필요한 리렌더링 방지 |
| `Dashboard` | useMemo 안정화 (랜덤 값 제거) |
| `SubscriptionList` | React.memo 적용으로 리스트 전체 리렌더링 최적화 |
| `useSubscriptions` | 함수형 업데이트로 localStorage 중복 읽기 제거 |

### 🐛 버그 수정

- **FamilySharingManager**: 에러 핸들링 강화 (try-catch 추가)
- **AuthContext**: 인증 로직 에러 핸들링 강화 및 안정성 개선
- **AutoCancelReminder**: dismissedItems 상태 localStorage 영구 저장
  - 새로고침 후에도 숨긴 알림 유지

### 🧹 코드 정리

- 조건부 콘솔 로깅 적용 (`process.env.NODE_ENV === 'development'`)
- 프로덕션 환경에서 불필요한 console.error 출력 방지

---

## ✨ v5.0 주요 기능

### 📅 결제 캘린더 뷰
- 월별 결제 일정 시각화
- 날짜별 구독 목록 확인
- 카테고리별 색상 표시

### 🔍 스마트 검색 (Cmd/Ctrl + K)
- 전역 키보드 단축키 지원
- 구독명, 카테고리, 메모 통합 검색
- 검색 히스토리 저장

### 🎨 구독 아이콘 자동 매칭
- 50+ 서비스 로고 자동 표시
- Favicon 폴백 지원

### 📱 PWA 푸시 알림
- Service Worker 기반 오프라인 지원
- 결제일 알림 기능

---

## 📱 주요 기능

| 탭 | 기능 |
|---|-----|
| **홈** | 월간 예상 지출, 결제 캘린더, 구독 건강 점수, 퀵 스탯 |
| **구독** | 구독 목록, 필터링, 추가/수정/삭제, 테이블 뷰 |
| **분석** | 소득 대비 분석, 비용 시뮬레이터, 가격 추적, 리포트 |
| **관리** | 결제 수단, 갱신 알림, 가족 구독, 히스토리 |
| **도구** | 스마트 추천, 해지 리마인더, 번들 최적화, 환율 변환 |

---

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
├── components/           # UI 컴포넌트 (49개)
│   ├── TotalCostCard     # [PERF v5.1] React.memo 적용
│   ├── SubscriptionList  # [PERF v5.1] React.memo 적용
│   ├── Dashboard         # [PERF v5.1] useMemo 안정화
│   ├── FamilySharingManager  # [FIX v5.1] 에러 핸들링
│   ├── AutoCancelReminder    # [FIX v5.1] 상태 영속성
│   └── ...
├── hooks/
│   └── useSubscriptions  # [PERF v5.1] 함수형 업데이트
├── utils/
│   ├── localStorageManager   # 로컬 데이터 관리
│   ├── constants             # 상수 정의
│   └── dateHelpers           # 날짜 유틸리티
├── context/
│   ├── AuthContext       # 인증 컨텍스트
│   └── ThemeContext      # 테마 컨텍스트
└── App.jsx               # 메인 앱 (Lazy Loading)
```

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18.3, Vite 5.4 |
| Styling | TailwindCSS 3.4 |
| Icons | Lucide React |
| Charts | Recharts |
| Animation | Framer Motion |
| Storage | LocalStorage |

## 🚢 배포

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# GitHub Pages
npm run deploy
```

## 🔄 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|------|------|----------|
| v5.1 | 2026-01-08 | 성능 최적화, 버그 수정, 코드 정리 |
| v5.0 | 2026-01 | 캘린더뷰, 스마트검색, 아이콘매칭, PWA |
| v4.0 | 2026-01 | 가족 구독, 번들 최적화 |
| v3.0 | - | 위젯, 환율, 게이미피케이션 |

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management | v5.1.0
