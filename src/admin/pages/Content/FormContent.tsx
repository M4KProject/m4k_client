import { FormContentModel } from '@common/api/models';
import { Css } from '@common/ui';
import { useCss } from '@common/hooks';
import { Div, Form, Field } from '@common/components';
import { ContentProps } from './ContentProps';
import { FieldsEdit } from './FieldsEdit';
import { JSX } from 'preact';

const css: Css = {};

export const FormContent = (props: ContentProps<FormContentModel> & { edit?: JSX.Element }) => {
  const { edit, data, updateData } = props;
  const c = useCss('FormContent', css);
  const fields = data.fields || [];
  const values = data.values || {};
  return (
    <Div cls={c}>
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
    </Div>
  );
};
