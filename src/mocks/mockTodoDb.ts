import { Collection } from '@msw/data';
import z from 'zod';

const todoSchema = z.object({
  id: z.number(),
  name: z.string(),
  checked: z.boolean(),
})

export const todoDB = new Collection({
  schema: todoSchema,
})

/**
 * DB초기화: list 데이터 50개 초기화
 */
export const initDB = () => {

};