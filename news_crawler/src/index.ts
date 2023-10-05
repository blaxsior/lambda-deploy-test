// https://docs.aws.amazon.com/ko_kr/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
// https://www.youtube.com/watch?v=SPyDoTkRolY
import type { SQSHandler } from 'aws-lambda';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getNewsAndCommentResults } from './crawling/index.js';
import { genRandomFileName } from './util/gen-key.js';
import { getSqsDataFromBodyStr } from './sqs/index.js';


const sqsURL = process.env.SQS_URL;
const region = process.env.REGION;
const bucket = process.env.BUCKET_NAME;

const sqs = new SQSClient({ region });
const s3 = new S3Client({ region });

export const handler: SQSHandler = async (event, context): Promise<void> => {
  for (const record of event.Records) {
    const data = getSqsDataFromBodyStr(record.body);
    if(!data) return;
    
    const {keywords, news_sources} = data;
    // const keyword = '윤석열';
    // const list = ['1002'];
    // 키워드를 읽어와서 아래와 같이 처리해야 함...
    for (const keyword of keywords) {
      const fileName = genRandomFileName();
      const result = await getNewsAndCommentResults(keyword, news_sources);
      const sqsCommand = new SendMessageCommand({
        QueueUrl: sqsURL,
        MessageBody: JSON.stringify({
          keyword: keyword,
          key: fileName,
        }),
      });

      const s3Command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: JSON.stringify(result),
      });

      try {
        const s3result = await s3.send(s3Command);
        const sqsresult = await sqs.send(sqsCommand);
      } catch (e) {
        console.error(e);
      }
    }
  }
}


// (async function () {
//   await handler();
// })();

