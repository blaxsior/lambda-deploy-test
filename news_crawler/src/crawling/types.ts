export interface Comment {
  contents: string;
  sympathyCount: number;
  antipathyCount: number;
  date: string;
}

export interface Article {
  title: string;
  publishedAt: string;
  body: string[];
}

export interface CrawlingDataType {
  keyword: string; // 관련 키워드
  data: {
    url: string; // 뉴스 url
    news: Article;
    comments: Comment[];
  }[];
};

export interface NewsCommentObject {
  result: {
    commentList: {
      contents: string;
      sympathyCount: number;
      antipathyCount: number;
      modTime: string; // 날짜지만 문자열
    }[],
    morePage?: {
      next: string;
    },
    pageModel: {
      lastPage: number;
    }
  }
}