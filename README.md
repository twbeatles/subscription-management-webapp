# 구독 매니저 Pro v6.1 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-6.1.0-blue)

## ✨ v6.1 업데이트 (2026-01-22)

### 🚀 신규 기능

| 컴포넌트 | 기능 설명 |
|---------|----------|
| **DuplicateDetector** | 중복 구독 자동 감지 및 절약 가능 금액 계산 |
| **TrialCountdownWidget** | 무료 체험 만료 D-Day 카운트다운 및 알림 |
| **MonthlyBudgetProgress** | 월간 예산 설정 및 지출 현황 진행바 |
| **DashboardWidgets** | 드래그 가능한 위젯 대시보드 (순서 변경, on/off 토글) |
| **SubscriptionArchive** | 해지된 구독 아카이브 및 복원 기능 |
| **OfflineIndicator** | 오프라인 상태 감지 및 배너 표시 |

### 🔧 개선사항

- **localStorageManager 확장**: 아카이브, 월간 예산, 위젯 레이아웃, 오프라인 큐 관리 추가
- **duplicateDetector 유틸리티**: Levenshtein 유사도 기반 중복 서비스 감지
- **savingsAnalyzer 유틸리티**: AI 기반 절약 분석 및 번들 최적화 추천
- **useOnlineStatus 훅**: 온라인/오프라인 상태 추적

---

## ✨ v5.4 업데이트 (2026-01-14)

### 🔧 기능 안정성 개선

| 컴포넌트 | 수정 내용 |
|---------|----------|
| **CalendarView** | 연간/주간 결제 주기 캘린더 표시 로직 수정 |
| **notifications.js** | 사용자별 알림 설정 분리 (userId 파라미터 추가) |
| **App.jsx** | handleDelete 복구 로직 단순화 (동적 import 제거) |
| **PaymentMethodManager** | userId 초기화 타이밍 개선 (useEffect 패턴) |
| **BackupRestore** | user.displayName → user.name 수정 |
| **SharedMemberManager** | useState 초기화 타이밍 개선 |
| **UsageTracker** | useState 초기화 타이밍 개선 |

### 🐛 버그 수정

- **캘린더 표시 오류**: 연간 구독이 매월 표시되던 문제 해결
- **주간 구독 반복**: 주간 구독이 해당 요일에만 표시되도록 수정
- **알림 설정 공유**: 모든 사용자가 동일한 알림 설정을 공유하던 문제 해결
- **백업 파일**: 사용자 이름이 undefined로 저장되던 문제 수정
- **초기화 타이밍**: userId가 undefined일 때 localStorage 접근 오류 방지

---

## ✨ v5.3 업데이트 (2026-01-11)

### 💱 통화 및 결제 로직 완전 개선

| 기능 | 개선 내용 |
|------|----------|
| **다중 통화 지원 강화** | `costHelpers.js`, `CurrencyConverter` 등 전반적인 통화 변환 로직 통합 및 정확도 향상 |
| **주간 결제(Weekly)** | 주 단위 결제 사이클 로직 수정 및 월간/연간 비용 정규화 계산 정확도 개선 |
| **환율 계산 최적화** | 실시간 환율 적용 및 캐싱 로직 개선으로 성능과 정확성 확보 |

### 🐛 주요 버그 수정

- **가격 계산 오류 수정**: 서로 다른 통화가 혼합된 구독 목록의 총합 계산 오류 해결
- **갱신일 추적 수정**: 주간 결제 서비스의 다음 결제일 계산 정밀도 향상
- **Adblocker 이슈**: 일부 환경에서 발생하던 광고 차단 기능 관련 오작동 및 UI 이슈 해결

---

## ✨ v5.2 업데이트 (2026-01-10)

### 🔴 Critical 버그 수정

| 컴포넌트 | 수정 내용 |
|---------|----------|
| `SharedMemberManager` | 누락된 state 변수 (`expandedSub`, `newMemberName`) 추가 |
| `SharedMemberManager` | `useState` → `useEffect` 리팩토링 (이벤트 리스너 등록) |
| `SharedMemberManager` | `window.confirm` → `useConfirmModal` 훅 적용 |
| `PaymentMethodManager` | `useState` → `useEffect` 리팩토링 (스토리지 이벤트) |

### 🟡 호환성 개선

- **user?.uid → user?.id 통일**: 7개 파일에서 잘못된 프로퍼티 참조 수정
  - `App.jsx`, `PaymentMethodManager.jsx`, `UsageTracker.jsx`
  - `GoalsSavings.jsx`, `SecuritySettings.jsx`, `ReportsInsights.jsx`, `SettingsPanel.jsx`
- **onKeyPress → onKeyDown**: deprecated 이벤트 핸들러 교체
  - `SharedMemberManager.jsx`, `SplitBillCalculator.jsx`

### 🛠️ 기타 개선

- `localStorageManager.js`: 중복 `REPORTS_PREFIX` 키 제거
- `useSubscriptions.js`: setState 외부로 에러 검증 로직 이동

---

## ✨ v5.0 ~ v5.1 주요 기능

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
| **홈** | 월간 예상 지출, 결제 캘린더, 구독 건강 점수, 퀵 스탯, 중복 감지 |
| **구독** | 구독 목록, 필터링, 추가/수정/삭제, 테이블 뷰, 아카이브 |
| **분석** | 소득 대비 분석, 비용 시뮬레이터, 가격 추적, 리포트, 절약 분석 |
| **관리** | 결제 수단, 갱신 알림, 가족 구독, 히스토리, 예산 관리 |
| **도구** | 스마트 추천, 해지 리마인더, 번들 최적화, 환율 변환, 위젯 설정 |

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
├── components/           # UI 컴포넌트 (69개)
│   ├── TotalCostCard         # [PERF v5.1] React.memo 적용
│   ├── SubscriptionList      # [PERF v5.1] React.memo 적용
│   ├── Dashboard             # [PERF v5.1] useMemo 안정화
│   ├── DuplicateDetector     # [NEW v6.1] 중복 구독 감지
│   ├── TrialCountdownWidget  # [NEW v6.1] 체험판 만료 카운트다운
│   ├── MonthlyBudgetProgress # [NEW v6.1] 월간 예산 진행바
│   ├── DashboardWidgets      # [NEW v6.1] 드래그 가능 위젯
│   ├── SubscriptionArchive   # [NEW v6.1] 구독 아카이브
│   ├── OfflineIndicator      # [NEW v6.1] 오프라인 상태 표시
│   └── ...
├── hooks/
│   ├── useSubscriptions      # [PERF v5.1] 함수형 업데이트
│   ├── useExchangeRates      # 환율 API
│   ├── usePushNotifications  # 푸시 알림
│   └── useBiometricAuth      # 생체 인증
├── utils/
│   ├── localStorageManager   # 로컬 데이터 관리 (943줄)
│   ├── duplicateDetector     # [NEW v6.1] 중복 감지 유틸리티
│   ├── savingsAnalyzer       # [NEW v6.1] 절약 분석 유틸리티
│   ├── koreanHolidays        # 한국 공휴일 처리
│   ├── constants             # 상수 정의
│   ├── costHelpers           # 비용 계산
│   └── dateHelpers           # 날짜 유틸리티
├── context/
│   ├── AuthContext           # 인증 컨텍스트
│   └── ThemeContext          # 테마 컨텍스트
└── App.jsx                   # 메인 앱 (Lazy Loading, 907줄)
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
| v6.1 | 2026-01-22 | 중복 감지, 체험 카운트다운, 예산 진행바, 위젯 관리, 아카이브, 오프라인 표시 |
| v5.4 | 2026-01-14 | 기능 안정성 개선 (7개 컴포넌트), 초기화 타이밍 수정 |
| v5.3 | 2026-01-11 | 통화/결제 로직 개선, 주간 결제 수정, Adblocker 픽스 |
| v5.2 | 2026-01-10 | Critical 버그 수정, 호환성 개선, 데이터 저장 안정화 |
| v5.1 | 2026-01-08 | 성능 최적화, 버그 수정, 코드 정리 |
| v5.0 | 2026-01 | 캘린더뷰, 스마트검색, 아이콘매칭, PWA |
| v4.0 | 2026-01 | 가족 구독, 번들 최적화 |
| v3.0 | - | 위젯, 환율, 게이미피케이션 |

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management | v6.1.0
