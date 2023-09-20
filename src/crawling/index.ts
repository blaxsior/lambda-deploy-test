import { getNewsBody } from './body.js';
import { getNewsComments } from './comments.js';
import { getNewsLinkList } from './list.js';
import { getYesterdayString } from './util.js';

export async function getNewsAndCommentResults(
  keyword: string,
  idlist: string[],
) {
  const date = getYesterdayString();
  // '1020', '1025', '1005', '1023', '1032'
  const urlList: string[] = [];
  for (const office_id of idlist) {
    const urls = await getNewsLinkList({
      ds: date,
      de: date,
      query: keyword,
      news_office_checked: office_id,
    });
    urlList.push(...urls);
  }

  const result: {
    url: string;
    news: Awaited<ReturnType<typeof getNewsBody>>;
    comments: Awaited<ReturnType<typeof getNewsComments>>;
  }[] = [];
  for (const addr of urlList) {
    //스포츠 기사 등 제외, 순수 기사만 채택
    if (!addr.startsWith('https://n.news.naver.com')) continue;
    try {
      const news = await getNewsBody(addr);
      const comments = await getNewsComments(addr);
      result.push({
        url: addr,
        news: news,
        comments: comments,
      });
    } catch (e) {
      console.log(e);
    }
  }
  return result;
}

// 예시 사용 방식
// (async () => {
//   const idlist = ['1002', '1020', '1025', '1005', '1023', '1032'];
//   const keyword = '윤석열';
//   const result = await getNewsAndCommentResults(keyword, idlist);

//   await writeFile('testtt.json', JSON.stringify(result));
//   console.log('done!');
// })();
