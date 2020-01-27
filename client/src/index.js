/**
 * File: index.js
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 27.1.2020
 * License: none
 * Description: Application entry point.
 * 
 */

// import react
import React from 'react';
import ReactDOM from 'react-dom';

// import styles
import './css/index.scss';

// import main component
import App from './components/App';

// render main component into main container #root div defined in "public/index.html"
ReactDOM.render(<App />, document.getElementById('root'));