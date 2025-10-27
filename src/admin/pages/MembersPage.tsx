import { Css } from '@common/ui';
import { randString, ReqError } from 'fluxio';
import { Field, Button, Page, Toolbar, PageBody, showDialog, Form } from '@common/components';
import { Plus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { MemberGrid } from '../components/MemberGrid';
import { SearchField } from '../components/SearchField';
import { Role, needGroupId, memberSync, userColl } from '@/api';

const c = Css('MembersPage', {});

const CreateMemberForm = ({ onClose }: { onClose: () => void }) => {
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
        await userColl.create({ email, password, passwordConfirm: password });
        await memberSync.create({ email, group: needGroupId(), role: Role.editor });
      } else {
        await memberSync.create({ email, group: needGroupId(), role: Role.editor });
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
    <Page class={c()}>
      <Toolbar title="Les membres">
        <Button title="Ajouter un membre" icon={<Plus />} color="primary" onClick={handleCreate} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MemberGrid />
      </PageBody>
    </Page>
  );
};
