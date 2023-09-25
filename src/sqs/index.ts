// import { validateSqsData } from "../util/validation";

import Ajv, {JTDSchemaType} from 'ajv/dist/jtd';
// import Ajv, { JSONSchemaType } from 'ajv';
import { type SqsDataType } from './types.js';

const ajv = new Ajv({removeAdditional: "all"});
const sqsDataSchema: JTDSchemaType<SqsDataType> = {
  properties: {
    keywords: {elements: {type: "string"}},
    news_sources: {elements: {type: "string"}}
  },
  additionalProperties: false
}
export const validateSqsData = ajv.compile(sqsDataSchema);
export const getSqsDataFromBodyStr = ajv.compileParser<SqsDataType>(sqsDataSchema);
// const validate = ajv.compile(sqsDataSchema);
// export function getSqsDataFromBodyStr(body: string): SqsDataType {
//   const json = JSON.parse(body);
//   validateSqsData(json);
//   return json;
// }
