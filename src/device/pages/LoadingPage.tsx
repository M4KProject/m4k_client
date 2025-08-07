import { Css, flexCenter } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Loading, Page } from '@common/components';

const css: Css = {
    '&': {
        ...flexCenter(),
    },
};

export const LoadingPage = () => {
    const c = useCss('LoadingPage', css);
    return (
        <Page cls={c}>
            <Loading />
        </Page>
    );
}