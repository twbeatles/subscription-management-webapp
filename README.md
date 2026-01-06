# 구독 매니저 Pro v5.0 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-5.0.0-blue)

## ✨ v5.0 주요 업데이트

### 🆕 새로운 기능

#### 1. 📅 **결제 캘린더 뷰**
- 월별 결제 일정 시각화
- 날짜별 구독 목록 확인
- 카테고리별 색상 표시
- 월별 총 지출 요약

#### 2. 🔍 **스마트 검색 (Cmd/Ctrl + K)**
- 전역 키보드 단축키 지원
- 구독명, 카테고리, 메모 통합 검색
- 검색어 하이라이팅
- 검색 히스토리 저장
- 키보드 네비게이션 (↑↓ Enter)

#### 3. 🎨 **구독 아이콘 자동 매칭**
- 50+ 서비스 로고 자동 표시
- Netflix, YouTube, Spotify 등 주요 서비스 지원
- Favicon 폴백 지원
- 우아한 이미지 로드 실패 처리

#### 4. 📱 **PWA 푸시 알림**
- Service Worker 기반 오프라인 지원
- 결제일 알림 기능
- 앱 설치 지원 (홈 화면 추가)

---

## ✨ v4.0 주요 업데이트


#### 1. 👨‍👩‍👧‍👦 **그룹/가족 구독 관리**
- 가족 구성원별 구독 분담 설정
- N분의 1 자동 비용 분할 계산
- 멤버별 지출 현황 추적

#### 2. ⏰ **자동 해지 리마인더**
- 무료 체험 종료 알림 (7일/3일/1일 전)
- 캘린더(ICS) 내보내기 지원
- 체험 구독 목록 관리

#### 3. 📦 **번들 최적화 분석**
- 개별 구독 vs 번들 비용 비교
- Apple One, YouTube Premium 등 번들 제안
- 예상 절약 금액 계산

#### 4. 📜 **구독 히스토리 타임라인**
- 월별 구독 추가/해지 이력
- 지출 변화 추이 그래프
- 필터링 및 검색 기능

#### 5. 📊 **퀵 스탯 위젯**
- 홈 탭 대시보드 위젯
- 이번 주 결제 예정 현황
- 예산 사용률 프로그레스

---

### 🚀 성능 최적화 (v4.0)

#### React.memo 적용
- `SubscriptionCard` - 리스트 리렌더링 방지
- `DonutChart` - 차트 캐싱
- `Dashboard` - 복잡 계산 최적화

#### Lazy Loading 확대
- 26개 컴포넌트 동적 로딩
- 초기 번들 크기 대폭 감소
- 탭별 온디맨드 로드

#### 메모리 누수 방지
- useEffect cleanup 추가
- setTimeout 정리 로직

---

## 📱 주요 기능 (전체)

### 홈 탭
- 💰 월간 예상 지출 대시보드
- 📅 결제 일정 캘린더
- 🏆 구독 건강 점수
- 📊 퀵 스탯 위젯

### 구독 탭
- 📋 구독 목록 및 필터링
- ➕ 구독 추가/수정/삭제
- ⏸️ 일시정지 기능
- 📊 테이블 뷰

### 분석 탭
- 📈 소득 대비 지출 분석
- 🧮 비용 시뮬레이터
- 📉 가격 변동 추적
- 📋 월간/연간 리포트

### 관리 탭
- 💳 결제 수단 관리
- 🔔 갱신 알림
- 📊 사용 빈도 추적
- 🎯 목표 & 게이미피케이션
- 👨‍👩‍👧‍👦 가족 구독 관리
- 📜 히스토리 타임라인

### 도구 탭
- 💡 스마트 추천
- ⏰ 자동 해지 리마인더
- 📦 번들 최적화
- ⚖️ 구독 비교
- 🧾 영수증 관리
- 💱 환율 변환
- 📤 가계부 내보내기
- 🔒 보안 설정

---

## 🚀 시작하기

### 요구사항
- Node.js 18+ 또는 20+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npx serve dist
```

## 📁 프로젝트 구조

```
src/
├── components/               # UI 컴포넌트 (42개)
│   ├── FamilySharingManager.jsx  # [NEW v4] 가족 구독 관리
│   ├── AutoCancelReminder.jsx    # [NEW v4] 자동 해지 리마인더
│   ├── BundleOptimizer.jsx       # [NEW v4] 번들 최적화
│   ├── SubscriptionHistory.jsx   # [NEW v4] 히스토리 타임라인
│   ├── QuickStatsWidget.jsx      # [NEW v4] 퀵 스탯 위젯
│   ├── SubscriptionCard.jsx      # [PERF] React.memo 적용
│   ├── DonutChart.jsx            # [PERF] React.memo 적용
│   ├── Dashboard.jsx             # [PERF] React.memo 적용
│   └── ...
├── hooks/
│   └── useSubscriptions.js   # 구독 데이터 훅
├── utils/
│   ├── localStorageManager.js    # 로컬 데이터 관리
│   ├── formatters.js             # [NEW v4] 포맷팅 유틸리티
│   ├── constants.js              # 상수 정의
│   └── dateHelpers.js            # 날짜 유틸리티
├── context/
│   ├── AuthContext.jsx       # 인증 컨텍스트
│   └── ThemeContext.jsx      # 테마 컨텍스트
├── pages/
│   ├── LoginPage.jsx         # 로그인 페이지
│   └── ProfilePage.jsx       # 프로필 페이지
├── App.jsx                   # [PERF] Lazy Loading, Suspense
└── index.css                 # [UPDATE] 타이포그래피 개선
```

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18.3, Vite 5.4 |
| Styling | TailwindCSS 3.4 |
| Icons | Lucide React |
| Charts | Recharts |
| Storage | LocalStorage (Demo) |
| Auth | Firebase (Optional) |

## 📊 빌드 정보

```
dist/
├── assets/
│   ├── index-*.js          # 247KB (메인 번들)
│   ├── index-*.css         # 80KB (스타일)
│   ├── vendor-react-*.js   # 177KB (React)
│   └── vendor-ui-*.js      # 37KB (UI 라이브러리)
├── index.html
└── manifest.json
```

## 🚢 배포

빌드 후 `dist/` 폴더를 정적 호스팅에 배포:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# GitHub Pages
npm run build && npx gh-pages -d dist
```

## 🔄 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|------|------|----------|
| v5.0 | 2026-01 | 캘린더뷰, 스마트검색, 아이콘매칭, PWA알림 |
| v4.0 | 2026-01 | 가족 구독, 번들 최적화, 성능 개선 |
| v3.0 | - | 위젯, 환율, 게이미피케이션 |
| v2.0 | - | 다크모드, 분석 기능 |
| v1.0 | - | 초기 버전 |

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management | v4.0.0
