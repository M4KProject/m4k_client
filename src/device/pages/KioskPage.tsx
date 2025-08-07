import { toNbr, flexColumn, Css, flexCenter, clsx } from "@common/helpers";
import { Button, Div, Iframe } from "@common/components";
import { useCss, usePromise } from "@common/hooks";
import { m4k, PlaylistItem  } from "@common/m4k";
import { useEffect, useRef, useState } from "react";
import { useConfigProp } from "@/hooks/useConfigProp";
import { openPasswordDialog } from "@/components/PasswordView";

const css: Css = {
    '&Container': {
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        bg: '#000',
    },
    '&Container-center': {
        ...flexColumn({ align: 'center', justify: 'center' }),
    },
    '&Container iframe': {
        position: 'fixed',
        overflow: 'hidden',
        inset: 0,
        border: 0,
        w: '100%',
        h: '100%',
        bg: '#fff',
    },

    '&': {
        ...flexCenter(),
        position: 'absolute',
        overflow: 'hidden',
        inset: 0,
        color: '#fff',
        transition: 'all 0.3s ease',
        zIndex: 1,
        bg: '#000',
        // bg: '#f00',
    },
    '&-hidden': { visibility: 'hidden', opacity: 0 },
    '&-prev': { zIndex: 3, opacity: 0 },
    '&-next': { zIndex: 2, opacity: 0 },
    '&-curr': { zIndex: 4, opacity: 1 },

    '&-rightToLeft&-hidden, &-rightToLeft&-prev': { transform: 'translateX(-100%)' },
    '&-rightToLeft&-next': { transform: 'translateX(+100%)' },

    '&-topToBottom&-hidden, &-topToBottom&-prev': { transform: 'translateY(+100%)' },
    '&-topToBottom&-next': { transform: 'translateY(-100%)' },

    '&-zoom&-hidden, &-zoom&-prev, &-zoom&-next': { transform: 'scale(0)' },

    '& div': { width: '100%', height: '100%', bgMode: "fill" },
    '&-contain div': { bgMode: "contain" },
    '&-cover div': { bgMode: "cover" },

    '& video': { itemFit: "fill" },
    '&-contain video': { itemFit: "contain" },
    '&-cover video': { itemFit: "cover" },

    '& span': {
        ...flexCenter(),
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        fg: 'warn',
        m: 1,
    },
}

// (async () => {
//     const itemFit = await getOrDefault('itemFit')
//     const itemAnim = await getOrDefault('itemAnim')

//     setCss('m4kKioskPage', {
//         '&': {
//         }
//     });
    
//     setCss('m4kItem', {
//         '&': {
//         },
//         '& .m4kItemEmpty': {
//             ...flexColumn({ align: 'center', justify: 'center' }),
//         },
//         '&-hidden': {
//             visibility: 'hidden',
//         },
//         '&-curr': {
//         },
//         '&-prev': {
//         },
//         '&-next': {
//         },
//         '& div': {
//             width: '100%',
//             height: '100%',
//             bgMode: itemFit,
//         },
//         '& video': {
//             itemFit: itemFit,
//         },
//         '& span': {
//             ...flexCenter(),
//             position: 'absolute',
//             inset: 0,
//             zIndex: 20,
//             color: cWarn,
//         }
//     });
// })()

// const ImageItem = ({ item, info, pos, gotoNext }: { item: PlaylistItem, info: M4kFileInfo, pos: 'hidden'|'prev'|'curr'|'next', gotoNext: () => void }) => {
//     const [itemDurationMs] = useConfigProp('itemDurationMs');

//     useEffect(() => {
//         console.debug('ImageItem ')
//         if (pos === 'curr') {
//             const timer = setTimeout(gotoNext, toNbr(item.waitMs, itemDurationMs));
//             return () => clearTimeout(timer);
//         }
//     }, [pos, itemDurationMs])

//     return (
//         <div style={{ backgroundImage: `url('${info.url}')` }} />
//     )
// }

// const VideoItem = ({ info, gotoNext }: { item: PlaylistItem, info: M4kFileInfo, pos: 'hidden'|'prev'|'curr'|'next', gotoNext: () => void }) => {
//     const [hasVideoMuted] = useConfigProp('hasVideoMuted');
//     const videoRef = useRef<HTMLVideoElement>(null);
//     const el = videoRef.current

//     useEffect(() => {
//         if (!el) return
        
//         const time$ = new Msg(0);

//         const off1 = time$.debounce(2000).on(gotoNext)
//         const off2 = addListener(el, 'timeupdate', () => time$.set(Date.now()));
//         const off3 = addListener(el, 'ended', gotoNext);
        
//         return () => {
//             off1()
//             off2()
//             off3()
//         };
//     }, [el, info.url, gotoNext]);

//     return (
//         <video
//             ref={videoRef}
//             src={info.url}
//             autoPlay
//             loop
//             muted={hasVideoMuted}
//             onError={gotoNext}
//         />
//     )
// }

const KioskItem = ({ item, itemFit, itemAnim, hasVideoMuted, itemDurationMs, pos, gotoNext }: {
    item: PlaylistItem,
    itemFit?: string,
    itemAnim?: string,
    hasVideoMuted?: boolean,
    itemDurationMs?: number,
    pos: 'hidden'|'prev'|'curr'|'next',
    gotoNext: () => void
}) => {
    const c = useCss('Kiosk', css);
    const ref = useRef<HTMLVideoElement&HTMLDivElement>(null);
    const [info] = usePromise(() => m4k.fileInfo(item.path), [item])

    const isCurr = pos === 'curr';
    const isImage = !!info && info.mimeType.startsWith('image')
    const isVideo = !!info && info.mimeType.startsWith('video')
    const duration = isVideo ? 0 : toNbr(item.waitMs, itemDurationMs||5000)

    useEffect(() => {
        if (isCurr || duration) {
            const timer = setTimeout(gotoNext, duration);
            return () => clearTimeout(timer);
        }
    }, [isCurr])

    return (
        <Div cls={[`${c}`, itemFit && `${c}-${itemFit}`, itemAnim && `${c}-${itemAnim}`, pos && `${c}-${pos}`]}>
            {/* Fichier: {item.path}<br />
            Pos: {pos}<br />
            Type: {info?.type}<br />
            Url: {info?.url}<br />
            Duration: {duration}<br />
            Clsx: {clsx([`${c}`, itemFit && `${c}-${itemFit}`, itemAnim && `${c}-${itemAnim}`, pos && `${c}-${pos}`])} */}
            {isVideo ? (
                <video
                    ref={ref}
                    src={info.url}
                    autoPlay
                    loop
                    muted={hasVideoMuted}
                    onError={gotoNext}
                    onEnded={gotoNext}
                />
            ) :
            isImage ? (
                <div ref={ref} style={{ backgroundImage: `url('${info?.url}')` }} /> 
            ) : (
                <span>Fichier: {item.path} Type: {info?.type}</span>
            )}
        </Div>
        // <Div className={`${c} ${c}-${itemFit} ${c}-${itemAnim} ${c}-${pos}`}>
        //     {pos === 'hidden' ? null : (
        //         // isImage ? <ImageItem item={item} info={info} pos={pos} gotoNext={gotoNext} /> :
        //         // isVideo ? <VideoItem item={item} info={info} pos={pos} gotoNext={gotoNext} /> :
        //         isImage ? <div style={{ backgroundImage: `url('${info.url}')` }} /> :
        //         isVideo ? <span>Video:{item.path} {pos} type:{info?.type} url:{info?.url}</span> :
        //         <span>Fichier:{item.path} {pos} type:{info?.type} url:{info?.url}</span>
        //     )}
        //     <span>url:{info?.url}</span>
        // </Div>
    )
}

export const KioskPage = () => {
    const c = useCss('Kiosk', css);

    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);

    const [url] = useConfigProp('url');
    const [playlist] = useConfigProp('playlist');
    const [itemDurationMs] = useConfigProp('itemDurationMs');
    const [itemFit] = useConfigProp('itemFit')
    const [itemAnim] = useConfigProp('itemAnim');
    const [hasVideoMuted] = useConfigProp('hasVideoMuted');

    const items = playlist?.items?.filter(i => i) || [];
    const length = items?.length || 0

    const currIndex = count % length
    const prevIndex = (currIndex - 1 + length) % length
    const nextIndex = (currIndex + 1) % length

    const curr = items[currIndex]
    const prev = items[prevIndex]
    const next = items[nextIndex]

    const gotoNext = () => setCount(count => count + 1)

    console.debug('KioskPage', { prev, curr, next })

    // if (url) {
    //     return (
    //         <Iframe style={{}}>
    //             {url}
    //         </Iframe>
    //     )
    // }

    if (length === 0) {
        return (
            <Div cls={`${c}Container ${c}Container-center`}>
                Aucun élément dans la playlist
                <Button color="primary" onClick={() => openPasswordDialog()}>
                    Configurer
                </Button>
            </Div>
        );
    }

    if (url && open) {
        return (
            <Div cls={`${c}Container`}>
                <iframe src={url.startsWith('http') ? url : `https://${url}`} />
            </Div>
        )
    }

    return (
        <Div cls={`${c}Container`} onClick={() => setOpen(true)}>
            {items.map(item => (
                <KioskItem
                    key={item.path}
                    item={item}
                    itemFit={itemFit||'contain'}
                    itemAnim={itemAnim||'zoom'}
                    hasVideoMuted={hasVideoMuted}
                    itemDurationMs={itemDurationMs}
                    gotoNext={gotoNext}
                    pos={
                        item === curr ? 'curr' :
                        item === next ? 'next' :
                        item === prev ? 'prev' :
                        'hidden'
                    }
                />
            ))}
        </Div>
    )
}