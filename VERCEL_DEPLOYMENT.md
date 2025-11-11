# Vercel 배포 가이드 (Edge Function 사용 버전)

## ✅ 배포 전 체크리스트

### 1. Edge Function 배포 완료 확인
- ✅ Edge Function 배포 완료 (`openai-proxy`)
- ✅ 환경 변수 설정 완료 (`OPENAI_API_KEY` in Supabase)

### 2. 환경 변수 설정 (Vercel)

**중요**: Edge Function을 사용하므로 클라이언트에서 OpenAI 키가 필요 없습니다!

Vercel 대시보드에서 다음 환경 변수만 설정하세요:

```
REACT_APP_SUPABASE_URL=https://ydlmkmgwxinfbhqbdben.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**설정 방법:**
1. Vercel 프로젝트 → Settings → Environment Variables
2. 각 변수를 추가 (Production, Preview, Development 모두 선택)
3. 저장

**⚠️ 주의**: `REACT_APP_OPENAI_API_KEY`는 설정하지 마세요! (Edge Function에서 사용)

### 3. 빌드 확인
로컬에서 빌드 테스트:
```bash
npm run build
```

### 4. GitHub 연동 (자동 배포)
- Vercel에서 GitHub 저장소 연결
- 브랜치 선택 (main 또는 profile)
- 자동 배포 활성화

## 🚀 배포 단계

### 방법 1: Vercel CLI (빠름)
```bash
# Vercel CLI 설치 (필요시)
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동 (권장)
1. **GitHub에 코드 푸시**
   ```bash
   git add .
   git commit -m "Add Edge Function support"
   git push origin profile  # 또는 main
   ```

2. **Vercel 웹사이트에서 배포**
   - https://vercel.com 접속
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정:
     - Framework Preset: Create React App
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Environment Variables 설정 (위 참고)
   - "Deploy" 클릭

3. **자동 배포 설정**
   - Settings → Git
   - Production Branch: `main` 또는 `profile`
   - 자동 배포 활성화

## ⚠️ 주의사항

1. **환경 변수**: 
   - ✅ `REACT_APP_SUPABASE_URL` 설정 필요
   - ✅ `REACT_APP_SUPABASE_ANON_KEY` 설정 필요
   - ❌ `REACT_APP_OPENAI_API_KEY` 설정 불필요 (Edge Function 사용)

2. **Edge Function 환경 변수**:
   - Supabase Dashboard에서 `OPENAI_API_KEY` 설정 필요
   - Vercel에서는 설정하지 않음

3. **Supabase CORS 설정**:
   - Supabase에서 Vercel 도메인을 허용해야 할 수 있음
   - Settings → API → CORS 설정

## 🔧 배포 후 확인사항

1. ✅ 환경 변수가 제대로 로드되는지 확인
2. ✅ Supabase 연결 확인
3. ✅ Edge Function 작동 확인 (채팅 테스트)
4. ✅ 모든 페이지 정상 작동 확인

## 📝 수정사항 반영 방법

배포 후 수정사항 반영은 매우 간단합니다:

```bash
# 1. 코드 수정
# 2. 커밋 & 푸시
git add .
git commit -m "수정사항"
git push origin main  # 또는 profile

# 3. 자동으로 Vercel이 배포 시작 (약 1-2분)
# 4. 완료!
```

## 🎯 현재 상태

- ✅ Edge Function 배포 완료
- ✅ 코드 수정 완료 (Edge Function 사용)
- ✅ vercel.json 설정 완료
- ✅ 배포 준비 완료!

**결론**: Vercel 배포 준비가 완료되었습니다! 🎉
