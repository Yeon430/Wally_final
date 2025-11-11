# Edge Function 배포 가이드 (수정됨)

## ✅ 완료된 작업

1. ✅ Edge Function 코드 생성 (`supabase/functions/openai-proxy/index.ts`)
2. ✅ 클라이언트 코드 수정 (Edge Function 호출로 변경)
3. ✅ API 키 제거 (클라이언트에서 제거됨)

## 📋 배포 단계

### 1. Supabase CLI 사용 (전역 설치 불필요!)

**npx를 사용하면 전역 설치 없이 사용 가능합니다:**

```bash
# 로그인 (npx 사용)
npx supabase login

# 프로젝트 연결
npx supabase link --project-ref YOUR_PROJECT_REF

# Edge Function 배포
npx supabase functions deploy openai-proxy
```

**또는 sudo 사용 (권한 문제 해결):**
```bash
sudo npm install -g supabase
supabase login
```

### 2. Supabase 로그인

```bash
npx supabase login
```

브라우저가 열리면 Supabase 계정으로 로그인하세요.

### 3. 프로젝트 연결

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

**프로젝트 REF 찾는 방법:**
- Supabase Dashboard → Settings → General
- Reference ID 복사

또는 Supabase URL에서 찾기:
- URL: `https://YOUR_PROJECT_REF.supabase.co`
- `YOUR_PROJECT_REF` 부분이 프로젝트 REF입니다

**예시:**
- URL이 `https://ydlmkmgwxinfbhqbdben.supabase.co`라면
- 프로젝트 REF는 `ydlmkmgwxinfbhqbdben`

### 4. 환경 변수 설정

Supabase Dashboard에서 환경 변수 설정:

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **Edge Functions → Settings → Secrets**
   - "Add new secret" 클릭
   - Name: `OPENAI_API_KEY`
   - Value: OpenAI API 키 입력
   - "Save" 클릭

### 5. Edge Function 배포

```bash
npx supabase functions deploy openai-proxy
```

배포가 완료되면:
```
Deployed Function openai-proxy
```

### 6. 테스트

로컬에서 테스트:

```bash
# 로컬 서버 재시작
npm start
```

브라우저에서 채팅을 보내서 정상 작동하는지 확인하세요.

## 🔍 문제 해결

### 권한 오류 해결

**방법 1: npx 사용 (권장)**
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy openai-proxy
```

**방법 2: sudo 사용**
```bash
sudo npm install -g supabase
supabase login
```

### Edge Function이 작동하지 않는 경우

1. **환경 변수 확인**
   - Supabase Dashboard → Edge Functions → Settings → Secrets
   - `OPENAI_API_KEY`가 설정되어 있는지 확인

2. **배포 확인**
   ```bash
   npx supabase functions list
   ```
   - `openai-proxy`가 목록에 있는지 확인

3. **로그 확인**
   - Supabase Dashboard → Edge Functions → Logs
   - 에러 메시지 확인

### 클라이언트에서 에러가 발생하는 경우

1. **Supabase 클라이언트 확인**
   - `src/lib/supabase.js`에서 올바른 URL과 키가 설정되어 있는지 확인

2. **함수 이름 확인**
   - `supabase.functions.invoke('openai-proxy', ...)` 
   - 함수 이름이 정확한지 확인

## 📝 요약

**배포 전 체크리스트:**
- [ ] Supabase CLI 사용 준비 (npx 또는 sudo)
- [ ] Supabase 로그인
- [ ] 프로젝트 연결
- [ ] 환경 변수 설정 (`OPENAI_API_KEY`)
- [ ] Edge Function 배포
- [ ] 테스트 완료

**완료되면:**
- ✅ API 키가 서버에서만 사용됨
- ✅ 브라우저에 API 키 노출 안 됨
- ✅ 안전하게 배포 가능!
