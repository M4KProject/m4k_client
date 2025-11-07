import { DivProps } from '@/components/types';

export const BoxCarousel = (props: DivProps) => {
  console.debug('BoxCarousel render', props);
  return <div {...(props as any)} />;
};
