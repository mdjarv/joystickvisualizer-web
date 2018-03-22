import React from "react";
import * as BABYLON from 'babylonjs';

import quadrant from '../models/quadrant.babylon';
import logitech from '../models/logitech.babylon';

export default class BabylonRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joystick: {
                x: 0.0,
                y: 0.0
            }
        }
    }
    
    componentDidMount() {

        var canvas = this.refs.canvas;
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);

        var assetsManager = new BABYLON.AssetsManager(scene);

        var logitechTask = assetsManager.addMeshTask('logitech task', 'Base', '', logitech);
        logitechTask.onSuccess = (task) => {
//            console.log('----')
//            console.log('Loaded Logitech')
            task.loadedMeshes.forEach((mesh) => {
//                console.log(' * ' + mesh.name);
                if (mesh.name === 'Stick') {
                    this.setState({logitechStick: mesh});
                }
            })
        };

        var quadrantTask = assetsManager.addMeshTask('quadrant task', 'Base', '', quadrant);
        quadrantTask.onSuccess = (task) => {
//            console.log('----')
//            console.log('Loaded quadrant')
            task.loadedMeshes.forEach((mesh) => {
//                console.log(' * ' + mesh.name);
            })
        };

        assetsManager.load();

        scene.executeWhenReady(() => {
            console.log("scene ready")
            scene.createDefaultCameraOrLight(true, true, true);
            scene.activeCamera.setPosition(new BABYLON.Vector3(0, 45, 70));
            scene.clearColor = new BABYLON.Color3(0, 1, 0);

            scene.meshes.forEach((base) => {
                if (base.name === 'Base') {
                    base.getChildMeshes(true).forEach((c)=>{
                        if(c.name === 'Stick') {
                            //this.setState({gimbal: c})
                            base.translate(BABYLON.Axis.X, 20, BABYLON.Space.WORLD);
                            //c.rotate(BABYLON.Axis.X, Math.PI / 4, BABYLON.Space.LOCAL);
                        }
                    })
                }
            });
           
            engine.runRenderLoop(() => { scene.render(); });
        });
        scene.afterRender = () => {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            if (!gamepads) {
              return;
            }

            for (var i = 0; i < gamepads.length; i++) {
                var gp = gamepads[i];

                if(gp && gp.id === 'Joystick - HOTAS Warthog (Vendor: 044f Product: 0402)') {
                    if(this.state.logitechStick) {
                        this.state.logitechStick.rotation.z = (gp.axes[0] * 25) * 0.01745329252;
                        this.state.logitechStick.rotation.x = (gp.axes[1] * 25) * 0.01745329252;
                    } 
                }
            };


        }
    }

    render() {
        return (
            <canvas
            style={{
                width: '600px',
                height: '600px',
                touchAction: 'none'
            }}
            ref={"canvas"}
            />
        );
    }
}