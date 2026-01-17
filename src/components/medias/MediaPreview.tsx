import { Css } from 'fluxio';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/common/Button';
import { Media } from '@/api/models';

const c = Css('MediaPreview', {
  '': {
    wh: '100%',
    bgMode: 'contain',
  },

  Video: {
    w: 200,
  },
  'Video video': {
    wh: '100%',
    flex: 1,
    objectFit: 'contain',
    cursor: 'pointer',
  },
  Image: {
    wh: 200,
    bgMode: 'contain',
  },
});

export const MediaPreview = ({ media }: { media?: Media }) => {
  const api = useApi();

  if (!media) return null;

  const thumbUrl = api.medias.getImageUrl(media, 'thumb');
  const videos = api.medias.getVideoInfos(media, 'hd');

  return (
    <Button
      {...c('')}
      icon
      tooltip={() =>
        videos.length ?
          <video
            {...c('Video')}
            controls={false}
            muted
            autoPlay
            loop
            onLoadStart={(e) => {
              e.currentTarget.currentTime = 0;
            }}
            onError={(e) => {
              console.warn('Video preview error:', e);
            }}
          >
            {videos.map((v, i) => (
              <source key={i} type={v.mime} src={v.url} />
            ))}
          </video>
        : <div
            {...c('Image')}
            style={{
              backgroundImage: `url('${thumbUrl}')`,
            }}
          />
      }
      style={{
        backgroundImage: `url('${thumbUrl}')`,
      }}
    />
  );

  //   <Popover id={overId} {...c('')} title={media.title}>
  //     {isOver && videos.length ?
  //       <div {...c('Video')}>
  //         <video
  //           controls={false}
  //           muted
  //           autoPlay
  //           loop
  //           onLoadStart={(e) => {
  //             e.currentTarget.currentTime = 0;
  //           }}
  //           onError={(e) => {
  //             console.warn('Video preview error:', e);
  //           }}
  //         >
  //           {videos.map((v, i) => (
  //             <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
  //           ))}
  //         </video>
  //       </div>
  //     : images.length ?
  //     : null}
  //   </Popover>
  // );
};
