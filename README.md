# 구독 매니저 Pro v2.0 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)

## ✨ 주요 기능

### 📊 **대시보드**
- 월간/연간 지출 요약
- 카테고리별 도넛 차트 분석
- 월별 지출 추이 그래프

### 🏥 **구독 건강 점수** (v2.0 NEW!)
- 0-100점 건강 점수 계산
- 중복 구독, 미사용 서비스 감지
- 예산 대비 비율 분석

### 💰 **수입 대비 분석** (v2.0 NEW!)
- 월 수입 설정 및 관리
- 구독 지출 비율 계산 (권장 10% 이하)
- 초과 시 경고 표시

### 📈 **비용 예측 시뮬레이터** (v2.0 NEW!)
- 3/6/12/24개월 지출 예측
- What-if 분석 (구독 추가/제거 시뮬레이션)
- 인플레이션 반영 옵션

### 📉 **가격 변동 추적** (v2.0 NEW!)
- 구독별 가격 히스토리
- 업계 평균 가격 비교
- 10% 이상 인상 경고

### 💡 **스마트 추천** (v2.0 NEW!)
- 더 저렴한 대안 서비스 추천
- 번들 할인 제안 (Apple One, 네이버 플러스 등)
- 가족 플랜 전환 제안

### 🏷️ **태그 시스템** (v2.0 NEW!)
- 커스텀 태그 생성
- 태그별 필터링

### 🎁 **무료 체험 트래커** (v2.0 NEW!)
- 체험 종료일 D-Day 표시
- 자동 결제 경고

### 👥 **공유 관리** (v2.0 NEW!)
- 비용 분담 계산기
- 멤버 관리

### 📎 **영수증 관리** (v2.0 NEW!)
- 이미지/PDF 첨부
- 미리보기 모달

### 📋 **해지 가이드** (v2.0 NEW!)
- 주요 서비스 10개 해지 방법
- 단계별 가이드

### 🔔 **알림 시스템**
- 결제 3일/1일 전 브라우저 알림
- 가격 인상 알림 토글

### 🌙 **테마 & 설정**
- 다크 모드 지원
- CSV/JSON 내보내기/가져오기
- 캘린더 내보내기 (.ics)

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

# 빌드 미리보기
npx serve dist
```

## 📁 프로젝트 구조

```
src/
├── components/           # UI 컴포넌트 (25개)
│   ├── HealthScore.jsx        # 구독 건강 점수
│   ├── IncomeAnalysis.jsx     # 수입 대비 분석
│   ├── CostSimulator.jsx      # 비용 시뮬레이터
│   ├── PriceTracker.jsx       # 가격 변동 추적
│   ├── SmartRecommendations.jsx # 스마트 추천
│   ├── SubscriptionCompare.jsx  # 구독 비교
│   ├── TagManager.jsx         # 태그 관리
│   ├── TrialTracker.jsx       # 체험 트래커
│   ├── SharingPanel.jsx       # 공유 관리
│   ├── ReceiptManager.jsx     # 영수증 관리
│   ├── CancellationGuide.jsx  # 해지 가이드
│   └── ... (기존 컴포넌트)
├── context/              # React Context
├── hooks/                # 커스텀 훅
├── pages/                # 페이지 컴포넌트
├── utils/                # 유틸리티 (7개)
│   ├── localStorageManager.js # 태그, 수입, 가격히스토리 저장
│   └── ...
├── App.jsx               # 메인 앱
└── index.css             # 글로벌 스타일
```

## 🛠️ 기술 스택

- **Frontend**: React 18, Vite 5
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts (라이트 버전)
- **Storage**: LocalStorage
- **PWA**: manifest.json 포함

## 🚢 배포

빌드 후 `dist/` 폴더를 정적 호스팅에 배포:

```bash
# Vercel
vercel --prod

# Netlify (드래그 앤 드롭)
# dist 폴더 업로드

# GitHub Pages
npm install -g gh-pages
gh-pages -d dist

# 로컬 미리보기
npx serve dist
```

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management | v2.0.0
