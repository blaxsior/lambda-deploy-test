export interface SqsDataType { // Sqs에서 전달하는 데이터
  keywords: {
    id: number;
    name: string;
  }[];
  news_sources: string[];
}