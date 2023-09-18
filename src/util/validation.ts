export function validateNotEmpty(target: any, message = 'target is empty') {
  if (target === null || target === undefined) {
    throw new Error(message);
  }
}

export function validateNewsCommentsObj(data: any) {
  validateNotEmpty(data);
  validateNotEmpty(data.result);
  validateNotEmpty(data.result.commentList);
  if (data.result.commentList.length > 0) {
    validateNotEmpty(data.result.commentList[0].contents);
    validateNotEmpty(data.result.commentList[0].sympathyCount);
    validateNotEmpty(data.result.commentList[0].antipathyCount);
    validateNotEmpty(data.result.commentList[0].modTime); // 날짜 정보
    // more page는 없을 수도 있음
    validateNotEmpty(data.result.morePage);
    validateNotEmpty(data.result.morePage.next);
  }
  validateNotEmpty(data.result.pageModel);
  validateNotEmpty(data.result.pageModel.lastPage);
}

// 차후 empty 조건 말고도 추가해야 할 수도 있음
