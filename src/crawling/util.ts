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
  return `${year}.${(month < 10 ? '0' : '') + month}.${
    (day < 10 ? '0' : '') + day
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
