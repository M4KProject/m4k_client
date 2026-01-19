import { Css, randString, ReqError } from 'fluxio';
import { Page } from './base/Page';
import { Members } from '../panels/Members';
import { Button } from '../common/Button';
import { PlusIcon } from 'lucide-react';
import { showDialog } from '../common/Dialog';
import { useState } from 'preact/hooks';
import { Form } from '../common/Form';
import { Field } from '../fields/Field';
import { api2 } from '@/api2';
import { useFlux } from '@/hooks/useFlux';

const c = Css('MembersPage', {
  '': {},
});

const CreateMemberForm = ({ onClose }: { onClose: () => void }) => {
  const groupId = useFlux(api2.groups.id$);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNew, setIsNewField] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!groupId) return;
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
      if (isNew) await api2.register(email, password, false);
      await api2.members.create({ email, desc: '', groupId, role: 20 });
      onClose();
    } catch (e) {
      console.warn('create member', e);
      if (e instanceof ReqError) {
        console.warn('create member', e.status, e.message, e.ctx.data);
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
      <Members />
    </Page>
  );
};
