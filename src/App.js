import React, {Suspense, useRef} from "react";
import {Canvas, useLoader, useFrame} from "react-three-fiber";
// import {extend, useThree} from "react-three-fiber";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RecoilRoot, useRecoilState, useRecoilValue} from "recoil";
import {TextureLoader} from "three";
import {shipPositionState, laserPositionState, enemyPositionState, mountainPositionState, scoreState} from "./gameState";
import "./styles.css";

// Game Settings
const LASER_RANGE = 400; // Make sure to allow enough range so farthest enemy (highest enemyPosition "Z" coordinate in GameState.js file) doesn't 'fizzle' out before hitting
const LASER_Z_VELOCITY = 1;
const ENEMY_SPEED = 0.3; // How fast enemies advance towards you
const GROUND_HEIGHT = -50;

// // Allows use of OrbitControls with React-Three-Fiber
// extend({OrbitControls});

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
    const [shipPosition, setShipPosition] = useRecoilState(shipPositionState); // Ship position is being stored in Recoil, and we will be able to access it from other components.

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

    const {nodes} = useLoader(GLTFLoader, "models/arwing.glb"); // Loads model in 'glb' format

    return (
        <group ref={ship}>
            <mesh visible geometry={nodes.Default.geometry}> {/* May need to change "Default" to model name if custom model used */}
                <meshStandardMaterial
                    attach="material"
                    color="blue"
                />
            </mesh>
        </group>
    );
}

// // Used to get a reference for the Three.js Camera and canvas.
// // To add OrbitControls we need a reference to the Three.js camera and canvas element when creating the component.
// // To get these react-three-fiber provides the useThree hook, this is an escape hatch into getting access to core Three.js elements.
//     const CameraControls = () => {
//     const {
//         camera,
//         gl: {domElement},
//     } = useThree();
//
//     // Ref to the controls, so that we can update them on every frame using useFrame
//     // In order for our orbit controls to be updated on every animation frame, we need to call controls.current.update() in the render loop.
//         // Any time you need some code to run in the render loop in react-three-fiber we use the useFrame hook.
//         // In this case, since we want to call a method on OrbitControls, we also need to add a ref, and then we can call the update method.
//     const controls = useRef();
//     useFrame((state) => controls.current.update());
//     // Create the OrbitControls using orbitControls JSX element, which has been made available to us from earlier when we called extend().
//     return <orbitControls
//             ref={controls}
//             args={[camera, domElement]}
//             enableZoom={false} // Disables zoom on mouse scroll
//             // Next 4 lines will ensure camera stays locked behind model (can't scroll around)
//             maxAzimuthAngle={Math.PI / 4}
//             maxPolarAngle={Math.PI}
//             minAzimuthAngle={-Math.PI / 4}
//             minPolarAngle={0}
//             />;
// };

// To animate an object in React Three Fiber:
    // create a ref attached to the mesh
    // add a useFrame hook (inside of which you can access the terrain ref)
    // and set the position z coordinate to be increased on each frame. (This will move the terrain .4 units closer to the camera on each frame.)

// A Ground plane that moves relative to the player. The player stays at 0,0
const grassTextureLoader = new TextureLoader();
const grassTexture = grassTextureLoader.load("grass.jpg");

function Terrain(){
        const terrain = useRef();

        useFrame(() => {
            terrain.current.position.z += 0.4; // How fast terrain plane scrolls by/under objects
        });
        // Returns a mesh at GROUND_HEIGHT below the player. Scaled to 5000, 5000 with 128 segments.
        // X Rotation is -Math.PI / 2 which is 90 degrees in radians.
        return (
            <mesh
                visible
                position={[0, GROUND_HEIGHT, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                ref={terrain}
            >
                <planeBufferGeometry attach="geometry" args={[3000, 2000, 1, 25]} />
                                                   {/* Arg 1 = panoramic view;
                                                       Arg 2 = terrain distance before ending;
                                                       Arg 3 = number of vertical terrain rows;
                                                       Arg 4 = number of horizontal terrain rows;*/}
                <meshStandardMaterial
                    attach="material"
                    color="#254c00"
                    map={grassTexture}
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
        const targetTexture = loader.load("target.png");

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
                <spriteMaterial attach="material" map={targetTexture} />
            </sprite>
            <sprite position={[0, 0, -16]} ref={frontTarget}>
                <spriteMaterial attach="material" map={targetTexture} />
            </sprite>
        </group>
    );
}

// Draws all of the lasers existing in state.
    // UseRecoilValue hook along with the laserPositionState atom to get the array of lasers from the state. Then in the return value, map over the array of lasers returning a cube mesh for each one.
const laserTextureLoader = new TextureLoader();
const laserTexture = laserTextureLoader.load("laser.png");

function Lasers() {
    const lasers = useRecoilValue(laserPositionState);
    return (
        <group>
            {lasers.map((laser) => (
            <mesh position={[laser.x, laser.y, laser.z]} key={`${laser.id}`}>
            <sphereBufferGeometry attach="geometry" args={[.5, .5, .5]} />
                                             {/* Arg 1 = Width of projectile
                                                 Arg 2 = Height of projectile
                                                 Arg 3 = Length of projectile */}
            <meshStandardMaterial attach="material" emissive="#ff073a" map={laserTexture}/>
            </mesh>
            ))}
        </group>
    );
}

// An invisible clickable element in the front of the scene.
// Manages creating lasers with the correct initial velocity on click.
function LaserController() {
    const shipPosition = useRecoilValue(shipPositionState);
    const [lasers, setLasers] = useRecoilState(laserPositionState);
    return (
        <mesh
            position={[0, 0, -8]}
            onClick={() =>
                setLasers([
                    ...lasers,
                    {
                        id: Math.random(), // Gives each fired laser onClick its own unique ID for tracking (a random integer)
                        x: 0,
                        y: 0,
                        z: 0,
                        velocity: [
                            shipPosition.rotation.x * 6,
                            shipPosition.rotation.y * 5,
                        ],
                    },
                ])
            }
        >
            <planeBufferGeometry attach="geometry" args={[100, 100]} />
            <meshStandardMaterial
                attach="material"
                color="#ff0860"
                emissive="#ff0860"
                visible={false} // Hide impact plane for lasers (invisible field)
            />
        </mesh>
    );
}

// Manages drawing enemies that currently exist in state
const buildingTextureLoader = new TextureLoader();
const buildingTexture = buildingTextureLoader.load("building.jpg");

function Enemies() {
    const enemies = useRecoilValue(enemyPositionState);
    return (
        <group>
            {enemies.map(enemy => (
                <mesh position={[enemy.x, enemy.y, enemy.z]} key={`${enemy.x}`}>
                    {/*<cylinderBufferGeometry attach="geometry" args={[2, 18, 40]} />*/}
                    <boxBufferGeometry attach="geometry" args={[45, 20, 30]} />
                                                     {/* Arg 1 = Width of box structure
                                                         Arg 2 = Height of box structure
                                                         Arg 1 = Length of box structure */}
                    <meshStandardMaterial attach="material" color="#878787" map={buildingTexture}/>
                </mesh>
            ))}
        </group>
    );
}

// Manages drawing mountains that currently exist in state
const mountainTextureLoader = new TextureLoader();
const mountainTexture = mountainTextureLoader.load("mountain.jpg");

function Mountains() {
    const mountains = useRecoilValue(mountainPositionState);
    return (
        <group>
            {mountains.map(mountain => (
                <mesh position={[mountain.x,mountain.y, mountain.z]} key={`${mountain.x}`}>
                    <cylinderBufferGeometry attach="geometry" args={[2, 18, 40]} />
                                                     {/* Arg 1 = Width of cylinder structure
                                                         Arg 2 = Height of cylinder structure
                                                         Arg 1 = Length of cylinder structure */}
                    <meshStandardMaterial attach="material" color="#5c4033" map={mountainTexture}/>
                </mesh>
            ))}
        </group>
    );
}

// Main game loop code:
    // It powers the movement of all the lasers and enemies...
    // as well as controls hit detection and collisions.
// This component runs game logic on each frame draw to update game state.
function GameTimer() {
        const [enemies, setEnemies] = useRecoilState(enemyPositionState);
        const [mountains, setMountains] = useRecoilState(mountainPositionState);
        const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
        const [score, setScore] = useRecoilState(scoreState);

        useFrame(({mouse}) => {
            // Map through all of the enemies in state. Detect if each enemy is within one unit of a laser if they are set that place in the return array to true.
            // The result will be an array where each index is either a hit enemy or an missed enemy.
            const hitEnemies = enemies
            ? enemies.map(
                    (enemy) =>
                        lasers.filter(
                            (laser) =>
                                laser.z - enemy.z < 1 &&
                                laser.x - enemy.x < 1 &&
                                laser.y - enemy.y < 1
                        ).length > 0
                )
                : [];

            // Update the Score for each destroyed enemy
            if (hitEnemies.includes(true) && enemies.length > 0) {
            setScore(score + hitEnemies.filter((hit) => hit).length);
            console.log("Enemy structure destroyed!");
            }

            // Move all of the enemies. Remove enemies that have been destroyed, or that have passed the player (as indicated by being positioned greater than 0 on the z access).
            setEnemies(
                enemies
                    .map((enemy) => ({x: enemy.x, y: enemy.y, z: enemy.z + ENEMY_SPEED}))
                    .filter((enemy, idx) => !hitEnemies[idx] && enemy.z < 0)
            );

            setMountains(
                mountains
                    .map((mountain) => ({x: mountain.x, y: mountain.y, z: mountain.z + ENEMY_SPEED}))
            );

            // Move the Lasers and remove lasers at end of range or that have hit the ground.
            // The lasers reference their initial velocity and increase on the x and y access according to those values, to ensure they continue traveling in the initial direction they were fired. They always move forward a fixed position on the z access though we might tweak that later for gameplay reasons. Also, filter out any lasers that have hit the end of their range, or have hit the ground.setLaserPositions
                setLaserPositions(
                    lasers
                    .map((laser) =>({
                    id: laser.id,
                    x: laser.x + laser.velocity[0],
                    y: laser.y + laser.velocity[1],
                    z: laser.z - LASER_Z_VELOCITY,
                    velocity: laser.velocity,
        }))
                    .filter((laser) => laser.z > -LASER_RANGE && laser.y > GROUND_HEIGHT)
            );
        });
            return null;
}

export default function App() {
    return (
        <Canvas style={{background: "#171717"}}> {/* Sets background color of canvas */}
            <RecoilRoot> {/* To access Recoil values, you need to wrap your components in the RecoilRoot component. Only components under this provider will have access to the Recoil state. Usually you would put this at the very top of your component tree, but with React Three Fiber there is an issue putting it above the Canvas component. So we can put it just inside of our canvas. */}
                <directionalLight intensity={2}/> {/* Overhead 'spotlight' on all objects in view */}
                <ambientLight intensity={0.5}/> {/* Light emanating off of models */}
                <Suspense fallback={<Loading/>}>
                <ArWing/>
                </Suspense>
                <Target/>
                <Enemies />
                <Mountains />
                <Lasers/>
                <Terrain/>
                <LaserController />
                <GameTimer />
            </RecoilRoot>
        </Canvas>
    );
}
