import { useEffect, useState } from "react";
import "./index.css";
import { createTodo, deleteTodo, fetchTodoList, updateTodo } from "./api";
import type { TodoItem } from "./interfaces";

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadTodos();
  }, [page]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await fetchTodoList({
        search: searchQuery || undefined,
        page,
        perPage,
      });
      setTodos(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to load todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 검색 시 첫 페이지로
    loadTodos();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(total / perPage);
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    try {
      const newTodo = await createTodo({
        name: newTodoName,
      });
      setTodos([...todos, newTodo]);
      setNewTodoName("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const handleToggleTodo = async (todo: TodoItem) => {
    try {
      const updatedTodo = await updateTodo({
        ...todo,
        checked: !todo.checked,
      });
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Todo List
        </h1>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search todos..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <form onSubmit={handleCreateTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <>
            <div className="space-y-2">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No todos yet. Add one above!
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <input
                      type="checkbox"
                      checked={todo.checked}
                      onChange={() => handleToggleTodo(todo)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${
                        todo.checked
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.name}
                    </span>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {total > 0 && (
              <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * perPage + 1} to{" "}
                  {Math.min(page * perPage, total)} of {total} todos
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700">
                    Page {page} of {Math.ceil(total / perPage)}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={page >= Math.ceil(total / perPage)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
