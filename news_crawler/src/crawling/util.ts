export function getBaseUrl(
  path: string,
  fixed_options: Record<string, string>,
  variable_options?: Record<string, string>,
): string {
  const baseUrl = new URL(path);
  const params = baseUrl.searchParams;
  for (const [k, v] of Object.entries(fixed_options)) {
    params.set(k, v);
  }

  if (variable_options != undefined) {
    for (const [k, v] of Object.entries(variable_options)) {
      params.set(k, v ?? ''); // null, undefined 경우
    }
  }
  return baseUrl.href;
}
// 하루는 24 * 3600 * 1000
export function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0 ~ 11
  const day = date.getDate();
  // 시간 & 분의 경우 사용 측에서 큰 의미 X
  // YYYY.MM.DD 꼴 나와야 함
  return `${year}.${(month < 10 ? '0' : '') + month}.${(day < 10 ? '0' : '') + day
    }`;
}

/**
 * 어제, 오늘 자정 기준 시간을 문자열로 받기
 */
export function getDateYTString() {
  const date = new Date();
  const today = getDateString(date);
  date.setDate(date.getDate() - 1);
  const yesterday = getDateString(date);
  return {
    yesterday,
    today,
  };
}

/**
 * 어제 00:00 ~ 23:59 사이 날짜를 문자열로 받기  
 * getDateYTString은 "오늘" 기사를 포함, 일부 중복 가능한 문제 존재  
 * 어제 하루만 가져와서 중복 없이 데이터 수집
 */
export function getYesterdayString() {
  const date = getKoreanDate();
  
  // 어제 날짜로 변경
  date.setDate(date.getDate() - 1);
  return getDateString(date);
}


/**
 * 항상 한국 시간만 받기(lambda 시간과 관계 없이)  
 * 출처: https://hianna.tistory.com/451
 */
export function getKoreanDate() {
  // 1. 현재 시간(Locale)
  const curr = new Date();

  // 2. UTC 시간 계산
  // timezone 보정해서 UTC+0 시간으로 변경
  const utc =
    curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);

  // 3. UTC to KST (UTC + 9시간) -> 9시간 더 빠르니까 더하기
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = new Date(utc + (KR_TIME_DIFF));
  return kr_curr;
}