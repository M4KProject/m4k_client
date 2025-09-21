import { ContentModel } from '@common/api';
import { Css } from '@common/ui';
import { Field } from '@common/components';
import { ContentProps } from './ContentProps';

const css = Css('HtmlContent', {});

export const HtmlContent = ({ data, updateData }: ContentProps<ContentModel>) => {
  return (
    <div class={css()}>
      <Field type="html" value={data.html} onValue={(next) => updateData({ html: next })} />
    </div>
  );
};
