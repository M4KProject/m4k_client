import { Css, randString, ReqError } from 'fluxio';
import { Page } from './base/Page';
import { MembersPanel } from '../panels/MembersPanel';
import { Button } from '../common/Button';
import { PlusIcon } from 'lucide-react';
import { showDialog } from '../common/Dialog';
import { useApi } from '@/hooks/useApi';
import { useState } from 'preact/hooks';
import { Role } from '@/api/models';
import { Form } from '../common/Form';
import { Field } from '../fields/Field';

const c = Css('MembersPage', {
  '': {},
});

const CreateMemberForm = ({ onClose }: { onClose: () => void }) => {
  const api = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNewField] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    if (isNew && !password) {
      setError('Mot de passe requis');
      return;
    }
    setError('');
    try {
      if (isNew) {
        await api.userColl.create({ email, password, passwordConfirm: password });
        await api.member.create({ email, group: api.needGroupId(), role: Role.editor });
      } else {
        await api.member.create({ email, group: api.needGroupId(), role: Role.editor });
      }
      onClose();
    } catch (e) {
      console.warn('create member', e);
      if (e instanceof ReqError) {
        if (e.status === 404 && !isNew) {
          setIsNewField(true);
          setPassword(randString(10));
          return;
        }
      }
      setError(String(e));
    }
  };

  return (
    <Form onSubmit={handle}>
      <Field label="Email" type="email" value={email} onValue={setEmail} error={error} />
      {isNew && (
        <Field label="Mot de passe" type="password" value={password} onValue={setPassword} />
      )}
      <Button type="submit" title="Ajouter" />
    </Form>
  );
};

export const MembersPage = () => {
  const handleCreate = () => {
    showDialog('Ajouter un membre', (open$) => (
      <CreateMemberForm onClose={() => open$.set(false)} />
    ));
  };

  return (
    <Page {...c('')}>
      <Button title="Ajouter un membre" icon={PlusIcon} color="primary" onClick={handleCreate} />
      <MembersPanel />
    </Page>
  );
};
