import { useState, useContext, useEffect } from 'react';
import { IoVolumeMute } from 'react-icons/io5';

import './index.scss';
import bus, { EVENT_KEY } from '@/utils/bus';
import VideoCtx from '@/utils/ctx/video';
import { _stopPropagation } from '@/utils';

const BaseMusic = () => {
  const [showMutedNotice, setShowMutedNotice] = useState(window.showMutedNotice);

  const toMuted = (e: React.MouseEvent) => {
    _stopPropagation(e.nativeEvent);
    bus.emit(EVENT_KEY.REMOVE_MUTED);
  };

  const navToMusic = () => {
    console.log('?');

    bus.emit(EVENT_KEY.NAV, {
      path: 'home/music',
      query: { id: item.aweme_id },
    });
  };

  useEffect(() => {
    bus.on(EVENT_KEY.HIDE_MUTED_NOTICE, () => {
      setShowMutedNotice(false);
    });
  }, []);

  const { item, mute, isPlaying } = useContext(VideoCtx);
  console.log('mute', mute);

  return (
    <div className="music-wrapper">
      {mute && (
        <div className={`mute-icon ${showMutedNotice ? 'notice' : ''}`} onClick={toMuted}>
          <div className="wrap">
            <IoVolumeMute />
            <span style={{ opacity: showMutedNotice ? 1 : 0 }}>取消静音</span>
          </div>
        </div>
      )}
      <img
        className="music"
        src={item.music?.cover_thumb.url_list[0]}
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        onClick={navToMusic}
        alt=""
      />
    </div>
  );
};

export default BaseMusic;
