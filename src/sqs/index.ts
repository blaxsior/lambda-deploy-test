import type { SQSEvent } from "aws-lambda";
import { validateSqsData } from "src/util/validation";

interface SqsDataType { // Sqs에서 전달하는 데이터
  keywords: string[];
  news_sources: string[];
}

export function getSqsDataFromEvent(event: SQSEvent): SqsDataType {
  const body = event.Records[0]?.body;
  const json = JSON.parse(body);
  validateSqsData(body);
  return json;
}