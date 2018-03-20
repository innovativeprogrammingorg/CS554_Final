import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Main from './components/Main/component.js';

ReactDOM.render(<Main viewType={"SETTINGS"}/>, document.getElementById('root'));
registerServiceWorker();
