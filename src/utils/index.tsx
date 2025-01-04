import { ReactNode } from 'react';

import BaseVideo from '@/components/baseVideo';
import { IMG_URL } from '@/config';

export function _checkImgUrl(url: string): string {
  // console.log(url)
  if (!url) return '';
  //本地图片
  if (
    url.includes('assets/img') ||
    url.includes('file://') ||
    url.includes('data:image') ||
    url.includes('http') ||
    url.includes('https')
  ) {
    return url;
  }

  return IMG_URL + url;
}

export function slideItemRender(props: any) {
  return function (item: any, index: number, play: boolean, uniqueId: string) {
    let node: ReactNode = null;
    // console.log('render' + index, item);
    switch (item.type) {
      case 'img':
        node = <img src={_checkImgUrl(item.src)} alt="" />;
        break;
      case 'video':
        node = (
          <BaseVideo
            isPlay={play}
            item={item}
            index={index}
            position={{ uniqueId, index }}
            {...props}
          />
        );
        break;
      default:
        node = (
          <BaseVideo
            isPlay={play}
            item={item}
            index={index}
            position={{ uniqueId, index }}
            {...props}
          />
        );
    }

    return node;
  };
}

export function _formatNumber(num: number) {
  if (!num) return;
  if (num > 100000000) {
    return (num / 100000000).toFixed(1) + '亿';
  } else if (num > 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else {
    return num;
  }
}

export function _duration(v: null | undefined | number) {
  if (!v) return '00:00';
  const m = Math.floor(v / 60);
  // let s = v % 60
  const s = Math.round(v % 60);
  let str: string = '';
  if (m === 0) {
    str = '00';
  } else if (m > 0 && m < 10) {
    str = '0' + m;
  } else {
    str = m + '';
  }

  str += ':';
  if (s === 0) {
    str += '00';
  } else if (s > 0 && s < 10) {
    str += '0' + s;
  } else {
    str += s;
  }

  return str;
}
