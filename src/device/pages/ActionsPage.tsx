import { Css, flexRow } from "@common/helpers";
import { m4k } from '@common/m4k';
import { useCss, usePromise } from "@common/hooks";
import { Button, Div } from "@common/components";
import copyPlaylist from "../copyPlaylist";
import { newProgressDialog } from "../components/ProgressView";

const css: Css = {
    '&': {
    },
    '&Buttons': {
        ...flexRow({ justify: 'around', align: 'center', wrap: 'wrap' })
    },
    '& .m4kButton': {
        flex: 1,
        minWidth: "10em",
        m: "0.5em",
    },
    '&Info': {
        ...flexRow({ justify: 'around', align: 'center', wrap: 'wrap' }),
        p: 0.5,
    },
    '& .m4kInfo div': {
        m: 0.5,
    }
};

// const updateM4kioskApk = async () => {
//     const prog = newProgressDialog("Mise à jour")

//     const infoUrl = 'https://k.m4k.fr/info.json?t=' + Date.now()
//     prog(0.1, 'info', `Lecture : "${infoUrl}"`)

//     const infoJson = await m4k.read(infoUrl);
//     prog(0.4, 'info', `Remote Info : "${infoJson}"`)

//     const info = parse(infoJson!);

//     const remoteVersion = info?.version
//     prog(0.4, 'info', `Remote Version : "${remoteVersion}"`)

//     const currVersion = (await m4k.deviceInfo()).version
//     prog(0.5, 'info', `Current Version : "${currVersion}"`)

//     if (remoteVersion && remoteVersion !== currVersion) {
//         const downloadUrl = String(info.apkUrl)
//         const downloadPath = `@cache/${info.apkName}`
//         prog(0.5, 'info', `Télécharger : "${downloadUrl}" -> "${downloadPath}"`)

//         await m4k.download(downloadUrl, downloadPath)

//         prog(0.5, 'info', `Installer : "${downloadPath}"`)
//         await m4k.installApk(downloadPath)

//         prog(1, 'info', `OK`)
//         return
//     }

//     prog(1, 'info', `Pas de mise à jour`)
// }

const installApk = async (fileName: string) => {
    const prog = newProgressDialog("Installer AutoStart")

    const downloadUrl = `https://k.m4k.fr/${fileName}`
    const downloadPath = `@cache/${fileName}`
    prog(0.1, 'info', `Télécharger : "${downloadUrl}" -> "${downloadPath}"`)

    await m4k.download(downloadUrl, downloadPath)

    prog(0.5, 'info', `Installer : "${downloadPath}"`)
    await m4k.installApk(downloadPath)

    prog(1, 'info', `OK`)
}

const textToBinary = (text: string) => {
    const INIT = "\x1B\x40";
    const UTF8 = "\x1B\x74\x10";
    const LINE = "\x0A";
    const CUT = "\x1D\x56\x00";
    const binaryParts = [INIT, UTF8, LINE, LINE, LINE, LINE];
    const len = text.length;
    for (let i = 0; i < len; i++) {
        const char = text.charAt(i);
        const code = char.charCodeAt(0);
        const codeMap: Record<number, number> = { 8364: 128, 8230: 133 };
        const code2 = codeMap[code] || code;
        let byte = String.fromCharCode(code2);
        if (code2 >= 256) byte = " ";
        binaryParts.push(byte);
    }
    binaryParts.push(LINE, LINE, LINE, LINE, CUT);
    const binary = binaryParts.join('');
    return binary;
}

const testPrint = async () => {
    const binary = textToBinary("Mon test ! \n\n <([{ e:éè a:à euro:€ }])>")
    const base64 = btoa(binary)
    const result = await m4k.startIntent(`rawbt:base64,${base64}`)
    console.debug("testPrint", result)
}

export const ActionsPage = () => {
    const c = useCss('Actions', css);

    const [info] = usePromise(() => m4k.info(), [])

    return (
        <Div cls={c}>
            <Div cls={`${c}Info`}>
                {Object.entries(info||{}).map(([k, v], i) => (
                    <Div key={i}>{k}: <b>{v}</b></Div>
                ))}
            </Div>

            <Div cls={`${c}Buttons`}>
                <Button color="primary" onClick={() => installApk('M4Kiosk.apk')}>
                    Installer la derniére version du Kiosk
                </Button>
                <Button onClick={async () => {
                    const copyDir = await m4k.get('copyDir') || 'playlist'
                    if (!copyDir) return
                    await copyPlaylist(`@storage/${copyDir}`)
                }}>
                    Copier la playlist locale
                </Button>
                <Button onClick={() => m4k.exit()}>
                    Quitter
                </Button>
            </Div>

            <b>Installer :</b>
            <Div cls={`${c}Buttons`}>
                <Button onClick={() => installApk('autostart22.apk')}>
                    AutoStart
                </Button>
                <Button onClick={() => installApk('RawBT609.apk')}>
                    RawBt Printer V6.0.9
                </Button>
                <Button onClick={() => installApk('RawBT703.apk')}>
                    RawBt Printer V7.0.3
                </Button>
                <Button onClick={() => installApk('TeamViewerHost.apk')}>
                    TeamViewer Host
                </Button>
                <Button onClick={() => installApk('TeamViewerQS.apk')}>
                    TeamViewer QuickSupport
                </Button>
                <Button onClick={() => installApk('WebView132.apk')}>
                    WebView 132
                </Button>
            </Div>

            <b>Installer WebView :</b>
            <Div cls={`${c}Buttons`}>
                {/* https://www.apkmirror.com/apk/google-inc/android-system-webview/ */}
                <Button onClick={() => installApk('webview134_arm64_a8.apk')}>
                    WebView 134 ARM64 Android8+
                </Button>
            </Div>

            <b>Ouvrir :</b>
            <Div cls={`${c}Buttons`}>
                <Button onClick={testPrint}>
                    Test Impression
                </Button>
                <Button onClick={() => m4k.startIntent({
                    component: "ru.a402d.rawbtprinter/ru.a402d.rawbtprinter.activity.MainActivity",
                    flags: ["newTask"]
                })}>
                    RawBt Printer
                </Button>
                <Button onClick={() => m4k.startIntent({
                    component: "com.teamviewer.host.market/com.teamviewer.host.ui.HostActivity",
                    flags: ["newTask"]
                })}>
                    TeamViewer Host
                </Button>
                <Button onClick={() => m4k.startIntent({
                    component: "com.teamviewer.quicksupport.market/com.teamviewer.quicksupport.ui.QSActivity",
                    flags: ["newTask"]
                })}>
                    TeamViewer QuickSupport
                </Button>
                <Button onClick={() => m4k.openAutoStart()}>
                    AutoStart
                </Button>
            </Div>

            {/* <b>Rotation :</b>
            <div className="m4kActions">
                <Button onClick={() => m4k.set("screenOrientation", "landscape")}>Landscape</Button>
                <Button onClick={() => m4k.set("screenOrientation", "portrait")}>Portrait</Button>
                <Button onClick={() => m4k.set("screenOrientation", "reverse_landscape")}>Reverse Landscape</Button>
                <Button onClick={() => m4k.set("screenOrientation", "reverse_portrait")}>Reverse Portrait</Button>
            </div> */}

            <b>Autre :</b>
            <Div cls={`${c}Buttons`}>
                <Button onClick={async () => {
                    await m4k.set('url', 'https://boardscreen.fr/');
                    await m4k.restart();
                }}>Boardscreen</Button>
            </Div>

        </Div>
    )
}