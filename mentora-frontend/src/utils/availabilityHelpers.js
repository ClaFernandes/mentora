export function generateSlotsForRange({ startTime, endTime }, durationMin) {
    if (!startTime || !endTime || !durationMin) return [];

    const slots = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    let currentMin = startTotalMin;

    while (currentMin + durationMin <= endTotalMin) {
        const h = Math.floor(currentMin / 60)
            .toString()
            .padStart(2, "0");
        const m = (currentMin % 60).toString().padStart(2, "0");
        slots.push(`${h}:${m}`);
        currentMin += durationMin;
    }

    return slots;
}

export function getSlotsForDay(availability, dayOfWeek, durationMin) {
    const result = [];

    for (const range of availability) {
        if (range.dayOfWeek === dayOfWeek) {
            const slotsDoBloco = generateSlotsForRange(range, durationMin);

            for (const slot of slotsDoBloco) {
                result.push(slot);
            }
        }
    }

    return result;
}

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