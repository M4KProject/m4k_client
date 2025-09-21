import { Css, clipboardCopy, clipboardPaste } from '@common/ui';
import { isSearched, toErr, toBool } from '@common/utils';
import { useAsync, useMsg } from '@common/hooks';
import { search$ } from '../messages/search$';
import {
  Button,
  Field,
  Page,
  PageHeader,
  PageBody,
  Table,
  Cell,
  CellHeader,
  Row,
  TableBody,
  TableHead,
  tooltip,
} from '@common/components';
import { Plus, RefreshCw, Copy, Clipboard, Edit, Trash2 } from 'lucide-react';
import { SearchField } from '../components/SearchField';
import { isAdvanced$ } from '../messages';
import { auth$, groupId$, needGroupId, ContentModel, ModelUpdate, coll } from '@common/api';

const c = Css('ContentsPage', {});

const collContents = coll('contents');
const collGroups = coll('groups');

const handleCopy = async (content: ContentModel) => {
  console.debug('handleCopy', content);
  if (!content.data) {
    const next = await collContents.get(content.id);
    if (!next) throw toErr('no-content-found');
    await clipboardCopy(next);
    return;
  }
  await clipboardCopy(content);
};

const handlePaste = async (content: ContentModel) => {
  const pasteData = await clipboardPaste();
  console.debug('handlePaste', pasteData);
  if (typeof pasteData !== 'object') return;
  const { css, js, data } = pasteData;
  console.debug('handlePaste css', { css, js, data });
  if (typeof data !== 'object') return;
  const nextData = { ...data, css, js };
  await collContents.update(content.id, { data: nextData });
};

export const ContentsPage = () => {
  const search = useMsg(search$);
  const auth = useMsg(auth$);
  const groupId = useMsg(groupId$);
  const isAdvanced = useMsg(isAdvanced$);

  const [groups, groupsRefresh] = useAsync([], () => collGroups.find({}));

  const [contents, contentsRefresh] = useAsync(
    [],
    () => collContents.find(groupId ? { group: groupId } : {}),
    'contents',
    [groupId]
  );
  const filteredContents = search ? contents.filter((g) => isSearched(g.title, search)) : contents;

  const handleAdd = async () => {
    if (!auth) return;
    await collContents.create({
      title: 'Nouveau',
      group: needGroupId(),
      // type: 'empty',
      data: {},
    });
    await groupsRefresh();
    await contentsRefresh();
  };

  const handleUpdate = async (content: ContentModel, changes: ModelUpdate<ContentModel>) => {
    await collContents.update(content.id, changes);
    await groupsRefresh();
    await contentsRefresh();
  };

  const handleDelete = async (content: ContentModel) => {
    await collContents.delete(content.id);
    await groupsRefresh();
    await contentsRefresh();
  };

  return (
    <Page class={c()}>
      <PageHeader title="Les contenus">
        <Button title="Ajouter un contenu" icon={<Plus />} color="primary" onClick={handleAdd} />
        <Button title="Rafraîchir" icon={<RefreshCw />} color="primary" onClick={contentsRefresh} />
        <SearchField />
      </PageHeader>
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              {isAdvanced && <CellHeader>Groupe</CellHeader>}
              {isAdvanced && <CellHeader>Clé</CellHeader>}
              {isAdvanced && <CellHeader>Publique</CellHeader>}
              <CellHeader>Type</CellHeader>
              <CellHeader>Titre</CellHeader>
              {/* <CellHeader>Aperçu</CellHeader> */}
              <CellHeader>Actions</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {filteredContents.map((c) => (
              <Row key={c.id}>
                {isAdvanced && (
                  <Cell>
                    <Field
                      type="select"
                      items={groups.map((g) => [g.id, g.name])}
                      value={c.group}
                      onValue={(group) => handleUpdate(c, { group })}
                    />
                  </Cell>
                )}
                {isAdvanced && (
                  <Cell>
                    <Field
                      {...tooltip(c.id)}
                      value={c.key}
                      onValue={(key) => handleUpdate(c, { key })}
                    />
                  </Cell>
                )}
                {isAdvanced && (
                  <Cell>
                    <Field
                      type="switch"
                      value={c.public}
                      onValue={(v) => handleUpdate(c, { public: toBool(v) })}
                    />
                  </Cell>
                )}
                <Cell>
                  <Field
                    type="select"
                    items={[
                      ['form', 'Formulaire'],
                      ['table', 'Tableau'],
                      ['playlist', 'Playlist'],
                      ['html', 'Page HTML'],
                    ]}
                    value={c.type}
                    onValue={(type) => handleUpdate(c, { type })}
                  />
                </Cell>
                <Cell>
                  <Field value={c.title} onValue={(title) => handleUpdate(c, { title })} />
                </Cell>
                <Cell variant="around">
                  <Button
                    icon={<Copy />}
                    color="primary"
                    {...tooltip('Copier')}
                    onClick={() => handleCopy(c)}
                  />
                  <Button
                    icon={<Clipboard />}
                    color="primary"
                    {...tooltip('Coller')}
                    onClick={() => handlePaste(c)}
                  />
                  {/* <Button
                    icon={<Edit />}
                    color="primary"
                    {...tooltip('Modifier')}
                    onClick={() => openContent(c.key || c.id)}
                  /> */}
                  <Button
                    icon={<Trash2 />}
                    color="error"
                    {...tooltip('Supprimer')}
                    onClick={() => handleDelete(c)}
                  />
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PageBody>
    </Page>
  );
};
