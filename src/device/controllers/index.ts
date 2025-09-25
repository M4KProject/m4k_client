import { apiError$, sync } from '@common/api';
import { showError } from '@common/components';

export const contentCtrl = sync('contents');
export const deviceCtrl = sync('devices');
export const groupCtrl = sync('groups');
export const jobCtrl = sync('jobs');
export const mediaCtrl = sync('medias');
export const memberCtrl = sync('members');
export const userCtrl = sync('users');

apiError$.on(showError);
