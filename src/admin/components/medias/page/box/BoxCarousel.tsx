import { DivProps } from '@common/components';

export const BoxCarousel = (props: DivProps) => {
  console.debug('BoxCarousel render', props);
  return <div {...(props as any)} />;
};
