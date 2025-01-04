import { FC, Fragment, memo, useContext } from 'react';
import { AiFillMessage } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa6';

import BaseMusic from '@/components/baseMusic';
import VideoCtx from '@/utils/ctx/video';
import { _formatNumber } from '@/utils';
import './index.scss';
import { NormalObject } from '@/types';

interface ItemToolbarProps {
  isMy: boolean;
  item: NormalObject;
  [key: string]: unknown;
}

export const ItemToolbar: FC<ItemToolbarProps> = memo(({ isMy, item }) => {
  const { position } = useContext(VideoCtx);
  console.log('ctx-toolbar', position);

  // const updateItem = (props: any, key: string | symbol, val: any) => {};

  return (
    <div className="toolbar mb1r">
      <div className="avatar-ctn mb2r">
        <img className="avatar" src={item.author.avatar_168x168.url_list[0]} alt="" />
        <div className="options">
          {!item.isAttention && (
            <Fragment>
              <img className="no" src="src/assets/img/icon/add-light.png" alt="no" />
              <img className="yes" src="src/assets/img/icon/ok-red.png" alt="yes" />
            </Fragment>
          )}
        </div>
      </div>
      {/* 点赞 */}
      <div className="love mb2r">
        <div>
          {!item.isLoved ? (
            <img src="src/assets/img/icon/love.svg" className="love-image" />
          ) : (
            <img src="src/assets/img/icon/loved.svg" className="love-image" />
          )}
        </div>
        <span>{_formatNumber(item.statistics.digg_count)}</span>
      </div>
      {/* 评论 */}
      <div className="message mb2r">
        <AiFillMessage className="icon" style={{ color: 'white' }} />
        <span>{_formatNumber(item.statistics.comment_count)}</span>
      </div>
      {/* todo */}
      <div className="message mb2r">
        <FaStar
          className="icon"
          style={item.isCollect ? { color: 'rgb(252, 179, 3)' } : { color: 'white' }}
        />
        {/* <Icon
        v-if="item.isCollect"
        icon="ic:round-star"
        class="icon"
        style="color: rgb(252, 179, 3)"
      />
      <Icon v-else icon="ic:round-star" class="icon" style="color: white" /> */}
        <span>{_formatNumber(item.statistics.comment_count)}</span>
      </div>
      {!isMy ? (
        <div className="share mb2r">
          <img src="src/assets/img/icon/share-white-full.png" alt="" className="share-image" />
          <span>{_formatNumber(item.statistics.share_count)}</span>
        </div>
      ) : (
        <div className="share mb2r">
          <img src="src/assets/img/icon/menu-white.png" alt="" className="share-image" />
        </div>
      )}
      <BaseMusic />
    </div>
  );
});

export default ItemToolbar;
