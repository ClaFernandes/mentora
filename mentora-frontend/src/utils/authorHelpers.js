import {
    MOCK_MENTORS,
    MOCK_MENTOR_USER,
    MOCK_MENTEES,
    MOCK_MENTEE_USER,
} from "../mocks/mockData";

export function findAuthorById(id) {
    const mentor = MOCK_MENTORS.find((m) => m.id === id);
    if (mentor) {
        return { ...mentor, role: "mentor" };
    }
    if (MOCK_MENTOR_USER.id === id) {
        return MOCK_MENTOR_USER;
    }

    const mentee = MOCK_MENTEES.find((m) => m.id === id);
    if (mentee) {
        return { ...mentee, role: "mentee" };
    }

    if (MOCK_MENTEE_USER.id === id) {
        return MOCK_MENTEE_USER;
    }

    return null;
}