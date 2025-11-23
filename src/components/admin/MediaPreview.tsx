import { Css } from 'fluxio';
import { uuid } from 'fluxio';
import { useMemo } from 'preact/hooks';
import { Popover, useIsOver } from './Popover';
import { MediaModel } from '@/api/models';
import { useApi } from '@/hooks/apiHooks';
import { Button } from '@/components/common/Button';

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

export const MediaPreview = ({ media }: { media?: MediaModel }) => {
  const api = useApi();
  const overId = useMemo(uuid, []);
  const variants = api.getVariants(media);
  const images = variants.filter((v) => v.type === 'image');
  const videos = variants.filter((v) => v.type === 'video');
  const isOver = useIsOver(overId);

  if (!media) return null;

  return (
    <Button
      {...c()}
      icon
      tooltip={() => (
        videos.length ? (
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
              <source key={i} type={v.mime} src={api.getMediaUrl(v)} />
            ))}
          </video>
        ) : (
          <div
            {...c('Image')}
            style={{
              backgroundImage: `url('${api.getMediaUrl(images[0], 360)}')`,
            }}
          />
        )
      )}
      style={{
        backgroundImage: `url('${api.getMediaUrl(images[0], 360)}')`,
      }}
    />
  );




  //   <Popover id={overId} {...c()} title={media.title}>
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
