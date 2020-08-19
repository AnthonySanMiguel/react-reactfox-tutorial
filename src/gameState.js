import {atom} from "recoil";

// "Atom" to store position of ship
export const shipPositionState = atom({
    key: "shipPosition", // // Unique ID (with respect to other atoms/selectors)
    default: {position:{}, rotation: {}} // Default value (aka initial value)
})

// "Atom" to store position(s) of enemies
export const enemyPositionState = atom({
    key: "enemyPosition",
    default: [
        // X = enemy placement on ground;
        // y = above or below ground level;
        // z = spawn distance away from ship

        // Math.floor(Math.random() * 50) + 5 = Random number between 5 and 50
        // For negative numbers, larger number goes on the right side (see below)

        // REMINDER: Try to give enemies with widest 'X' variables more 'Z' spawn distance

        {x: Math.floor(Math.random() * 50) + 5, y: -25, z: Math.floor(Math.random() * 5) - 300},
        {x: Math.floor(Math.random() * 200) + 5, y: -25, z: Math.floor(Math.random() * 5) - 400},
        {x: Math.floor(Math.random() * 200) + 5, y: -25, z: Math.floor(Math.random() * 5) - 600},
        {x: Math.floor(Math.random() * 5) - 50, y: -25, z: Math.floor(Math.random() * 5) - 400},
        {x: Math.floor(Math.random() * 5) - 200, y: -25, z: Math.floor(Math.random() * 5) - 600},
        {x: Math.floor(Math.random() * 5) - 200, y: -25, z: Math.floor(Math.random() * 5) - 600}
    ],
});

// "Atom" to store position(s) of mountain range
let yCoordinate = -20;
let zCoordinate = -775;

export const mountainPositionState = atom({
    key: "mountainPosition",
    default: [
        // {x: 0, y: yCoordinate, z: zCoordinate},
        {x: 30, y: yCoordinate, z: zCoordinate},
        {x: 60, y: yCoordinate, z: zCoordinate},
        {x: 90, y: yCoordinate, z: zCoordinate},
        {x: 120, y: yCoordinate, z: zCoordinate},
        {x: 150, y: yCoordinate, z: zCoordinate},
        {x: 180, y: yCoordinate, z: zCoordinate},
        {x: 210, y: yCoordinate, z: zCoordinate},
        {x: 240, y: yCoordinate, z: zCoordinate},
        {x: 270, y: yCoordinate, z: zCoordinate},
        {x: 300, y: yCoordinate, z: zCoordinate},
        {x: 330, y: yCoordinate, z: zCoordinate},
        {x: 360, y: yCoordinate, z: zCoordinate},
        {x: 390, y: yCoordinate, z: zCoordinate},
        {x: 420, y: yCoordinate, z: zCoordinate},
        {x: 450, y: yCoordinate, z: zCoordinate},
        {x: 480, y: yCoordinate, z: zCoordinate},
        {x: 510, y: yCoordinate, z: zCoordinate},
        {x: 540, y: yCoordinate, z: zCoordinate},
        {x: 570, y: yCoordinate, z: zCoordinate},
        {x: 600, y: yCoordinate, z: zCoordinate},
        {x: 630, y: yCoordinate, z: zCoordinate},

        {x: -30, y: yCoordinate, z: zCoordinate},
        {x: -60, y: yCoordinate, z: zCoordinate},
        {x: -90, y: yCoordinate, z: zCoordinate},
        {x: -120, y: yCoordinate, z: zCoordinate},
        {x: -150, y: yCoordinate, z: zCoordinate},
        {x: -180, y: yCoordinate, z: zCoordinate},
        {x: -210, y: yCoordinate, z: zCoordinate},
        {x: -240, y: yCoordinate, z: zCoordinate},
        {x: -270, y: yCoordinate, z: zCoordinate},
        {x: -300, y: yCoordinate, z: zCoordinate},
        {x: -330, y: yCoordinate, z: zCoordinate},
        {x: -360, y: yCoordinate, z: zCoordinate},
        {x: -390, y: yCoordinate, z: zCoordinate},
        {x: -420, y: yCoordinate, z: zCoordinate},
        {x: -450, y: yCoordinate, z: zCoordinate},
        {x: -480, y: yCoordinate, z: zCoordinate},
        {x: -510, y: yCoordinate, z: zCoordinate},
        {x: -540, y: yCoordinate, z: zCoordinate},
        {x: -570, y: yCoordinate, z: zCoordinate},
        {x: -600, y: yCoordinate, z: zCoordinate},
        {x: -630, y: yCoordinate, z: zCoordinate},
    ],
});

// "Atom" to store position of fired lasers
export const laserPositionState = atom({
    key: "laserPositions",
    default: [], // Default value is empty since game starts with no lasers being fired
});

// "Atom" to store player score
export const scoreState = atom({
    key: "score",
    default: 0, // Default score starts at 0 and builds from there
});
