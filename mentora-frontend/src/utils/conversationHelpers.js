import { MOCK_CONVERSATIONS } from "../mocks/mockData.js";

export function findOrCreateConversation(mentorId, menteeId) {
    for (const conv of MOCK_CONVERSATIONS) {
        if (conv.mentorId === mentorId && conv.menteeId === menteeId) {
            return conv;
        }
    }

    const newConversation = {
        id: `conv-${Date.now()}`,
        mentorId: mentorId,
        menteeId: menteeId,
        messages: [],
    };

    MOCK_CONVERSATIONS.push(newConversation);
    return newConversation;
}