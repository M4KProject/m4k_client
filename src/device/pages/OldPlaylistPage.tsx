import { m4k } from '../m4k'
import { setCss } from '@common/helpers/html'
import { stringify } from '@common/helpers/json'
import {usePromise} from '@common/hooks/usePromise'

setCss('m4kPlaylistPage', {
    '&': {
        position: 'absolute',
        inset: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
    },
})

const PlaylistPage = () => {
    const [playlist] = usePromise(() => m4k.get('playlist'), [])

    return (
        <div className="m4kPlaylistPage">
            <pre>
                {stringify(playlist, null, 2)}
            </pre>
        </div>
    )
}

export default PlaylistPage
