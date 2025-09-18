import { Css } from '@common/ui';
import { randKey, ReqError } from '@common/utils';
import { useCss } from '@common/hooks';
import { Role } from '@common/api/models';
import { Field, Button, Page, PageHeader, PageBody, showDialog, Form } from '@common/components';
import { Plus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { needGroupId } from '@common/api/messages';
import { collUsers } from '@common/api/collUsers';
import { collMembers } from '@common/api/collMembers';
import { MemberTable } from '../components/MembersTable';
import { SearchField } from '../components/SearchField';

const css: Css = {};

export const CreateMemberForm = ({ onClose }: { onClose: () => void }) => {
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
        await collUsers.create({ email, password, passwordConfirm: password });
        await collMembers.create({ email, group: needGroupId(), role: Role.editor });
      } else {
        await collMembers.create({ email, group: needGroupId(), role: Role.editor });
      }
      onClose();
    } catch (e) {
      console.warn('create member', e);
      if (e instanceof ReqError) {
        if (e.status === 404 && !isNew) {
          setIsNewField(true);
          setPassword(randKey(10));
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
  const c = useCss('MembersPage', css);

  const handleCreate = () => {
    showDialog('Ajouter un membre', (open$) => (
      <CreateMemberForm onClose={() => open$.set(false)} />
    ));
  };

  return (
    <Page cls={c}>
      <PageHeader title="Les membres">
        <Button title="Ajouter un membre" icon={<Plus />} color="primary" onClick={handleCreate} />
        <SearchField />
      </PageHeader>
      <PageBody>
        <MemberTable />
      </PageBody>
    </Page>
  );
};
