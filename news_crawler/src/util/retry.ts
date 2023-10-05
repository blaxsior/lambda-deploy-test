import { setTimeout as setTimeoutPromises } from "timers/promises";

type AsyncAction = () => Promise<void>;

/**
 * retry 로직에 대한 옵션
 */
export type RetryOptions = {
  /**
   * 최대 에러 대기 횟수
   */
  retry?: number;
  /**
   * 최초 대기 시간. 에러 횟수가 높아지면 중복될 수 있음.
   */
  waitTime?: number;
  /**
   * 문제 발생 시 출력할 에러 메시지
   */
  err_message?: string;
}
/**
 * 에러 발생 시 최대 retry 횟수만큼 반복하여 요청을 시도하는 함수.  
 * 에러가 1회 증가할 때마다 waitTime은 2배로 증가.
 */
export async function withRetry(action: AsyncAction, options: RetryOptions = {}) {
  const {
    retry = 3,
    err_message = '요청에 응답할 수 없음'
  } = options;
  let { waitTime = 1000 } = options;

  let count = 0;

  while (count < retry) {
    try {
      await action();
      break;
    } catch (e) {
      console.error(e); // 에러 출력
      await setTimeoutPromises(waitTime); // 일정 시간 대기
      count++;
      waitTime *= 2;
    }
  }
  if (count === retry) throw new Error(`ERROR[${action.name}]: ${err_message}`);
}