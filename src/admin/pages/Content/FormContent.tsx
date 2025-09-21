import { FormContentModel } from '@common/api';
import { Css } from '@common/ui';

import { Form, Field } from '@common/components';
import { ContentProps } from './ContentProps';
import { FieldsEdit } from './FieldsEdit';
import { JSX } from 'preact';

const c = Css('FormContent', {});

export const FormContent = (props: ContentProps<FormContentModel> & { edit?: JSX.Element }) => {
  const { edit, data, updateData } = props;
  const fields = data.fields || [];
  const values = data.values || {};
  return (
    <div class={c()}>
      {edit || <FieldsEdit {...props} />}
      <Form>
        {fields.map((field) => {
          const name = field.name;
          if (!name) return null;
          return (
            <Field
              key={name}
              {...field}
              value={values[name]}
              onValue={(next) => updateData({ values: { ...values, [name]: next } })}
              delay={400}
            />
          );
        })}
      </Form>
    </div>
  );
};
