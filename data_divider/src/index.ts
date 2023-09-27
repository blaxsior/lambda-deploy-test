import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { keyword, news_source } from './db';

const sqsURL = process.env.SQS_URL;
const region = process.env.REGION;

const sqs = new SQSClient({ region });
const STEP = 3;

export const handler = async (): Promise<void> => {
  const keywords = await keyword.select('name').where('isActive', true);
  const news_sources = await news_source.select('media_id');
  // const news_sources = ['1023'];
  // , '1025', '1020', '1032', '1028', '1047'
  let idx = 0;
  while (idx < keywords.length) {
    const sqsCommand = new SendMessageCommand({
      QueueUrl: sqsURL,
      MessageBody: JSON.stringify({
        keywords: keywords.slice(idx, idx + STEP),
        news_sources: news_sources,
      })
    });

    const sqsResult = await sqs.send(sqsCommand);
    idx += STEP;
  }
}


// (async function () {
//   await handler();
// })();
