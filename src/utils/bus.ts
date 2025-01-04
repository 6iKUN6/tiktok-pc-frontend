//全局事件总线
export default {
  eventMap: new Map(),
  on(eventType: string, cb: (val?: any) => void) {
    let cbs = this.eventMap.get(eventType);
    if (cbs) {
      cbs.push(cb);
    } else {
      cbs = [cb];
    }

    if (cbs.length > 10) {
      // console.error('eventMap', this.eventMap)
    }

    this.eventMap.set(eventType, cbs);
  },
  once(eventType: string, cb: (val?: any) => void) {
    this.eventMap.set(eventType, [cb]);
  },
  off(eventType: string, fn: (val?: any) => void) {
    const cbs = this.eventMap.has(eventType);
    if (cbs) {
      if (fn) {
        const cbs = this.eventMap.get(eventType);
        const rIndex = cbs.findIndex((v: (val?: any) => void) => v === fn);
        if (rIndex > -1) {
          cbs.splice(rIndex, 1);
        }

        this.eventMap.set(eventType, cbs);
      } else {
        this.eventMap.delete(eventType);
      }
    }
  },
  offAll() {
    this.eventMap = new Map();
  },
  emit(eventType: string, val?: any) {
    // console.log('emit', eventType, val)
    const cbs = this.eventMap.get(eventType);
    if (cbs) {
      cbs.map((cb: (val?: any) => void) => cb(val));
    }
  },
};

export const EVENT_KEY = {
  SINGLE_CLICK: 'SINGLE_CLICK', // 单击事件
  SINGLE_CLICK_BROADCAST: 'SINGLE_CLICK_BROADCAST', // 单击广播事件
  ENTER_FULLSCREEN: 'ENTER_FULLSCREEN', // 进入全屏事件
  EXIT_FULLSCREEN: 'EXIT_FULLSCREEN', // 退出全屏事件
  TOGGLE_FULLSCREEN: 'TOGGLE_FULLSCREEN', // 切换全屏事件
  TOGGLE_COMMENT: 'TOGGLE_COMMENT', // 切换评论事件
  OPEN_COMMENTS: 'OPEN_COMMENTS', // 打开评论事件
  CLOSE_COMMENTS: 'CLOSE_COMMENTS', // 关闭评论事件
  DIALOG_MOVE: 'DIALOG_MOVE', // 对话框移动事件
  DIALOG_END: 'DIALOG_END', // 对话框结束事件
  OPEN_SUB_TYPE: 'OPEN_SUB_TYPE', // 打开子类型事件
  CLOSE_SUB_TYPE: 'CLOSE_SUB_TYPE', // 关闭子类型事件
  ITEM_TOGGLE: 'ITEM_TOGGLE', // 切换项事件
  ITEM_PLAY: 'ITEM_PLAY', // 项播放事件
  ITEM_STOP: 'ITEM_STOP', // 项停止事件
  NAV: 'NAV', // 导航事件
  GO_USERINFO: 'GO_USERINFO', // 进入用户信息事件
  SHOW_SHARE: 'SHOW_SHARE', // 显示分享事件
  UPDATE_ITEM: 'UPDATE_ITEM', // 更新项事件
  CURRENT_ITEM: 'CURRENT_ITEM', // 当前项事件
  REMOVE_MUTED: 'REMOVE_MUTED', // 移除静音事件
  HIDE_MUTED_NOTICE: 'HIDE_MUTED_NOTICE', // 隐藏静音通知事件
  TOGGLE_CURRENT_VIDEO: 'TOGGLE_CURRENT_VIDEO', // 切换当前视频事件
  SHOW_AUDIO_CALL: 'SHOW_AUDIO_CALL', // 显示音频通话事件
};

export type EVENT_KEY_TYPE = keyof typeof EVENT_KEY; // 添加类型定义
