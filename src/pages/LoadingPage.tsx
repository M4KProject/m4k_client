import { Css, flexCenter } from '@common/helpers';
import { useCss } from '@common/hooks';
import { Div, Loading } from '@common/components';

const css: Css = {
    '&': {
        ...flexCenter(),
    },
};

export const LoadingPage = () => {
    const c = useCss('LoadingPage', css);
    return (
        <Div cls={c}>
            <Loading />
        </Div>
    );
}