import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOMClient from 'react-dom/client';

import App from './App.tsx';
import './assets/sass/index.scss';
import { runMock } from './mock/index.ts';
import bus, { EVENT_KEY } from './utils/bus.ts';

//初始化一些变量
window.isMoved = false;
window.isMuted = true;
window.showMutedNotice = true;

//代理点击事件，防止视频滑动时，触发poinermove、poinerstart、poinerend事件时，同时触发click。如果isMoved是false，直接跳过，否则正常执行
HTMLElement.prototype.addEventListener = new Proxy(HTMLElement.prototype.addEventListener, {
  // 这一层代理事件监听器看看是不是click事件
  //代理函数对象时，Function的内部方法call对应的陷阱函数apply(具体看mdn官网)。函数被调用时默认Function.prototype.call
  apply(target, ctx, args) {
    const eventName = args[0];
    const listener = args[1];
    if (listener instanceof Function && eventName === 'click') {
      //代理click事件对应的函数
      args[1] = new Proxy(listener, {
        apply(target1, ctx1, args1) {
          if (window.isMoved) return;
          try {
            return target1.apply(ctx1, args1);
          } catch (e) {
            console.error(`[proxyPlayerEvent][${eventName}]`, listener, e);
          }
        },
      });
    }

    return target.apply(ctx, args as any);
  },
});

//渲染根组件
const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement!);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

//数据mock，开发环境上拦截请求，上假数据
runMock();

setTimeout(() => {
  bus.emit(EVENT_KEY.HIDE_MUTED_NOTICE);
  window.showMutedNotice = false;
}, 2000);
//开局注册移除静音方法
bus.on(EVENT_KEY.REMOVE_MUTED, () => {
  window.isMuted = false;
});
