import { setCss } from "@common/helpers/html";
import Form from "../../../android/old/Form";
import { m4k } from '@/getM4k';
import {usePromise} from "@common/hooks/usePromise";
import { flexRow } from "@common/helpers/flexBox";
import { toNbr } from "@common/helpers/cast";
import { getOrDefault } from "@/m4kExtends";

setCss('m4kConfigPage', {
    '&': {
    },
    '&Actions': {
        ...flexRow({ align: "center" }),
        p: "0.5em",
    },
    '&Actions .m4kButton': {
        flex: 1,
        m: "0.5em",
    },
});

const ConfigPage = () => {

    const [initBase] = usePromise(async () => {
        const password = await getOrDefault("password");
        return { password };
    }, [])

    const [initSite] = usePromise(async () => {
        const url = await getOrDefault("url");
        const backColor = await getOrDefault("backColor");
        return { url, backColor }
    }, [])

    const [initPlaylist] = usePromise(async () => {
        const copyDir = await getOrDefault("copyDir")
        const itemDurationMs = await getOrDefault("itemDurationMs")
        const itemDuration = itemDurationMs / 1000 + 's'
        const itemFit = await getOrDefault("itemFit")
        const itemAnim = await getOrDefault("itemAnim")
        const hasVideoMuted = await getOrDefault("hasVideoMuted")
        return { copyDir, itemDuration, itemFit, itemAnim, hasVideoMuted }
    }, [])

    return (
        <div className="m4kConfigPage">

            {initBase ? (
                <Form
                    title="Configuration Base"
                    options={{
                        init: initBase,
                        fields: {
                            password: {
                                label: "Mot de passe",
                            },
                        },
                        onSubmit: async (form: any) => {
                            console.debug('submit data', form);
                            let { password } = form.values
                            password = password.toLowerCase() || 'mediactil'

                            await m4k.merge({ password })
                            await m4k.reload()
                        },
                    }}
                />
            ) : 'Chargement...'}

            {initSite ? (
                <Form
                    title="Configuration Page Web"
                    options={{
                        init: initSite,
                        fields: {
                            url: {
                                label: "URL",
                                helperText: "https://",
                            },
                            backColor: {
                                label: "Bouton Retour Couleur",
                                helperText: "FF0000",
                            },
                        },
                        onSubmit: async (form: any) => {
                            console.debug('submit data', form);
                            let { url } = form.values;
                            await m4k.merge({ url });
                            await m4k.reload();
                        },
                    }}
                />
            ) : 'Chargement...'}

            {initPlaylist ? (
                <Form
                    title="Configuration Playlist"
                    options={{
                        init: initPlaylist,
                        fields: {
                            copyDir: {
                                label: "Copier le dossier",
                            },
                            itemDuration: {
                                label: "Durée d'affichage d'une image (en secondes)",
                                type: "text",
                            },
                            itemFit: {
                                label: "Mode d'affichage des images/video",
                                type: "select",
                                values: {
                                    contain: 'contient',
                                    cover: 'couverture',
                                    fill: 'remplissage',
                                },
                            },
                            itemAnim: {
                                label: "Animation",
                                type: "select",
                                values: {
                                    rightToLeft: 'droite gauche',
                                    topToBottom: 'haut bas',
                                    fade: 'fondu',
                                    zoom: 'zoom',
                                },
                            },
                            hasVideoMuted: {
                                label: "Video sans audio",
                                type: "select",
                                values: {
                                    true: 'oui',
                                    false: 'non'
                                },
                            }
                        },
                        onSubmit: async (form: any) => {
                            console.debug('submit data', form);
                            let { copyDir, itemDuration, itemFit, itemAnim, hasVideoMuted } = form.values
                            const itemDurationMs = toNbr(itemDuration, 10)*1000
                            hasVideoMuted = Boolean(hasVideoMuted)

                            await m4k.merge({ copyDir, itemDurationMs, itemFit, itemAnim, hasVideoMuted })
                            await m4k.reload()
                        },
                    }}
                />
            ) : 'Chargement...'}

        </div>
    )
}

export default ConfigPage;