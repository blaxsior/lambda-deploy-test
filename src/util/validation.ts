import Ajv, { JSONSchemaType } from 'ajv';
import { Comment, NewsCommentObject } from 'src/crawling/types';

export function validateNotEmpty(target: any, message = 'target is empty') {
  if (target === null || target === undefined) {
    throw new Error(message);
  }
}
const ajv = new Ajv({ removeAdditional: 'all' });
const NewsCommentObjectSchema: JSONSchemaType<NewsCommentObject> = {
  type: 'object',
  required: ['result'],
  properties: {
    result: {
      type: 'object',
      required: ['commentList', 'pageModel'],
      properties: {
        commentList: {
          type: 'array',
          items: {
            type: 'object',
            required: ['contents', 'sympathyCount', 'antipathyCount', 'modTime'],
            properties: {
              contents: { type: 'string' },
              sympathyCount: { type: 'number' },
              antipathyCount: { type: 'number' },
              modTime: { type: 'string' },
            }
          }
        },
        morePage: {
          type: 'object',
          nullable: true,
          required: ['next'],
          properties: {
            next: { type: 'string' }
          }
        },
        pageModel: {
          type: 'object',
          required: ['lastPage'],
          properties: {
            lastPage: { type: 'number' }
          }
        }
      }
    }
  },
  additionalProperties: false,
};

export const validateNewsCommentsObj = ajv.compile(NewsCommentObjectSchema);

// export function validateSqsData(data: any) {
//   validateNotEmpty(data);
//   validateNotEmpty(data.keywords);
//   validateNotEmpty(data.news_sources);
// }