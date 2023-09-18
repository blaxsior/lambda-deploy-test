import { getNewsAndCommentResults } from './crawling/index.js';
export const handler = async (): Promise<void> => {
  const result = await getNewsAndCommentResults('윤석열', ['1002']);
  console.log(result);
}
