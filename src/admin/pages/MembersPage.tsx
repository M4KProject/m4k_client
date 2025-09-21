import { Css } from '@common/ui';
import { randKey, ReqError } from '@common/utils';

import { Field, Button, Page, PageHeader, PageBody, showDialog, Form } from '@common/components';
import { Plus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { MemberTable } from '../components/MembersTable';
import { SearchField } from '../components/SearchField';
import { Role, needGroupId } from '@common/api';
import { memberCtrl, userCtrl } from '../controllers';

const css = Css('MembersPage', {});

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
        await userCtrl.create({ email, password, passwordConfirm: password });
        await memberCtrl.create({ email, group: needGroupId(), role: Role.editor });
      } else {
        await memberCtrl.create({ email, group: needGroupId(), role: Role.editor });
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
  const handleCreate = () => {
    showDialog('Ajouter un membre', (open$) => (
      <CreateMemberForm onClose={() => open$.set(false)} />
    ));
  };

  return (
    <Page  cls={css()}>
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
