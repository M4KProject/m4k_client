import { BComp } from './bTypes';

export const BVideo: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BVideo', i, item, props, ctrl);

  return <div {...props} />;
};

export const BImage: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BImage', i, item, props, ctrl);

  return <div {...props} />;
};

export const BDoc: BComp = ({ i, item, props, ctrl }) => {
  console.debug('BDoc', i, item, props, ctrl);

  return <div {...props} />;
};