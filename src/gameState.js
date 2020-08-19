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
        {x: -80, y: -15, z: -240}, // X = enemy placement on ground; y = above or below ground level; z = spawn distance away from ship
        {x: 60, y: -15, z: -265},
        {x: 110, y: -15, z: -300},
        {x: -200, y: -15, z: -473},
        {x: -40, y: -15, z: -511},
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
