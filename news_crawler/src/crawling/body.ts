import axios from 'axios';
import { parse } from 'node-html-parser';
import { validateNotEmpty } from '../util/validation.js';
import { Article } from './types.js';

export async function getNewsBody(address: string): Promise<Article> {
  const req = await axios.get(address, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102',
    },
  });
  const root = parse(req.data);

  let title = '';
  // let author = '';
  const newsParagraphs: string[] = [];
  let publishedAt = '';

  // title
  const titleElement = root.querySelector('h2.media_end_head_headline');
  validateNotEmpty(titleElement, `ERROR[article.title]: ${address}`);
  title = titleElement?.textContent ?? '';

  // publishedAt
  const dateElement = root.querySelector(
    'span.media_end_head_info_datestamp_time',
  );
  validateNotEmpty(dateElement, `ERROR[article.publishedAt]: ${address}`);
  publishedAt = dateElement?.getAttribute('data-date-time') ?? '';

  // author
  // const authorElement = root.querySelector('em.media_end_head_journalist_name');
  // validateNotEmpty(authorElement, `ERROR[article.author]: ${address}`);
  // author = authorElement.textContent;
  // body
  const articleElement = root.querySelector('article');
  validateNotEmpty(articleElement, `ERROR[article.body]: ${address}`);
  //https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  //TextNode (Node.TEXT_NODE 참고)
  //TextNode의 텍스트만 가져오기
  const paragraphs = articleElement?.childNodes
    .filter((node) => node.nodeType === 3) // Text 노드는 노드 타입이 3
    .map((it) => it.textContent);

  if(paragraphs) {
    for (const paragraph of paragraphs) {
      if (paragraph.length === 0) continue;
      const paragraphs = paragraph.split('.').map((it) => it.trim());
      newsParagraphs.push(...paragraphs);
    }    
  }

  return {
    title,
    publishedAt,
    // author,
    body: newsParagraphs.filter((it) => it.length > 0),
  };
}
