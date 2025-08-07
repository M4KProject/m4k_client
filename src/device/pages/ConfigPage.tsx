import { Css } from "@common/helpers";
import { Form, Field, Button } from "@common/components";
import { m4k } from '@common/m4k';
import { usePromise, useCss } from "@common/hooks";
import { flexRow } from "@common/helpers/flexBox";
import { toNbr } from "@common/helpers/cast";
import { useState } from "preact/hooks";

const css: Css = {
    '&': {
        p: 1,
    },
    '&Actions': {
        ...flexRow({ align: "center" }),
        p: 0.5,
        gap: 0.5,
    },
    '&Actions .Button': {
        flex: 1,
    },
};

const ConfigPage = () => {
    const c = useCss('ConfigPage', css);
    
    // Base configuration state
    const [password, setPassword] = useState('');
    const [initBase] = usePromise(async () => {
        const passwordValue = await m4k.get("password");
        setPassword(passwordValue || '');
        return passwordValue;
    }, []);

    // Site configuration state
    const [url, setUrl] = useState('');
    const [backColor, setBackColor] = useState('');
    const [initSite] = usePromise(async () => {
        const urlValue = await m4k.get("url");
        const backColorValue = await m4k.get("backColor");
        setUrl(urlValue || '');
        setBackColor(backColorValue || '');
        return { url: urlValue, backColor: backColorValue };
    }, []);

    // Playlist configuration state
    const [copyDir, setCopyDir] = useState('');
    const [itemDuration, setItemDuration] = useState('');
    const [itemFit, setItemFit] = useState<'contain'|'cover'|'fill'>('contain');
    const [itemAnim, setItemAnim] = useState<'rightToLeft'|'topToBottom'|'fade'|'zoom'>('rightToLeft');
    const [hasVideoMuted, setHasVideoMuted] = useState<string>('true');
    const [initPlaylist] = usePromise(async () => {
        const copyDirValue = await m4k.get("copyDir");
        const itemDurationMs = await m4k.get("itemDurationMs");
        const itemDurationValue = itemDurationMs / 1000 + 's';
        const itemFitValue = await m4k.get("itemFit");
        const itemAnimValue = await m4k.get("itemAnim");
        const hasVideoMutedValue = await m4k.get("hasVideoMuted");
        
        setCopyDir(copyDirValue || '');
        setItemDuration(itemDurationValue || '10s');
        setItemFit(itemFitValue || 'contain');
        setItemAnim(itemAnimValue || 'rightToLeft');
        setHasVideoMuted(hasVideoMutedValue ? 'true' : 'false');
        
        return { copyDir: copyDirValue, itemDuration: itemDurationValue, itemFit: itemFitValue, itemAnim: itemAnimValue, hasVideoMuted: hasVideoMutedValue };
    }, []);

    const handleBaseSubmit = async (e: Event) => {
        e.preventDefault();
        const passwordValue = password.toLowerCase() || 'mediactil';
        await m4k.merge({ password: passwordValue });
        await m4k.reload();
    };

    const handleSiteSubmit = async (e: Event) => {
        e.preventDefault();
        await m4k.merge({ url, backColor });
        await m4k.reload();
    };

    const handlePlaylistSubmit = async (e: Event) => {
        e.preventDefault();
        const itemDurationMs = toNbr(itemDuration.replace('s', ''), 10) * 1000;
        await m4k.merge({ 
            copyDir, 
            itemDurationMs, 
            itemFit, 
            itemAnim, 
            hasVideoMuted: hasVideoMuted === 'true'
        });
        await m4k.reload();
    };

    return (
        <div class={c}>
            {initBase !== undefined ? (
                <Form title="Configuration Base" onSubmit={handleBaseSubmit}>
                    <Field
                        type="password"
                        name="password"
                        label="Mot de passe"
                        value={password}
                        onValue={setPassword}
                        required
                    />
                    <div class={`${c}Actions`}>
                        <Button >Sauvegarder</Button>
                    </div>
                </Form>
            ) : 'Chargement...'}

            {initSite ? (
                <Form title="Configuration Page Web" onSubmit={handleSiteSubmit}>
                    <Field
                        type="text"
                        name="url"
                        label="URL"
                        helper="https://"
                        value={url}
                        onValue={setUrl}
                    />
                    <Field
                        type="color"
                        name="backColor"
                        label="Bouton Retour Couleur"
                        helper="#FF0000"
                        value={backColor}
                        onValue={setBackColor}
                    />
                    <div class={`${c}Actions`}>
                        <Button >Sauvegarder</Button>
                    </div>
                </Form>
            ) : 'Chargement...'}

            {initPlaylist ? (
                <Form title="Configuration Playlist" onSubmit={handlePlaylistSubmit}>
                    <Field
                        type="text"
                        name="copyDir"
                        label="Copier le dossier"
                        value={copyDir}
                        onValue={setCopyDir}
                    />
                    <Field
                        type="text"
                        name="itemDuration"
                        label="Durée d'affichage d'une image (en secondes)"
                        value={itemDuration}
                        onValue={setItemDuration}
                    />
                    <Field
                        type="select"
                        name="itemFit"
                        label="Mode d'affichage des images/video"
                        value={itemFit}
                        onValue={setItemFit}
                        items={[
                            ['contain', 'contient'],
                            ['cover', 'couverture'],
                            ['fill', 'remplissage']
                        ]}
                    />
                    <Field
                        type="select"
                        name="itemAnim"
                        label="Animation"
                        value={itemAnim}
                        onValue={setItemAnim}
                        items={[
                            ['rightToLeft', 'droite gauche'],
                            ['topToBottom', 'haut bas'],
                            ['fade', 'fondu'],
                            ['zoom', 'zoom']
                        ]}
                    />
                    <Field
                        type="select"
                        name="hasVideoMuted"
                        label="Video sans audio"
                        value={hasVideoMuted}
                        onValue={setHasVideoMuted}
                        items={[
                            ['true', 'oui'],
                            ['false', 'non']
                        ]}
                    />
                    <div class={`${c}Actions`}>
                        <Button >Sauvegarder</Button>
                    </div>
                </Form>
            ) : 'Chargement...'}

        </div>
    )
}

export { ConfigPage };