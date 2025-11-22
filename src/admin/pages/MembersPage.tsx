import { Css } from 'fluxio';
import { randString, ReqError } from 'fluxio';
import { Plus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { MemberGrid } from '@/admin/components/MemberGrid';
import { SearchField } from '@/admin/components/SearchField';
import { Role } from '@/api/models';
import { Form } from '@/components/Form';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { showDialog } from '@/components/Dialog';
import { Page, PageBody } from '@/components/Page';
import { Toolbar } from '@/components/Toolbar';
import { useApi } from '@/hooks/apiHooks';
import { AdminSideBar } from '@/admin/components/AdminSideBar';

const c = Css('MembersPage', {});

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
    <Page {...c()} side={AdminSideBar}>
      <Toolbar title="Les membres">
        <Button title="Ajouter un membre" icon={Plus} color="primary" onClick={handleCreate} />
        <SearchField />
      </Toolbar>
      <PageBody>
        <MemberGrid />
      </PageBody>
    </Page>
  );
};
