import { http, HttpResponse } from "msw";
import type { TNewTodo, TodoItem } from "../interfaces";

const baseUrl = "https://todoserver/v1";

export const handlers = [
  // GET /api/todos - 할일 목록 조회
  http.get(baseUrl + "/api/todos", () => {
    const mockData: TodoItem[] = [
      {
        id: 1,
        name: "MSW 설정하기",
        checked: "Y",
      },
      {
        id: 2,
        name: "Todo API 만들기",
        checked: "Y",
      },
      {
        id: 3,
        name: "Mock 데이터 작성하기",
        checked: "N",
      },
      {
        id: 4,
        name: "UI 컴포넌트 개발하기",
        checked: "N",
      },
      {
        id: 5,
        name: "배포 준비하기",
        checked: "N",
      },
    ];

    return HttpResponse.json(mockData, {
      status: 200,
    });
  }),

  // POST /api/todos - 할일 추가
  http.post(baseUrl + "/api/todos", async ({ request }) => {
    const newTodo = (await request.json()) as TNewTodo;

    // newTodo 형식 검증: name이 없거나 빈 문자열이면 400 에러
    if (!newTodo || !newTodo.name || newTodo.name.trim() === "") {
      return HttpResponse.json({ error: "name이 없습니다." }, { status: 400 });
    }

    return HttpResponse.json(
      {
        message: "ok",
      },
      {
        status: 201,
      }
    );
  }),

  // PUT /api/todos/:id - 할일 수정
  http.put(baseUrl + "/api/todos/:id", async ({ request, params }) => {}),

  // DELETE /api/todos/:id - 할일 삭제
  http.delete(baseUrl + "/api/todos/:id", ({ params }) => {}),
];
