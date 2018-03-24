import React from "react";
import * as BABYLON from 'babylonjs';

import InputController from "./InputController";

import quadrant from '../models/quadrant.babylon';
import logitech from '../models/logitech.babylon';

export default class BabylonRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joystick: {
                x: 0.0,
                y: 0.0
            },
            inputController: new InputController()
        }
    }

    loadAssets(scene) {
        var assetsManager = new BABYLON.AssetsManager(scene);

        var logitechTask = assetsManager.addMeshTask('logitech task', 'Base', '', logitech);
        logitechTask.onSuccess = (task) => {
            this.setState({
                meshLogitech3DPro: task.loadedMeshes
            })
            
            task.loadedMeshes.forEach((mesh) => {
                if (mesh.name === 'Stick') {
                    this.setState({logitechStick: mesh});
                }
            })
        };

        var quadrantTask = assetsManager.addMeshTask('quadrant task', 'Base', '', quadrant);
        quadrantTask.onSuccess = (task) => {
            this.setState({
                meshSaitekThrottleQuadrant: task.loadedMeshes
            })
        };

        assetsManager.load();
    }

    componentDidMount() {

        var canvas = this.refs.canvas;
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);

        this.loadAssets(scene);

        scene.executeWhenReady(() => {
            console.log("scene ready")
            scene.createDefaultCameraOrLight(true, true, true);
            scene.activeCamera.setPosition(new BABYLON.Vector3(0, 45, 70));
            scene.clearColor = new BABYLON.Color3(0, 1, 0);

            var rootIndex = 0;

            scene.meshes.forEach((mesh) => {
                if (!mesh.parent) {
                    mesh.translate(BABYLON.Axis.X, 20*rootIndex, BABYLON.Space.WORLD);
                    rootIndex = rootIndex + 1;
                }
            });
  
            engine.runRenderLoop(() => { scene.render(); });
        });

        scene.beforeRender = () => {
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