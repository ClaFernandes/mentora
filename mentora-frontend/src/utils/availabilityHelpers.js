function timeToMinutes(time) {
    const [hour, min] = time.split(":").map(Number);
    return hour * 60 + min;
}

export function blocksOverlap(blockA, blockB) {
    const startA = timeToMinutes(blockA.startTime);
    const endA = timeToMinutes(blockA.endTime);
    const startB = timeToMinutes(blockB.startTime);
    const endB = timeToMinutes(blockB.endTime);

    return startA < endB && endA > startB;
}