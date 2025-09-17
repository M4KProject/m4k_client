import { FormContentModel } from '@common/api/models';
import { ContentProps } from './ContentProps';
import { FormContent } from './FormContent';
import { FieldInfo } from '@common/components';

const hiboutikFields: FieldInfo[] = [
  { name: 'domain', label: 'Domaine: (demo.hiboutik.com)' },
  { name: 'login', label: 'API login (dans Paramètres / API)' },
  { name: 'key', label: 'API key (dans Paramètres / API)' },
  { name: 'bunnyKey' },
  { name: 'homeImage', type: 'image' },
];

export const HiboutikContent = (props: ContentProps<FormContentModel>) => {
  return <FormContent {...props} edit={<></>} data={{ ...props.data, fields: hiboutikFields }} />;
};
