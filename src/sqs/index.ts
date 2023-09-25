import type { SQSEvent } from "aws-lambda";
import { validateSqsData } from "../util/validation";

interface SqsDataType { // Sqs에서 전달하는 데이터
  keywords: string[];
  news_sources: string[];
}

export function getSqsDataFromBodyStr(body: string): SqsDataType {
  const json = JSON.parse(body);
  validateSqsData(json);
  return json;
}