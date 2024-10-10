export const Result = (type: number) => {
  if (type == 0) {
    return {
      result: 'success',
    };
  } else if (type == 1) {
    return {
      result: 'success',
    };
  } else {
    return {
      result: 'success',
    };
  }
}

export const Error =(err: Error) => {
  return {
    error: err
  };
}

export const TypeError =(type: number) => {
  if (type == 0) {
    return {
      text: '정의되지 않은 오류입니다.',
    };
  } else if (type == 1) {
    return {
      text: '없는 계정 정보입니다.',
    };
  } else if (type == 2) {
    return {
      text: '비밀번호가 일치하지 않습니다.',
    };
  } else {
    return {
      text: '정의되지 않은 오류입니다.',
    };
  }
}

export const UnAuthorized= () =>{
  return {
    expired: true,
  };
}

export const Token= (accessToken: string, refreshToken: string) =>{
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}
