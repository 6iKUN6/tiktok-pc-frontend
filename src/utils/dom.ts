export function _css(el: HTMLElement, key: string, value?: string) {
  const reg = /^-?\d+.?\d*(px|pt|em|rem|vw|vh|%|rpx|ms)$/i;
  if (value === undefined) {
    let val = null;
    if ('getComputedStyle' in window) {
      val = window.getComputedStyle(el, null)[key as keyof CSSStyleDeclaration];
    } else {
      val = (el as any).currentStyle[key];
    }

    return reg.test(val) ? parseFloat(val) : val;
    // return parseFloat(val)
  } else {
    if (
      [
        'top',
        'left',
        'bottom',
        'right',
        'width',
        'height',
        'font-size',
        'margin',
        'padding',
      ].includes(key)
    ) {
      if (!reg.test(value)) {
        if (!String(value).includes('calc')) {
          value += 'px';
        }
      }
    }

    if (key === 'transform') {
      //直接设置不生效
      //   el.style.webkitTransform =
      //     el.style.MsTransform =
      //     el.style.msTransform =
      //     el.style.MozTransform =
      //     el.style.OTransform =
      el.style.transform = value;
    } else {
      (el.style as any)[key] = value;
    }
  }
}
