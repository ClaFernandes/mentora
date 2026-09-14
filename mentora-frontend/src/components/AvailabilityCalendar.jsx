import { useState } from "react";
import { DAYS_OF_WEEK, SESSION_DURATION_MINUTES } from "../utils/constants";
import { getSlotsForDay, blocksOverlap } from "../utils/availabilityHelpers";
import "./AvailabilityCalendar.css";

export default function AvailabilityCalendar({
    mode,
    availability,
    onAddBlock,
    onRemoveBlock,
    onSelectSlot
}) {
    const [selectedDay, setSelectedDay] = useState(null);
    const [newStartTime, setNewStartTime] = useState("");
    const [newEndTime, setNewEndTime] = useState("");
    const [addBlockError, setAddBlockError] = useState("");

    let daySlots = [];
    if (selectedDay !== null) {
        daySlots = getSlotsForDay(availability, selectedDay, SESSION_DURATION_MINUTES);
        daySlots.sort();
    }

    let dayBlocks = [];
    if (selectedDay !== null) {
        dayBlocks = availability
            .filter((block) => block.dayOfWeek === selectedDay)
            .sort((a, b) => {
                if (a.startTime < b.startTime) return -1;
                if (a.startTime > b.startTime) return 1;
                return 0;
            });
    }

    function handleRemoveBlock(availabilityId) {
        onRemoveBlock(availabilityId);
    }

    function handleAddBlock() {
        if (!newStartTime || !newEndTime) {
            return;
        }
        const newBlock = {
            dayOfWeek: selectedDay,
            startTime: newStartTime,
            endTime: newEndTime,
        };
        for (const block of dayBlocks) {
            if (blocksOverlap(newBlock, block)) {
                setAddBlockError("Este horário sobrepõe-se a um já existente.");
                return;
            }
        }
        setAddBlockError("");
        onAddBlock(newBlock);
        setNewStartTime("");
        setNewEndTime("");
    }

    return (
        <div className="availability-calendar">

            <div className="availability-days-row">
                {DAYS_OF_WEEK.map((day) => {
                    let buttonClass = "availability-day-btn";
                    if (selectedDay === day.value) {
                        buttonClass = "availability-day-btn availability-day-btn--active";
                    }

                    return (
                        <button
                            key={day.value}
                            type="button"
                            className={buttonClass}
                            onClick={() => setSelectedDay(day.value)}
                        >
                            {day.label}
                        </button>
                    );
                })}
            </div>

            {selectedDay !== null && (
                <div className="availability-day-detail">

                    {mode === "edit" ? (
                        // Modo mentor - edit
                        <div className="availability-blocks-list">

                            {dayBlocks.map((block) => (
                                <div key={block._id} className="availability-block-item">
                                    <span>
                                        {block.startTime} - {block.endTime}
                                    </span>
                                    <button
                                        type="button"
                                        className="availability-remove-btn"
                                        onClick={() => handleRemoveBlock(block._id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}

                            <div className="availability-add-block-form">
                                <input
                                    type="time"
                                    value={newStartTime}
                                    onChange={(e) => setNewStartTime(e.target.value)}
                                />
                                <span>até</span>
                                <input
                                    type="time"
                                    value={newEndTime}
                                    onChange={(e) => setNewEndTime(e.target.value)}
                                />

                                {addBlockError && (
                                    <p className="availability-add-block-error">{addBlockError}</p>
                                )}

                                <button type="button" onClick={handleAddBlock}>
                                    Adicionar
                                </button>
                            </div>
                        </div>

                    ) : (
                        // Mode mentee - select
                        <div className="availability-slots-grid">
                            {daySlots.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    className="availability-slot-btn"
                                    onClick={() => onSelectSlot({ dayOfWeek: selectedDay, time: slot })}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}