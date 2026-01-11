
/**
 * msw 실행
 */
export async function startMsw() {
  if (import.meta.env.NODE_ENV === "production") return;
  if (typeof window !== "undefined" && import.meta.env.NODE_ENV !== "test") {
    const worker = await import("./browser").then((res) => res.default);
    await worker.start({
      onUnhandledRequest: "bypass", // 또는 'warn' | 'error'
    });
  } else {
    const server = await import("./server").then((res) => res.default);
    server.listen({});
  }
}
