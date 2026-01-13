import type { TNewTodo, TodoItem } from "../interfaces";

const baseUrl = "https://myapi/v2";

/**
 * 할일 추가
 */
export async function createTodo(todo: TNewTodo): Promise<TodoItem> {
  const response = await fetch(baseUrl + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return response.json();
}

/**
 * 할일 목록
 */
export async function fetchTodoList(search?: string): Promise<TodoItem[]> {
  const url = new URL(baseUrl + "/api/todos");
  if (search) {
    url.searchParams.append("search", search);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch todo list");
  }

  return response.json();
}

/**
 * 할일 수정
 */
export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  const response = await fetch(baseUrl + `/api/todos/${todo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Failed to update todo");
  }

  return response.json();
}

/**
 * 할일 제거
 */
export async function deleteTodo(todoId: TodoItem["id"]): Promise<void> {
  const response = await fetch(baseUrl + `/api/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}
