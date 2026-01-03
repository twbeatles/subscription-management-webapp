# 구독 매니저 Pro v3.0 💳

스마트한 구독 서비스 관리를 위한 React 기반 웹 애플리케이션입니다.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-3.0.0-blue)

## ✨ v3.0 주요 업데이트

### 1. 📱 **위젯 & 빠른 보기**
- 우측 하단 플로팅 위젯으로 다가오는/금주 예정 결제 즉시 확인
- 클릭 시 상세 정보 확장

### 2. 💸 **환율 자동 변환**
- 해외 구독(USD, EUR, JPY) 비용 실시간 원화(KRW) 환산
- 24시간 자동 업데이트 및 캐싱

### 3. 📊 **사용 빈도 추적**
- 구독별 사용 체크인 시스템
- GitHub 스타일의 사용 빈도 히트맵
- 저사용 구독 자동 감지 및 낭비 경고

### 4. 🎯 **목표 & 게이미피케이션**
- 저축 목표 설정 및 달성 현황
- 구독 정리/절약 챌린지 및 배지 시스템
- 레벨 및 XP 성취 시스템

### 5. 🔗 **결제 수단 관리**
- 카드/계좌별 구독 연결 관리
- 결제 수단별 월 지출 합계
- 만료 카드 관리

### 6. 🗓️ **갱신 알림**
- 연간 구독 갱신일 카운트다운
- 30일/7일/3일/1일 전 알림
- 자동 갱신 유무 표시

### 7. 🏠 **가계부 연동**
- Toss, 뱅크샐러드, Excel, QIF 형식 내보내기 지원
- 외부 가계부 앱 연동 가이드

### 8. 📊 **리포트 & 인사이트**
- 월간/연간 지출 심층 분석
- 카테고리별 비중 및 전월 대비 증감 리포트
- PDF 리포트 다운로드

### 9. 🔒 **보안 설정**
- 4자리 PIN 잠금 기능
- 자동 잠금 타이머
- 데이터 백업 및 복원 (JSON)

### 10. 🎨 **UI/UX 전면 개편**
- **5-Tap 네비게이션**: 홈 / 구독 / 분석 / 관리 / 도구
- **가독성 향상**: 폰트 크기 최적화 및 레이아웃 개선
- **다크 모드**: 모든 신규 기능 다크 모드 완벽 지원

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
├── components/           # UI 컴포넌트 (30개+)
│   ├── QuickViewWidget.jsx    # [NEW] 퀵뷰 위젯
│   ├── MainTabNavigation.jsx  # [NEW] 탭 네비게이션
│   ├── GoalsSavings.jsx       # [NEW] 목표 & 게이미피케이션
│   ├── ReportsInsights.jsx    # [NEW] 리포트 & 인사이트
│   ├── PaymentMethodManager.jsx # [NEW] 결제 수단 관리
│   ├── UsageTracker.jsx       # [NEW] 사용 빈도 추적
│   ├── CurrencyConverter.jsx  # [NEW] 환율 변환기
│   ├── SecuritySettings.jsx   # [NEW] 보안 설정
│   └── ...
├── utils/                
│   ├── localStorageManager.js # [UPDATE] 데이터 관리 확장
│   └── constants.js           # [UPDATE] 상수 확장
├── App.jsx               # [UPDATE] 탭 기반 라우팅
└── index.css             # [UPDATE] 타이포그래피 개선
```

## 🛠️ 기술 스택

- **Frontend**: React 18, Vite 5
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: LocalStorage (Demo), Firebase (Optional)

## 🚢 배포

빌드 후 `dist/` 폴더를 정적 호스팅에 배포:

```bash
# Vercel
vercel --prod

# Netlify
# dist 폴더 업로드
```

## 📄 라이선스

MIT License

---

Made with ❤️ for better subscription management | v3.0.0
