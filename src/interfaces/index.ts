/**
 * 할일 항목
 */
export interface TodoItem {
  id: number;
  name: string;
  checked: boolean;
}

export type TNewTodo = Omit<TodoItem, 'id' | 'checked'>;