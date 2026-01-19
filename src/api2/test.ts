import { serverTime, uuid } from "fluxio";
import { Api } from "./Api";

(async () => {
    const api = new Api();
    console.debug('time', Date.now(), serverTime());

    const email = `test${Date.now()}@gmail.com`;
    const password = 'azerty1234';

    const register = await api.register(email, password);
    console.debug('register', register);

    const login = await api.login(email, password);
    console.debug('login', login);

    const user = await api.me();
    console.debug('user', user);

    const group = await api.groups.create({ key: uuid(), name: 'TEST', config: {} });
    console.debug('group', group);
    
    api.groups.select(group);

    const media = await api.medias.create({
        type: 'content',
        data: {},
        name: 'test'+uuid(),
        groupId: group.id,
        userId: user.id,
    });
    console.debug('media', media);

    const updatedMedia = await api.medias.update(media.id, {
        data: {
            deps: ['a', 'b']
        },
    });
    console.debug('updatedMedia', updatedMedia);

    const removedMedia = await api.medias.remove(media.id);
    console.debug('removedMedia', removedMedia);

    const logout = await api.logout();
    console.debug('logout', logout);
})();
