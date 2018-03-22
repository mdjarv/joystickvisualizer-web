import React from "react";
import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
import MTLLoader from 'three-mtl-loader';
import quadrant from '../models/quadrant.obj';

class DeviceRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.session = {
            chroma: '#CC9900'
        }
        //console.log(quadrant);
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
    }
    
    componentDidMount() {
        const width = this.mount.clientWidth
        const height = this.mount.clientHeight
        
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )



        const renderer = new THREE.WebGLRenderer({ antialias: true })
        //const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        //const cube = new THREE.Mesh(geometry, material)
        


/*
        const loader = new THREE.JSONLoader();
        const loaded = loader.parse(quadrant);
        console.log(loaded);
        var model = new THREE.Mesh( loaded.geometry, loaded.materials[0]);
        model.scale.x = 0.1
        model.scale.y = 0.1
        model.scale.z = 0.1
        console.log(model);
        scene.add(model);*/
        
        OBJLoader(THREE);
        const loader = new THREE.OBJLoader();
        var model;
        loader.load(quadrant, (object) => {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh ) {
                    //child.material.map = texture;
                    scene.add(child)
                }
            });
            //scene.add(object)
        });
        /*
        loader.load(quadrant, (object) => {
            console.log(object);

            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.scale.x = 0.1
                    child.scale.y = 0.1
                    child.scale.z = 0.1
                    scene.add(child);
                }
            } );
            object.scale.x = 0.1
            object.scale.y = 0.1
            object.scale.z = 0.1
            
            scene.add( object );
            model = object;
        });
    */
        var ambientLight = new THREE.AmbientLight( 0xcccccc );
        scene.add( ambientLight );

        var pointLight = new THREE.PointLight( 0xff4400, 5, 30 );
        pointLight.position.set( 5, 0, 0 );
        scene.add( pointLight );

        camera.position.z = 5
        camera.position.y = 1
        renderer.setClearColor(this.session.chroma)
        renderer.setSize(width, height)
        renderer.shadowMap.enabled = true;
        
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.material = material
        this.model = model
        
        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }
    
    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
    
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    
    stop() {
        cancelAnimationFrame(this.frameId)
    }
    
    animate() {
        if (this.model) {
            this.model.rotation.x += 0.01
            this.model.rotation.y += 0.01
        }
        
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }
    
    renderScene() {
        //this.camera.lookAt(this.model.position);
        this.renderer.render(this.scene, this.camera)
    }
    
    render() {
        return (
            <div
                style={{ width: '400px', height: '400px' }}
                ref={(mount) => { this.mount = mount }}
            />
        );
    }
}

export default DeviceRenderer;