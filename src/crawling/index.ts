import { type Article, getNewsBody } from './body.js';
import { type Comment, getNewsComments } from './comments.js';
import { getNewsLinkList } from './list.js';
import { getYesterdayString } from './util.js';

type CrawlingDataType = {
  keyword: string; // 관련 키워드
  data: {
    url: string; // 뉴스 url
    news: Article;
    comments: Comment[];
  }[];
};

export async function getNewsAndCommentResults(
  keyword: string,
  idlist: string[],
): Promise<CrawlingDataType> {
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

  const news_list: {
    url: string;
    news: Article;
    comments: Comment[];
  }[] = [];
  for (const addr of urlList) {
    //스포츠 기사 등 제외, 순수 기사만 채택
    if (!addr.startsWith('https://n.news.naver.com')) continue;
    try {
      const news = await getNewsBody(addr);
      const comments = await getNewsComments(addr);
      news_list.push({
        url: addr,
        news: news,
        comments: comments,
      });
    } catch (e) {
      console.log(e);
    }
  }
  return {
    keyword: keyword,
    data: news_list,
  }
}

// 예시 사용 방식
// (async () => {
//   const idlist = ['1002', '1020', '1025', '1005', '1023', '1032'];
//   const keyword = '윤석열';
//   const result = await getNewsAndCommentResults(keyword, idlist);

//   await writeFile('testtt.json', JSON.stringify(result));
//   console.log('done!');
// })();
