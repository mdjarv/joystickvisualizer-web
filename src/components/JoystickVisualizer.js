import React from 'react';
import BabylonRenderer from './BabylonRenderer';
import InputController from './InputController';

export default class JoystickVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputController: new InputController()
        }
    }
    
    render() {
        return (
            <div>
                <h1>Joystick Visualizer</h1>
                <BabylonRenderer />
            </div>
        );
    }
}
