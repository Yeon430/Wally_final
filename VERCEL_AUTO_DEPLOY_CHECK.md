# Vercel 자동 배포 확인 방법

## 🔍 자동 배포 설정 확인

### 방법 1: Vercel Dashboard에서 확인

1. **Vercel Dashboard 접속**
   - https://vercel.com/yeonwoos-projects-d44e7542/wally3

2. **Settings → Git 이동**
   - 왼쪽 메뉴에서 **"Settings"** 클릭
   - **"Git"** 섹션 클릭

3. **확인 사항:**
   - ✅ **"Production Branch"**: `main`으로 설정되어 있는지 확인
   - ✅ **"Automatic deployments"**: 켜져 있는지 확인
   - ✅ **"Deploy Hooks"**: 자동 배포가 활성화되어 있는지 확인

### 방법 2: GitHub Webhook 확인

1. **GitHub Repository 접속**
   - https://github.com/suhhee1128-pixel/wally3

2. **Settings → Webhooks 이동**
   - Repository → **"Settings"** 클릭
   - 왼쪽 메뉴에서 **"Webhooks"** 클릭

3. **확인 사항:**
   - ✅ Vercel webhook이 있는지 확인
   - ✅ URL이 `https://api.vercel.com/v1/integrations/github/...` 형태인지 확인
   - ✅ "Just the push event" 또는 "Let me select individual events" 선택되어 있는지 확인

### 방법 3: 실제 테스트

1. **작은 변경사항 만들기**
   ```bash
   # README 파일에 주석 추가
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test auto deployment"
   git push origin main
   ```

2. **Vercel Dashboard 확인**
   - Vercel Dashboard → **"Deployments"** 탭
   - 새 배포가 자동으로 시작되는지 확인
   - "Triggered by GitHub push" 메시지 확인

## ⚠️ 자동 배포가 안 되는 경우

### 문제 1: Git 연결이 안 되어 있음
- **해결**: Settings → Git → "Connect Git Repository" 클릭

### 문제 2: Production Branch가 다름
- **해결**: Settings → Git → Production Branch를 `main`으로 변경

### 문제 3: Webhook이 없음
- **해결**: Vercel에서 Git 연결을 다시 설정하면 자동으로 생성됨

### 문제 4: Vercel이 다른 리포지토리를 보고 있음
- **해결**: Settings → Git에서 올바른 리포지토리(`suhhee1128-pixel/wally3`)인지 확인

## 📊 배포 히스토리 확인

1. **Vercel Dashboard → Deployments**
2. 각 배포의 **"Source"** 확인
   - "Triggered by GitHub push" → 자동 배포 ✅
   - "Triggered manually" → 수동 배포
   - "Triggered by Vercel CLI" → CLI 배포

## 🎯 확인 체크리스트

- [ ] Settings → Git에서 Production Branch가 `main`인지 확인
- [ ] GitHub Webhooks에 Vercel webhook이 있는지 확인
- [ ] 최근 배포가 "Triggered by GitHub push"인지 확인
- [ ] 테스트 커밋으로 자동 배포 테스트




