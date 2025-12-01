const CACHE_NAME = 'chattypay-v4'; // 버전 업데이트하여 캐시 무효화
const urlsToCache = [
  '/',
  '/index.html'
];

// 설치 시 캐시 생성
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache install failed:', error);
      })
  );
  // 즉시 활성화
  self.skipWaiting();
});

// 활성화 시 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 즉시 클라이언트 제어
  return self.clients.claim();
});

// 요청 시 캐시에서 응답 또는 네트워크 요청
self.addEventListener('fetch', (event) => {
  // GET 요청만 캐시
  if (event.request.method !== 'GET') {
    return;
  }

  // HTML 파일은 항상 네트워크에서 가져오고, 캐시는 백업으로만 사용
  if (event.request.destination === 'document' || event.request.url.includes('/index.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 네트워크에서 가져온 응답 반환
          return response;
        })
        .catch(() => {
          // 네트워크 실패 시에만 캐시 사용
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 반환
        if (response) {
          return response;
        }
        // 없으면 네트워크 요청
        return fetch(event.request).then((response) => {
          // 유효한 응답인지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 응답 복제 (한 번만 읽을 수 있으므로)
          const responseToCache = response.clone();

          // 캐시에 저장
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // 오프라인일 때 기본 응답
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

