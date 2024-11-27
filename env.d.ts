/// <reference types="vite/client" />

declare global {
  interface Window {
    isMoved: boolean;
    isMuted: boolean;
    showMutedNotice: boolean;
  }

  interface Navigator {
    control: any;
    webkitGetUserMedia: any;
    mozGetUserMedia: any;
    getUserMedia: any;
  }
}
export {};
