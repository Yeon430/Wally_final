# Edge Function 사용 시 동작 방식

## 🔄 현재 구조 vs Edge Function 구조

### 현재 구조 (문제 있음)
```
사용자 브라우저
  ↓
React 앱 (API 키 노출됨!)
  ↓
직접 Gemini API 호출
  ↓
응답 받기
```

**문제점:**
- API 키가 브라우저 JavaScript 코드에 포함됨
- 누구나 개발자 도구로 키 확인 가능
- 다른 사람이 키를 복사해서 사용 가능

### Edge Function 구조 (안전함)
```
사용자 브라우저
  ↓
React 앱 (API 키 없음!)
  ↓
Supabase Edge Function 호출
  ↓ (서버에서만 API 키 사용)
Edge Function이 Gemini API 호출
  ↓
응답을 브라우저로 전달
```

**장점:**
- API 키가 서버에만 존재 (브라우저에 노출 안 됨)
- 다른 사람이 키를 볼 수 없음
- 요금 안전하게 관리 가능

## 📊 구체적인 변화

### 1. 클라이언트 코드 변경

**현재 (ChatPage.js):**
```javascript
// ❌ API 키가 코드에 포함됨
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// 직접 Gemini API 호출
const response = await fetch(GEMINI_API_URL, {
  method: 'POST',
  body: JSON.stringify({ contents: [...] })
});
```

**Edge Function 사용 시:**
```javascript
// ✅ API 키 없음!
// Supabase Edge Function 호출
const { data, error } = await supabase.functions.invoke('gemini-proxy', {
  body: {
    prompt: prompt,
    spendingContext: spendingContext,
    aiId: aiId
  }
});
```

### 2. Edge Function 생성

**위치:** `supabase/functions/gemini-proxy/index.ts`

**역할:**
- 서버에서만 실행됨
- API 키를 환경 변수에서 가져옴
- Gemini API를 대신 호출
- 응답을 클라이언트로 전달

### 3. 환경 변수 설정

**Supabase Dashboard에서:**
- Edge Functions → Settings → Secrets
- `GEMINI_API_KEY` 추가
- 서버에서만 접근 가능

## 🎯 실제 동작 흐름

### 사용자가 메시지 보낼 때:

1. **사용자**: "커피 사고 싶어" 입력
2. **React 앱**: Supabase Edge Function 호출
   ```javascript
   supabase.functions.invoke('gemini-proxy', {
     body: { prompt: "...", aiId: "catty" }
   })
   ```
3. **Edge Function**: 
   - 서버에서 실행
   - 환경 변수에서 API 키 가져옴
   - Gemini API 호출
   - 응답 받음
4. **React 앱**: 응답 받아서 화면에 표시

## 💰 비용 및 성능

### 비용
- **Supabase Edge Functions**: 무료 플랜에서도 사용 가능
- **추가 비용 없음** (Supabase 무료 플랜으로 충분)

### 성능
- **속도**: 거의 동일 (Edge Function이 프록시 역할만 함)
- **지연**: 약간 증가할 수 있지만 체감 어려움
- **장점**: API 키 보안 + 요금 보호

## 🔒 보안 비교

### 현재 구조
```
브라우저 개발자 도구 열기
  → Network 탭
  → Gemini API 요청 확인
  → API 키 복사 가능 ❌
```

### Edge Function 구조
```
브라우저 개발자 도구 열기
  → Network 탭
  → Supabase Edge Function 요청만 보임
  → API 키는 보이지 않음 ✅
```

## 📝 요약

**Edge Function을 사용하면:**

1. ✅ API 키가 서버에만 존재 (브라우저에 노출 안 됨)
2. ✅ 다른 사람이 키를 볼 수 없음
3. ✅ 요금 안전하게 관리 가능
4. ✅ 추가 비용 없음 (Supabase 무료 플랜)
5. ✅ 성능 영향 거의 없음
6. ✅ 코드 변경 최소화

**결론:** Edge Function을 사용하면 API 키 보안 문제가 완전히 해결됩니다! 🎉

