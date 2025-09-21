import { ContentModel } from '@common/api';
import { Css } from '@common/ui';


import { ContentProps } from './ContentProps';
import { Field } from '@common/components';

const c = Css('EmptyContent', {});

const types: [string, string][] = [
  ['empty', ''],
  ['form', 'Formulaire'],
  ['html', 'Contenu HTML'],
  ['table', 'Tableau'],
];

export const EmptyContent = ({ content, updateContent }: ContentProps<ContentModel>) => {
  return (
    <div  class={c()}>
      <Field
        label="Type de contenu"
        type="select"
        value={content.type}
        onValue={(next) => updateContent({ type: next })}
        items={types}
      />
    </div>
  );
};
