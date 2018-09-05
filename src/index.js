import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './containers/root/root.container';
import './resources/styles/global.css';

const init = () => {
    render(
        <Root/>,
        document.getElementById('root')
    );
};

init();