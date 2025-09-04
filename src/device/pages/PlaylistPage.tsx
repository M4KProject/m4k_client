import { Cell, CellHeader, Page, PageBody, PageHeader, Row, Table, TableBody, TableHead } from "@common/components";
import { useMsg } from "@common/hooks";
import { playlist$ } from "../messages";

export const PlaylistPage = () => {
  const playlist = useMsg(playlist$);
  return (
    <Page>
      <PageHeader title="Élément dans la playlist" />
      <PageBody>
        <Table>
          <TableHead>
            <Row>
              <CellHeader>Type</CellHeader>
              <CellHeader>Path</CellHeader>
              <CellHeader>Taille</CellHeader>
              <CellHeader>Format</CellHeader>
              <CellHeader>Durée</CellHeader>
            </Row>
          </TableHead>
          <TableBody>
            {(playlist?.items || []).map((item, i) => (
              <Row key={i}>
                <Cell>{item.mimeType}</Cell>
                <Cell>{item.path}</Cell>
                <Cell>{item.size}</Cell>
                <Cell>{item.width}x{item.height}</Cell>
                <Cell>{item.waitMs}</Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </PageBody>
    </Page>
  )
}
