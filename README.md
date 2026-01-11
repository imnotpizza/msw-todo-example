# MSW Todo Example

블로그 글 검증 및 시연용 MSW(Mock Service Worker)를 활용한 Todo 프로젝트

## 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **API Mocking**: MSW 2.x
- **Mock DB**: @msw/data
- **Validation**: Zod 4

## 프로젝트 구조

```
src/
├── api/              # API 호출 함수들
│   └── index.ts      # createTodo, fetchTodoList, updateTodo, deleteTodo
├── interfaces/       # TypeScript 인터페이스
│   └── index.ts      # TodoItem, TNewTodo
├── mocks/            # MSW 설정
│   ├── browser.ts    # 브라우저 환경용 MSW worker
│   ├── server.ts     # 서버 환경용 MSW server (SSR/테스트)
│   ├── startMsw.ts   # MSW 실행 함수
│   ├── handlers.ts   # API 핸들러 정의
│   └── mockTodoDb.ts # @msw/data를 이용한 mock DB
├── App.tsx           # 메인 애플리케이션
└── main.tsx          # 진입점 (MSW 초기화)
```

## 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 일반 개발 모드 (MSW 비활성화)
```bash
npm run dev
```

### 3. MSW 활성화 모드
```bash
npm run dev:mock
```

`VITE_MSW_ENABLED=true` 환경 변수가 주입되어 MSW가 활성화됩니다.

## 구조 간략 설명

### `src/mocks/startMsw.ts`
MSW를 실행하기 위한 코드입니다. `VITE_MSW_ENABLED` 환경변수가 `true`일 때만 실행되며, 환경에 따라 browser 또는 server worker를 동적으로 import하여 실행합니다.

```typescript
export async function startMsw() {
  if (import.meta.env.NODE_ENV === "production") return;
  if (typeof window !== "undefined" && import.meta.env.NODE_ENV !== "test") {
    // 브라우저 환경
    const worker = await import("./browser").then((res) => res.default);
    await worker.start({
      onUnhandledRequest: "bypass",
    });
  } else {
    // 서버 환경 (SSR, 테스트)
    const server = await import("./server").then((res) => res.default);
    server.listen({});
  }
}
```

## API 엔드포인트

- `GET /api/todos` - 할일 목록 조회 (50개 자동 생성)
- `POST /api/todos` - 할일 추가
- `PUT /api/todos/:id` - 할일 수정
- `DELETE /api/todos/:id` - 할일 삭제

## MSW 작동 방식

1. 브라우저에서 fetch/axios 등으로 API 요청 발생
2. Service Worker가 네트워크 레벨에서 요청을 가로챔
3. MSW에 등록된 handler 중 일치하는 것을 탐색
4. 일치하는 handler가 있으면 mock response 반환, 없으면 실제 서버로 전달