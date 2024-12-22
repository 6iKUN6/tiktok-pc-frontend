export default {
  cxk: '蔡徐坤',
};

export const SlideVideoPlayStatus = {
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop',
} as const;

export const HttpStatus = {
  OK: 200,
  PARAMS_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};
