import { apiError$, collSync } from "@common/api";
import { showError } from "@common/components";

export const contentCtrl = collSync('contents');
export const deviceCtrl = collSync('devices');
export const groupCtrl = collSync('groups');
export const jobCtrl = collSync('jobs');
export const mediaCtrl = collSync('medias');
export const memberCtrl = collSync('members');
export const userCtrl = collSync('users');

apiError$.on(error => {
    if (!error) return;
    console.error('apiError', error);
    showError(error);
});