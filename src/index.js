import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import StyledBase from './components/StyledBase';
import JoystickVisualizer from "./components/JoystickVisualizer";

ReactDOM.render(
    <Router>
        <StyledBase>
            <div>
                <Route exact path="/" component={JoystickVisualizer} />
            </div>
        </StyledBase>
    </Router>
    , document.getElementById('root')
);
