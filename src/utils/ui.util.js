import {animateScroll as scroll} from 'react-scroll';

export const handleScroll = (target, callback) => {
    if (!target && target !== 0) {
        return;
    }

    if (isNaN(target)) {
        const Component = target && target.current;
        const ComponentContainer = Component && Component.componentContainer && Component.componentContainer.current;
        ComponentContainer && scroll.scrollTo(ComponentContainer.offsetTop);
    } else {
        scroll.scrollTo(target);
    }

    callback && callback();
};