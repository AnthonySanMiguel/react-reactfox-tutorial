import React, {Suspense, useRef} from "react";
import {Canvas, useLoader, useFrame, extend, useThree} from "react-three-fiber";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import "./styles.css";

// Allows use of OrbitControls with React-Three-Fiber
extend({OrbitControls});

// While model 'ArWing' is loading, a placeholder white sphere will be rendered in its place
function Loading () {
    return (
        <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <sphereGeometry attach="geometry" args={[1, 16, 16]}/>
            <meshStandardMaterial
                attach="material"
                color="white"
                transparent
                opacity={0.6}
                roughness={1}
                metalness={0}
            />
        </mesh>
    );
}

function ArWing(){
    const group = useRef();
    const { nodes } = useLoader(GLTFLoader, "models/arwing.glb"); // Loads model in 'glb' format
    useFrame(() => {
        group.current.rotation.y += 0.004; // Rotates model by specified increments
    });
    return (
        <group ref={group}>
            <mesh visible geometry={nodes.Default.geometry}> {/* May need to change "Default" to model name if custom model used */}
                <meshStandardMaterial
                    attach="material"
                    color="white"
                    roughness={0.3}
                    metalness={0.3}
                />
            </mesh>
        </group>
    );
}

// Used to get a reference for the Three.js Camera and canvas.
// To add OrbitControls we need a reference to the Three.js camera and canvas element when creating the component.
// To get these react-three-fiber provides the useThree hook, this is an escape hatch into getting access to core Three.js elements.
    const CameraControls = () => {
    const {
        camera,
        gl: {domElement},
    } = useThree();

    // Ref to the controls, so that we can update them on every frame using useFrame
    // In order for our orbit controls to be updated on every animation frame, we need to call controls.current.update() in the render loop.
        // Any time you need some code to run in the render loop in react-three-fiber we use the useFrame hook.
        // In this case, since we want to call a method on OrbitControls, we also need to add a ref, and then we can call the update method.
    const controls = useRef();
    useFrame((state) => controls.current.update());
    // Create the OrbitControls using orbitControls JSX element, which has been made available to us from earlier when we called extend().
    return <orbitControls
            ref={controls}
            args={[camera, domElement]}
            enableZoom={false} // Disables zoom on mouse scroll
            // Next 4 lines will ensure camera stays locked behind model (can't scroll around)
            maxAzimuthAngle={Math.PI / 4}
            maxPolarAngle={Math.PI}
            minAzimuthAngle={-Math.PI / 4}
            minPolarAngle={0}
            />;
};

export default function App(){
    return(
        <Canvas style={{background: "#171717"}}> {/* Sets background color of canvas */}
            <directionalLight intensity={0.5} />
            <CameraControls />
            <Suspense fallback={<Loading />}>
                <ArWing />
            </Suspense>
        </Canvas>
    );
}
