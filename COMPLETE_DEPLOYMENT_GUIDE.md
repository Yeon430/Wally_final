# Edge Function + Vercel 배포 완전 가이드

## ✅ 지금까지 한 작업

### 1. Edge Function 코드 생성 ✅
- `supabase/functions/openai-proxy/index.ts` 파일 생성
- OpenAI API를 프록시하는 서버 함수 생성
- API 키를 서버에서만 사용하도록 설정

### 2. 클라이언트 코드 수정 ✅
- `src/components/ChatPage.js` 수정
- 직접 OpenAI API 호출 → Edge Function 호출로 변경
- API 키가 클라이언트에서 제거됨

### 3. Edge Function 배포 ✅
- `npx supabase functions deploy openai-proxy` 실행 완료
- Edge Function이 Supabase에 배포됨

## 🎯 다음 단계 (필수!)

### 단계 1: Supabase 환경 변수 설정 (지금 바로!)

**⚠️ 중요**: Edge Function이 작동하려면 반드시 필요합니다!

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard/project/ydlmkmgwxinfbhqbdben 접속

2. **Edge Functions → Settings → Secrets**
   - "Add new secret" 클릭
   - Name: `OPENAI_API_KEY`
   - Value: OpenAI API 키 입력 (sk-proj-...로 시작)
   - "Save" 클릭

**왜 필요한가?**
- Edge Function이 OpenAI API를 호출하려면 API 키가 필요함
- 이 키는 서버에서만 사용되므로 안전함

### 단계 2: GitHub에 코드 푸시

```bash
# 변경사항 커밋
git add .
git commit -m "Add Edge Function support for OpenAI API"

# GitHub에 푸시
git push origin profile
```

### 단계 3: Vercel 배포

**방법 1: Vercel 웹사이트에서 (권장)**

1. **Vercel 접속**
   - https://vercel.com 접속
   - 로그인 (GitHub 계정으로)

2. **새 프로젝트 추가**
   - "Add New Project" 클릭
   - GitHub 저장소 선택 (`suhhee1128-pixel/wally3`)
   - 브랜치 선택 (`profile`)

3. **프로젝트 설정**
   - Framework Preset: Create React App (자동 감지됨)
   - Build Command: `npm run build` (자동 감지됨)
   - Output Directory: `build` (자동 감지됨)

4. **환경 변수 설정** (중요!)
   - "Environment Variables" 섹션 클릭
   - 다음 변수 추가:
     ```
     REACT_APP_SUPABASE_URL=https://ydlmkmgwxinfbhqbdben.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - ⚠️ `REACT_APP_OPENAI_API_KEY`는 추가하지 마세요! (Edge Function 사용)

5. **배포**
   - "Deploy" 클릭
   - 배포 완료 대기 (약 1-2분)

**방법 2: Vercel CLI 사용**

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 환경 변수 설정 (대화형으로 진행)
# 프로덕션 배포
vercel --prod
```

## 🔍 배포 후 확인사항

1. **배포된 사이트 접속**
   - Vercel에서 제공하는 URL로 접속

2. **채팅 테스트**
   - 채팅 페이지에서 메시지 보내기
   - Edge Function이 정상 작동하는지 확인

3. **에러 확인**
   - 브라우저 개발자 도구 (F12) → Console 탭
   - 에러 메시지 확인

## 📊 전체 흐름 요약

```
1. Edge Function 코드 생성 ✅
   ↓
2. 클라이언트 코드 수정 ✅
   ↓
3. Edge Function 배포 ✅ (완료!)
   ↓
4. Supabase 환경 변수 설정 (지금 해야 함!)
   ↓
5. GitHub에 코드 푸시
   ↓
6. Vercel 배포
   ↓
7. Vercel 환경 변수 설정 (Supabase만)
   ↓
8. 완료! 🎉
```

## ⚠️ 중요 체크리스트

- [ ] Supabase Dashboard에서 `OPENAI_API_KEY` 환경 변수 설정 완료
- [ ] GitHub에 코드 푸시 완료
- [ ] Vercel에서 프로젝트 생성 완료
- [ ] Vercel 환경 변수 설정 완료 (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
- [ ] 배포 완료 후 테스트 완료

## 🎯 지금 바로 해야 할 것

**가장 중요**: Supabase Dashboard에서 환경 변수 설정!

1. https://supabase.com/dashboard/project/ydlmkmgwxinfbhqbdben 접속
2. Edge Functions → Settings → Secrets
3. `OPENAI_API_KEY` 추가

이것을 하지 않으면 Edge Function이 작동하지 않습니다!

