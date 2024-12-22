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
    console.log('render' + index, item);

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
          <div>
            <div style={{ backgroundColor: 'green' }}>
              url:
              {item.video.play_addr.url_list.map((urlItem: any) => (
                <span>{urlItem}</span>
              ))}
            </div>
          </div>
        );
      // node = (
      //   <BaseVideo
      //     isPlay={play}
      //     item={item}
      //     index={index}
      //     position={{ uniqueId, index }}
      //     {...props}
      //   />
      // );
    }

    return node;
  };
}
