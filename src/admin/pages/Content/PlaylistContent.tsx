import { ContentModel, mediaColl } from "@common/api";
import { addItem, Css, flexColumn, removeIndex, toArray, updateIndex } from "@common/helpers";
import { useAsync, useCss } from "@common/hooks";
import { Div, Table, TableHead, TableBody, Row, Cell, CellHeader, Field, Button, tooltip } from "@common/components";
import { ContentProps } from "./ContentProps";
import { MdAddToPhotos, MdDeleteForever } from "react-icons/md";

const css: Css = {
    '&': {
        ...flexColumn(),
    }
};

interface PlaylistEntry {
    title: string;
    duration?: number; // en minutes
    startTime?: string; // format HH:MM
    endTime?: string; // format HH:MM
    language?: string;
    media?: string;
}

export const PlaylistContent = ({ data, updateData } : ContentProps<ContentModel>) => {
    const c = useCss('PlaylistContent', css);
    
    // Initialiser les données de la playlist si elles n'existent pas
    const items: PlaylistEntry[] = toArray(data.items, []);

    const setItems = (items: PlaylistEntry[]) => updateData({ items });
    
    const handleAdd = () => {
        setItems(addItem(items, { title: "Nouvelle entrée" }));
    };
    
    const handleUpdate = (index: number, changes: Partial<PlaylistEntry>) => 
        setItems(updateIndex(items, index, changes));
    
    const handleDelete = (index: number) =>
        setItems(removeIndex(items, index));

    const [medias] = useAsync([], () => mediaColl.find({}));
    
    return (
        <Div cls={c}>
            <Table>
                <TableHead>
                    <Row>
                        <CellHeader>Titre</CellHeader>
                        <CellHeader>Durée (s)</CellHeader>
                        <CellHeader>Heure début</CellHeader>
                        <CellHeader>Heure fin</CellHeader>
                        <CellHeader>Langue</CellHeader>
                        <CellHeader>Media</CellHeader>
                        <CellHeader>Actions</CellHeader>
                    </Row>
                </TableHead>
                <TableBody>
                    {items.map((entry, index) => (
                        <Row key={index}>
                            <Cell>
                                <Field
                                    value={entry.title}
                                    onValue={title => handleUpdate(index, { title })}
                                />
                            </Cell>
                            <Cell>
                                <Field
                                    type="number"
                                    value={entry.duration?.toString() || ""}
                                    onValue={duration => handleUpdate(index, { duration: duration ? parseInt(duration) : undefined })}
                                />
                            </Cell>
                            <Cell>
                                <Field
                                    type="time"
                                    value={entry.startTime || ""}
                                    onValue={startTime => handleUpdate(index, { startTime: startTime || undefined })}
                                />
                            </Cell>
                            <Cell>
                                <Field
                                    type="time"
                                    value={entry.endTime || ""}
                                    onValue={endTime => handleUpdate(index, { endTime: endTime || undefined })}
                                />
                            </Cell>
                            <Cell>
                                <Field
                                    type="select"
                                    value={entry.language || ""}
                                    items={[["fr", "Français"], ["en", "Anglais"]]}
                                    onValue={language => handleUpdate(index, { language })}
                                />
                            </Cell>
                            <Cell>
                                <Field
                                    type="select"
                                    value={entry.media || ""}
                                    items={medias.map(g => [g.id, g.name])}
                                    onValue={id => handleUpdate(index, { media: id || "" })}
                                />
                            </Cell>
                            <Cell variant="around">
                                <Button
                                    icon={<MdDeleteForever />}
                                    color="error"
                                    {...tooltip("Supprimer")}
                                    onClick={() => handleDelete(index)}
                                />
                            </Cell>
                        </Row>
                    ))}
                </TableBody>
            </Table>
            <Button 
                title="Ajouter une entrée" 
                icon={<MdAddToPhotos />} 
                color="primary" 
                onClick={handleAdd} 
            />
        </Div>
    )
}
