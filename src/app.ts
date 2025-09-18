import { global } from '@common/utils';

import * as utils from '@common/utils';
import * as ui from '@common/ui';
import * as auth from '@common/api/auth';
import * as call from '@common/api/call';
import * as job from '@common/api/job';
import * as medias from '@common/api/medias';
import * as messages from '@common/api/messages';
import * as serverTime from '@common/api/serverTime';
import * as collContents from '@common/api/collContents';
import * as collDevices from '@common/api/collDevices';
import * as collGroups from '@common/api/collGroups';
import * as collJobs from '@common/api/collJobs';
import * as collMedias from '@common/api/collMedias';
import * as collMembers from '@common/api/collMembers';
import * as collUsers from '@common/api/collUsers';

export const app = global._app || (global._app = {});

Object.assign(app,
    utils,
    ui,
    auth,
    call,
    job,
    medias,
    messages,
    serverTime,
    collContents,
    collDevices,
    collGroups,
    collJobs,
    collMedias,
    collMembers,
    collUsers,
);
