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
        checked: true,
      },
      {
        id: 2,
        name: "Todo API 만들기",
        checked: true,
      },
      {
        id: 3,
        name: "Mock 데이터 작성하기",
        checked: false,
      },
      {
        id: 4,
        name: "UI 컴포넌트 개발하기",
        checked: false,
      },
      {
        id: 5,
        name: "배포 준비하기",
        checked: false,
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
  http.put(baseUrl + "/api/todos/:id", async ({ request, params }) => {
    const { id } = params;
    const updateData = (await request.json()) as TodoItem;

    // id가 없으면 400 에러
    if (!id) {
      return HttpResponse.json({ error: "id가 없습니다." }, { status: 400 });
    }

    // 수정할 데이터가 없으면 400 에러
    if (!updateData || Object.keys(updateData).length === 0) {
      return HttpResponse.json(
        { error: "수정할 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // name이 빈 문자열인 경우 400 에러
    if (updateData.name !== undefined && updateData.name.trim() === "") {
      return HttpResponse.json(
        { error: "name은 빈 문자열일 수 없습니다." },
        { status: 400 }
      );
    }

    // 수정된 todo 반환
    const updatedTodo: TodoItem = {
      id: Number(id),
      name: updateData.name || "Updated Todo",
      checked: updateData.checked,
    };

    return HttpResponse.json(updatedTodo, {
      status: 200,
    });
  }),

  // DELETE /api/todos/:id - 할일 삭제
  http.delete(baseUrl + "/api/todos/:id", ({ params }) => {
    const { id } = params;
    // id가 없으면 400처리
    if (!id) {
      return HttpResponse.json({ error: "id가 없습니다." }, { status: 400 });
    }

    // 삭제 성공 응답
    return HttpResponse.json(
      { message: "삭제되었습니다.", id: Number(id) },
      { status: 200 }
    );
  }),
];
