import { Collection } from "@msw/data";
import z from "zod";

const todoTemplates = [
  "MSW 설정하기",
  "Todo API 만들기",
  "Mock 데이터 작성하기",
  "UI 컴포넌트 개발하기",
  "배포 준비하기",
  "테스트 코드 작성하기",
  "문서 작성하기",
  "코드 리뷰하기",
  "버그 수정하기",
  "리팩토링하기",
];

const todoSchema = z.object({
  id: z.number(),
  name: z.string(),
  checked: z.boolean(),
});

export const todoDB = new Collection({
  schema: todoSchema,
});

/**
 * DB초기화: list 데이터 50개 초기화
 */
export const initDB = () => {
  return todoDB.createMany(50, (index) => ({
    id: index + 1,
    name: `${todoTemplates[index % 10]}-${index + 1}`,
    checked: false,
  }));
};
