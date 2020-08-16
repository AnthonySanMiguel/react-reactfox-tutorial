import React, {Suspense, useRef} from "react";
import {Canvas, useLoader, useFrame, extend, useThree} from "react-three-fiber";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {TextureLoader} from "three";
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

// The player's ship model.
function ArWing(){
    // On each frame, check the cursor position and move the ship to point in the correct direction.
    const [shipPosition, setShipPosition] = useState();

    const ship = useRef();
    useFrame(({mouse}) => {
        setShipPosition({
            position: {x:mouse.x * 6, y:mouse.y * 2},
            rotation: {z: -mouse.x * 0.5, x: -mouse.x * 0.5, y: -mouse.y * 0.2},
        });
    });
    // Update the ship's position from the updated state to keep it pointing towards the center of the screen and create a cool rolling effect as the ship moves from side to side.
    useFrame(() => {
       ship.current.rotation.z = shipPosition.rotation.z;
       ship.current.rotation.y = shipPosition.rotation.y;
       ship.current.rotation.x = shipPosition.rotation.x;
       ship.current.position.y = shipPosition.position.y;
       ship.current.position.x = shipPosition.position.x;
    });
    const { nodes } = useLoader(GLTFLoader, "models/arwing.glb"); // Loads model in 'glb' format

    return (
        <group ref={ship}>
            <mesh visible geometry={nodes.Default.geometry}> {/* May need to change "Default" to model name if custom model used */}
                <meshStandardMaterial
                    attach="material"
                    color="white"
                    roughness={1}
                    metalness={0}
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

const GROUND_HEIGHT = -50;

// To animate an object in React Three Fiber:
    // create a ref attached to the mesh
    // add a useFrame hook (inside of which you can access the terrain ref)
    // and set the position z coordinate to be increased on each frame. (This will move the terrain .4 units closer to the camera on each frame.)

// A Ground plane that moves relative to the player. The player stays at 0,0
    function Terrain(){
        const terrain = useRef();

        useFrame(() => {
            terrain.current.position.z += 0.4;
        });
        return (
            <mesh
                visible
                position={[0, GROUND_HEIGHT, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                ref={terrain}
            >
                <planeBufferGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
                <meshStandardMaterial
                    attach="material"
                    color="white"
                    roughness={1}
                    metalness={0}
                    wireframe
                />
            </mesh>
        );
    }

// Draws two sprites in front of the ship, indicating the direction of fire.
// Uses a TextureLoader to load transparent PNG, and sprite to render on a 2D plane facing the camera.
    function Target() {
        // Create refs for the two sprites we will create.
        const rearTarget = useRef();
        const frontTarget = useRef();

        const loader = new TextureLoader();
        // A png with transparency to use as the target sprite.
        const texture = loader.load("target.png");

// Update the position of both sprites based on the mouse x and y position. The front target has a larger scalar.
    // Its movement in both axis is exaggerated since its farther in front.
    // The end result should be the appearance that the two targets are aligned with the ship in the direction of laser fire.
    useFrame(({mouse}) => {
        rearTarget.current.position.y = -mouse.y * 10;
        rearTarget.current.position.x = -mouse.x * 30;

        frontTarget.current.position.y = -mouse.y * 20;
        frontTarget.current.position.x = -mouse.x * 60;
    });

// Return a group containing two sprites.
    // One positioned eight units in front of the ship, and the other 16 in front.
// We give the spriteMaterial a map prop with the loaded sprite texture as a value.
    return (
        <group>
            <sprite position={[0, 0, -8]} ref={rearTarget}>
                <spriteMaterial attach="material" map={texture} />
            </sprite>
            <sprite position={[0, 0, -16]} ref={frontTarget}>
                <spriteMaterial attach="material" map={texture} />
            </sprite>
        </group>
    );
}

export default function App(){
    return(
        <Canvas style={{background: "#171717"}}> {/* Sets background color of canvas */}
            <directionalLight intensity={1} />
            <ambientLight intensity={1} />
            <Suspense fallback={<Loading />}>
                <ArWing />
            </Suspense>
            <Terrain />
        </Canvas>
    );
}
