import { FC, memo, useContext } from 'react';

import VideoCtx from '@/utils/ctx/video';

import './index.scss';

interface ItemDescProps {
  isMy: boolean;
  isLive: boolean;
  [key: string]: unknown;
}

const ItemDesc: FC<ItemDescProps> = memo(({ isLive, isMy }) => {
  const videoCtx = useContext(VideoCtx);
  const { item } = videoCtx;

  return (
    <div className="item-desc absolute bottom-0 w-[70%]">
      {isMy ? (
        <div className="content text-white text-2xl">
          {(item.city || item.address) && (
            <div className="location-wrapper flex">
              <div className="location mb-[10rem] flex items-center text-[12rem] p-[4rem] rounded-[3rem] bg-[var(--second-btn-color-tran)]">
                <img
                  className="mr-[7rem] w-[18rem"
                  src="../../assets/img/icon/location.webp"
                  alt="location"
                />
                <span>{item.city}</span>
                {item.address && <div className="h-[8rem] w-[1.5px] bg-[gray]"></div>}
                <span>{item.address}</span>
              </div>
            </div>
          )}
          {isLive && (
            <div className="live inline-flex items-center py-[3rem] px-[6rem] mb-[10rem] text-[11rem] rounded-[3rem] bg-[var(--primary-btn-color)] text-white">
              {/* <div className="live-icon"></div> */}
              <span>直播中</span>
            </div>
          )}
          <div className="name">{`@${item?.author?.nickname}`}</div>
          <div className="description">{item.desc}</div>
        </div>
      ) : (
        <div className="comment-status flex items-center">
          <div className="comment">
            <div className="type-comment flex bg-[rgb(130, 21, 44)] rounded-[50px] p-[3px] mb-[20px]">
              <img
                src="../../assets/img/head-image.jpeg"
                alt=""
                className="avatar w-[36px] h-[36px] rounded-[50%]"
              />
              <div className="right mx-[10px] text-[var(--second-text-color)]">
                <p>
                  <span className="name mr-[10px]">杨润才</span>
                  <span className="time ">2024-12-12</span>
                </p>
                <p className="text text-white">北京</p>
              </div>
            </div>
            <>{/* transition-group */}</>
          </div>
        </div>
      )}
    </div>
  );
});

export default ItemDesc;
