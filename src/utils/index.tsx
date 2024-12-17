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
