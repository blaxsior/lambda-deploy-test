import axios, { AxiosError, AxiosResponse } from 'axios';
import { HTMLElement, parse } from 'node-html-parser';
import { getBaseUrl } from './util.js';
import { setTimeout as setTimeoutPromises } from 'timers/promises';
// where=news
// query=검색어

// sort=0, 1, 2 => 절렬 기준이 뭔지. nso의 so 옵션과 동일
// ds=2023.08.31.10.23
// de=2023.09.01.10.23

// pd=N
// 기간 0: 전체, 1: 1주 2: 1개월 3: 기간 설정(~일부터 ~일까지)
// 4: 1일 5: 1년 6: 6개월 7 ~ 12: 1 ~ n 시간 단위

// office_type=1 언론사 별 검색 사용하는 경우
// mynews=1 언론사 별 검색 사용하는 경우 필요
// news_office_checked=1032: 언론사 번호

// nso=so:dd,p:1d,a:all
// so: 정렬 r = 관련도, dd = 최신
// p: 기간
// start=11
// 기간만 적어두면 nso 옵션도 딱히 필요 없음

// 변경하는 부분
// ds: 시작일
// de: 끝일
// news_office_checked: 언론사 번호
// start: 시작 번호(페이지)

//
// div.info_group > a:nth-child(3)

const options: Record<string, string> = {
  where: 'news',
  sort: '0',
  pd: '3',
  // nso: 'so:dd,p:1d,a:all',
};

const path = 'https://search.naver.com/search.naver';

type NLListOptions = {
  query: string;
  ds: string;
  de: string;
  news_office_checked?: string;
};

type DelayOptions = {
  delay_ms?: number;
  default_delay_ms?: number; // 요청 간 기본 대기 시간
  stop_creterion?: number;
  max_wait_ms?: number; // 3번 연속 실패
};

const default_delayOpt: DelayOptions = {
  delay_ms: 2500,
  default_delay_ms: 100, // 요청 간 기본 대기 시간
  stop_creterion: 10,
  max_wait_ms: 10000, // 3번 연속 실패
};

/**
 * @param options 추가적으로 필요한 옵션
 * @param delay_ms 조건이 발생할 때 대기하는 시간
 * @param stop_creterion 최대 대기 시간
 */
export async function getNewsLinkList(
  variable_options: NLListOptions,
  delayOptions: DelayOptions = {},
): Promise<string[]> {
  const { default_delay_ms, delay_ms, max_wait_ms, stop_creterion } = {
    ...default_delayOpt,
    ...delayOptions,
  } satisfies DelayOptions;
  let inner_delay = delay_ms!;
  const sub_delay_ms = delay_ms! / 2;

  //내부적으로는 start 옵션만 변경됨
  if (variable_options.news_office_checked) {
    variable_options['office_type'] = '1';
    variable_options['mynews'] = '1';
  }
  const baseUrl = getBaseUrl(path, options, variable_options);
  let count = 1;
  let req_count = 0; // 요청 횟수.
  let root: HTMLElement;

  const link_list: string[] = [];
  // console.log(baseUrl);
  // console.log(`${baseUrl}&start=${count}`);
  // not found 페이지가 나오기 전까지 계속 탐색하기.
  do {
    if (inner_delay > max_wait_ms!) return link_list;
    if (req_count % stop_creterion! === 0) {
      // 90개 읽을 때마다 멈춤
      await setTimeoutPromises(inner_delay);
    } else {
      setTimeoutPromises(default_delay_ms);
    }
    req_count++; // 한번 읽었다.
    const url = `${baseUrl}&start=${count}`;
    let req: AxiosResponse;
    try {
      req = await axios.get(`${baseUrl}&start=${count}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
    } catch (e) {
      if (e instanceof AxiosError) {
        console.log(e.code);
        console.log(e.message);
        console.log('Error Status: ', e.status);
      }
      console.log('ERROR_URL: ', url);
      inner_delay *= 2;
      req_count = 0;
      continue;
    }
    if (!req) return [];

    count += 10;
    if (inner_delay > delay_ms!) {
      inner_delay -= sub_delay_ms;
    }

    root = parse(req.data);
    const targets = root.querySelectorAll(
      'div.info_group > a.info:not(.press)',
    );
    for (const target of targets) {
      const link = target.getAttribute('href');
      link && link_list.push(link);
    }
  } while (root!.querySelector('div.info_group') != null);
  return link_list;
}
