import { ContentModel } from '@common/api/models';
import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { Div, Field } from '@common/components';
import { ContentProps } from './ContentProps';

const css: Css = {};

export const HtmlContent = ({ data, updateData }: ContentProps<ContentModel>) => {
  const c = useCss('HtmlContent', css);
  return (
    <Div cls={c}>
      <Field type="html" value={data.html} onValue={(next) => updateData({ html: next })} />
    </Div>
  );
};
