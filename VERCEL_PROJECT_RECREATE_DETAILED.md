# Vercel 프로젝트 재생성 상세 가이드

## 📋 준비 사항

### 1. 환경 변수 확인 (중요!)

재생성 전에 현재 환경 변수를 확인하세요:

**필수 환경 변수:**
- `REACT_APP_SUPABASE_URL` = `https://ydlmkmgwxinfbhqbdben.supabase.co`
- `REACT_APP_SUPABASE_ANON_KEY` = (Supabase Dashboard에서 확인)

**선택 환경 변수:**
- `REACT_APP_GA_MEASUREMENT_ID` = `G-PEW2CSJ9GW`

### 2. Supabase Anon Key 확인 방법

1. [Supabase Dashboard](https://supabase.com/dashboard/project/ydlmkmgwxinfbhqbdben) 접속
2. **Settings** → **API** 클릭
3. **Project API keys** 섹션에서
4. **`anon` `public`** 키 복사 (이게 `REACT_APP_SUPABASE_ANON_KEY`입니다)

---

## 🗑️ 1단계: 기존 프로젝트 삭제

### 1-1. Vercel Dashboard 접속
1. 브라우저에서 [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 로그인 (필요 시)

### 1-2. 프로젝트 선택
1. 프로젝트 목록에서 **`wally3`** 클릭
2. 프로젝트 페이지로 이동

### 1-3. Settings로 이동
1. 상단 네비게이션 바에서 **"Settings"** 탭 클릭
2. 왼쪽 사이드바에서 **"General"** 클릭

### 1-4. 프로젝트 삭제
1. 페이지를 **맨 아래로 스크롤**
2. **"Danger Zone"** 섹션 찾기 (빨간색 경고 표시)
3. **"Delete Project"** 버튼 클릭
4. 확인 모달이 나타남:
   - 프로젝트 이름 입력: **`wally3`** 입력
   - **"Delete"** 버튼 클릭
5. 확인 완료!

---

## 🆕 2단계: 새 프로젝트 생성

### 2-1. 새 프로젝트 시작
1. Vercel Dashboard 메인 페이지로 돌아가기
   - 왼쪽 상단 **"Vercel"** 로고 클릭 또는 브라우저 뒤로가기
2. **"Add New..."** 버튼 클릭 (우측 상단 또는 중앙)
3. 드롭다운 메뉴에서 **"Project"** 선택

### 2-2. GitHub 저장소 선택
1. **"Import Git Repository"** 화면이 나타남
2. GitHub 저장소 목록에서 **`Yeon430/wally3`** 찾기
   - 검색창에 "wally3" 입력하면 빠르게 찾을 수 있음
3. **`Yeon430/wally3`** 옆의 **"Import"** 버튼 클릭

### 2-3. 프로젝트 설정

#### Framework Preset 설정
1. **"Framework Preset"** 섹션에서
2. 드롭다운 메뉴 클릭
3. **"Create React App"** 선택
   - 또는 자동으로 감지될 수 있음

#### Root Directory 설정
1. **"Root Directory"** 필드 확인
2. 기본값: **`./`** (그대로 두기)
3. 변경 필요 없음

#### Build and Output Settings 설정
1. **"Build Command"** 섹션:
   - **"Override"** 토글 스위치를 **켜기** (ON)
   - 입력 필드에 입력: **`CI=false npm run build`**
   
2. **"Output Directory"** 섹션:
   - 기본값: **`build`** (그대로 두기)
   - 변경 필요 없음

3. **"Install Command"** 섹션:
   - 기본값: **`npm install`** (그대로 두기)
   - 변경 필요 없음

### 2-4. 환경 변수 추가 (중요!)

**"Environment Variables"** 섹션에서:

#### 환경 변수 1: Supabase URL
1. **"Key"** 입력: `REACT_APP_SUPABASE_URL`
2. **"Value"** 입력: `https://ydlmkmgwxinfbhqbdben.supabase.co`
3. **"Environments"** 선택:
   - ✅ **Production** 체크
   - ✅ **Preview** 체크
   - ✅ **Development** 체크
4. **"Add"** 버튼 클릭

#### 환경 변수 2: Supabase Anon Key
1. **"Key"** 입력: `REACT_APP_SUPABASE_ANON_KEY`
2. **"Value"** 입력: (Supabase Dashboard에서 복사한 anon key)
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **"Environments"** 선택:
   - ✅ **Production** 체크
   - ✅ **Preview** 체크
   - ✅ **Development** 체크
4. **"Add"** 버튼 클릭

#### 환경 변수 3: Google Analytics (선택사항)
1. **"Key"** 입력: `REACT_APP_GA_MEASUREMENT_ID`
2. **"Value"** 입력: `G-PEW2CSJ9GW`
3. **"Environments"** 선택:
   - ✅ **Production** 체크
   - ✅ **Preview** 체크
   - ✅ **Development** 체크
4. **"Add"** 버튼 클릭

### 2-5. 프로젝트 이름 확인
1. **"Project Name"** 필드 확인
2. 기본값: **`wally3`** (그대로 두기)
3. 변경 필요 없음

### 2-6. 배포 시작!
1. 모든 설정이 완료되었는지 확인
2. 페이지 맨 아래로 스크롤
3. **"Deploy"** 버튼 클릭 (큰 파란색 버튼)
4. 배포가 시작됩니다!

---

## ⏳ 3단계: 배포 완료 대기

### 3-1. 배포 진행 확인
1. 배포 페이지로 자동 이동됨
2. **"Building..."** 상태 확인
3. 빌드 로그가 실시간으로 표시됨
4. 약 **1-2분** 소요

### 3-2. 배포 완료 확인
1. 상태가 **"Ready"**로 변경되면 완료!
2. 초록색 점이 표시됨
3. 배포 URL이 표시됨: `https://wally3.vercel.app`

---

## ✅ 4단계: 배포 확인

### 4-1. 사이트 접속
1. 배포 완료 후 **"Visit"** 버튼 클릭
2. 또는 직접 접속: `https://wally3.vercel.app`

### 4-2. Google Analytics 확인
1. 브라우저 개발자 도구 열기 (F12)
2. **Network** 탭 클릭
3. 필터에 **`gtag`** 입력
4. 페이지 새로고침 (Ctrl+R 또는 Cmd+R)
5. **`gtag/js?id=G-PEW2CSJ9GW`** 요청이 보여야 함 ✅

### 4-3. 콘솔 확인
1. 개발자 도구 → **Console** 탭
2. 다음 메시지들이 보여야 함:
   - `[index.js] Initializing Google Analytics with ID: G-PEW2CSJ9GW`
   - `gtag.js script loaded successfully`
   - `Google Analytics initialized: G-PEW2CSJ9GW`

### 4-4. Google Analytics 실시간 보고서 확인
1. [Google Analytics](https://analytics.google.com/) 접속
2. **보고서** → **실시간** → **개요**
3. 사이트 방문 시 방문자 수가 증가하는지 확인

---

## 🔄 5단계: 자동 배포 확인

### 5-1. 테스트 커밋 푸시
1. 로컬에서 빈 커밋 생성:
   ```bash
   git commit --allow-empty -m "Test auto-deploy"
   git push yeon430 main
   ```

### 5-2. Vercel 자동 배포 확인
1. Vercel Dashboard → **Deployments** 탭
2. 새 배포가 자동으로 시작되는지 확인
3. **"Test auto-deploy"** 커밋으로 배포가 시작되면 성공! ✅

---

## 🎯 체크리스트

배포 전 확인:
- [ ] Supabase Anon Key 준비됨
- [ ] 환경 변수 목록 확인됨

배포 중 확인:
- [ ] Framework Preset: Create React App 선택됨
- [ ] Build Command: `CI=false npm run build` 설정됨
- [ ] Output Directory: `build` 설정됨
- [ ] 환경 변수 3개 모두 추가됨

배포 후 확인:
- [ ] 사이트가 정상 작동함
- [ ] Google Analytics가 로드됨
- [ ] 자동 배포가 작동함

---

## 🆘 문제 해결

### 배포 실패 시
1. **Build Logs** 확인
2. 에러 메시지 확인
3. 환경 변수가 올바르게 설정되었는지 확인

### Google Analytics가 작동하지 않으면
1. 브라우저 콘솔에서 에러 확인
2. Network 탭에서 `gtag.js` 요청 확인
3. 환경 변수 `REACT_APP_GA_MEASUREMENT_ID` 확인

### 자동 배포가 안 되면
1. Settings → Git에서 저장소 연결 확인
2. GitHub → Settings → Webhooks에서 Vercel webhook 확인

---

## 📝 참고사항

- 프로젝트를 삭제해도 GitHub 저장소는 그대로 유지됩니다
- 환경 변수는 새 프로젝트에 다시 추가해야 합니다
- 도메인 설정도 새 프로젝트에 다시 연결해야 합니다
- 배포 히스토리는 새로 시작됩니다

준비되면 시작하세요! 🚀



