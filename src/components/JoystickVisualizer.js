import React from 'react';
import BabylonRenderer from './BabylonRenderer';

export default class JoystickVisualizer extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
            <h1>Joystick Visualizer</h1>
            <BabylonRenderer/>
            </div>
        );
    }
}
