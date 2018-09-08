import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Modal from 'react-modal';
import Root from './containers/Root/Root.container';
import './resources/styles/global.css';

Modal.setAppElement('#root');

function init() {
    render(
        <Root />,
        document.getElementById('root')
    );
}

init();