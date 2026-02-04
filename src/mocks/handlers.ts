import { http, HttpResponse } from "msw";
import type { TNewTodo, TodoItem } from "../interfaces";
import { initDB, todoDB } from "./mockTodoDb";

const baseUrl = "https://myapi/v2";

let initialized = false;

export const handlers = [
  // GET /api/todos - 할일 목록 조회
  http.get(baseUrl + "/api/todos", async ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = parseInt(url.searchParams.get("perPage") || "10", 10);
    // skip, take 계산
    const skip = (page - 1) * perPage;
    const take = perPage;

    // DB 초기화
    if (!initialized) {
      await initDB();
      initialized = true;
    }


    let mockData: any[] = [];
    let total = 0;

    // 검색어가 있으면 필터링
    if (search && search.trim() !== "") {
      const allSearchResults = todoDB.findMany((q) =>
        q.where({ name: (name) => name.includes(search) })
      );
      total = allSearchResults.length;
      mockData = todoDB.findMany(
        (q) => q.where({ name: (name) => name.includes(search) }),
        {
          skip,
          take,
        }
      );
    } else {
      // 전체 목록
      const allData = todoDB.findMany(undefined);
      total = allData.length;
      mockData = todoDB.findMany(undefined, {
        skip,
        take,
      });
    }

    return HttpResponse.json(
      {
        data: mockData,
        total,
        page,
        perPage,
      },
      {
        status: 200,
      }
    );
  }),

  // POST /api/todos - 할일 추가
  http.post(baseUrl + "/api/todos", async ({ request }) => {
    const newTodo = (await request.json()) as TNewTodo;

    // newTodo 형식 검증: name이 없거나 빈 문자열이면 400 에러
    if (!newTodo || !newTodo.name || newTodo.name.trim() === "") {
      return HttpResponse.json({ error: "name이 없습니다." }, { status: 400 });
    }
    // create 수행
    const createdTodo = await todoDB.create({
      id: Date.now(),
      name: newTodo.name,
      checked: false,
    });

    return HttpResponse.json(createdTodo, {
      status: 201,
    });
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

    const targetId = Number(id);

    // DB update 수행
    const updatedTodo = await todoDB.update((q) => q.where({ id: targetId }), {
      data(todo) {
        (todo.checked = updateData.checked), (todo.name = updateData.name);
      },
    });

    return HttpResponse.json(updatedTodo, {
      status: 200,
    });
  }),

  // DELETE /api/todos/:id - 할일 삭제
  http.delete(baseUrl + "/api/todos/:id", async ({ params }) => {
    const { id } = params;
    // id가 없으면 400처리
    if (!id) {
      return HttpResponse.json({ error: "id가 없습니다." }, { status: 400 });
    }
    const targetId = Number(id);

    await todoDB.delete((q) => q.where({ id: targetId }));

    // 삭제 성공 응답
    return HttpResponse.json(
      { message: "삭제되었습니다.", id: Number(id) },
      { status: 200 }
    );
  }),
];
