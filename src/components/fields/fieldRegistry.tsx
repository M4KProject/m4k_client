import { useState } from 'preact/hooks';
import { Button } from '@/components/Button';
import { FieldComp, FieldType } from './types';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Select } from './Select';
import { Picker } from './Picker';
import { fieldStyle } from './fieldStyle';

const c = fieldStyle;

const getMediaField = (_mimetypes: string[]): FieldComp => {
  // const mimetypeMap = by(mimetypes, m => m, () => true);
  return ({ cls, name, required, value, onChange, fieldProps }) => {
    // const medias = Object.values(useFlux(medias$));
    // const filteredMedias = medias.filter(m => mimetypeMap[m.mimetype]);
    // const groupId = useFlux(groupId$);
    return (
      <select
        name={name}
        required={required}
        value={value || ''}
        onChange={onChange}
        {...fieldProps.props}
        {...c(cls, fieldProps.props)}
      >
        {/* <option value="" className={!value ? `${cls}Selected` : undefined}></option>
                {Object.values(filteredMedias).map(media => (
                    <option key={media.id} value={media.id} className={media.id === value ? `${cls}Selected` : undefined}>
                        {media.name.replace(`${groupId}/`, '')}
                    </option>
                ))} */}
      </select>
    );
  };
};

export const fieldRegistry: Record<FieldType, FieldComp> = {
  email: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="email"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  password: ({ cls, name, required, value, onChange, fieldProps }) => {
    const [show, setShow] = useState(false);
    return (
      <>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required={required}
          value={value || ''}
          onChange={onChange}
          {...fieldProps.props}
          {...c(cls, fieldProps.props)}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShow((s) => !s);
          }}
          icon={show ? <EyeOffIcon /> : <EyeIcon />}
        />
      </>
    );
  },
  color: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="color"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  text: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  multiline: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  json: ({ cls, name, required, value, onChange, fieldProps }) => (
    <textarea
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      rows={5}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  number: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="number"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  // select: ({ name, required, value, onChange, fieldProps }) => (
  //     <select class={cls} name={name} required={required} value={value||''} onChange={onChange} {...fieldProps.props}>
  //         {/* <option value=""></option> */}
  //         {fieldProps.items?.map(kv => (
  //             isArray(kv) ? (
  //                 <option key={kv[0]} value={kv[0]} class={kv[0] === value ? `${cls}Selected` : undefined}>
  //                     {kv[1]}
  //                 </option>
  //             ) : null
  //         ))}
  //     </select>
  // ),
  select: ({ fieldProps, ...props }) => (
    <Select {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  picker: ({ fieldProps, ...props }) => (
    <Picker {...props} items={fieldProps.items} {...fieldProps.props} />
  ),
  switch: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        {...c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <div {...c(`${cls}Handle`)}></div>
      </div>
    );
  },
  check: ({ cls, value, onChange, fieldProps }) => {
    return (
      <div
        onClick={() => onChange(!value)}
        {...fieldProps.props}
        {...c(cls, value && `${cls}-selected`, fieldProps.props)}
      >
        <CheckIcon />
      </div>
    );
  },
  image: getMediaField(['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf']),
  doc: getMediaField(['application/pdf']),
  date: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  datetime: ({ cls, name, required, value, onChange, fieldProps }) => (
    <input
      type="date"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
  seconds: ({ cls, name, required, value, onChange, onBlur, fieldProps }) => (
    <input
      type="text"
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      placeholder="00:00:00"
      {...fieldProps.props}
      {...c(cls, fieldProps.props)}
    />
  ),
};
