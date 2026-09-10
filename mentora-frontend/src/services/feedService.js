import { apiRequest } from "./api";

export async function getFeed(token, cursor, limit) {
    const endpoint = cursor
        ? `/feed?cursor=${cursor}&limit=${limit}`
        : `/feed?limit=${limit}`;

    return apiRequest(endpoint, {
        method: "GET",
        token,
    });
}

export async function createPost(token, postData) {
    return apiRequest("/posts", {
        method: "POST",
        token,
        body: postData,
    });
}

export async function editPost(token, postId, content) {
    return apiRequest(`/posts/${postId}`, {
        method: "PUT",
        token,
        body: { content },
    });
}

export async function deletePost(token, postId) {
    return apiRequest(`/posts/${postId}`, {
        method: "DELETE",
        token,
    });
}

export async function likePost(token, postId) {
    return apiRequest(`/posts/${postId}/like`, {
        method: "POST",
        token
    });
}

export async function reportPost(token, postId) {
    return apiRequest(`/posts/${postId}/report`, {
        method: "POST",
        token
    });
}

export async function createComment(token, postId, text) {
    return apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        token,
        body: { text },
    });
}

export async function editComment(token, commentId, text) {
    return apiRequest(`/comments/${commentId}`, {
        method: "PUT",
        token,
        body: { text },
    });
}

export async function deleteComment(token, commentId) {
    return apiRequest(`/comments/${commentId}`, {
        method: "DELETE",
        token,
    });
}

export async function likeComment(token, commentId) {
    return apiRequest(`/comments/${commentId}/like`, {
        method: "POST",
        token
    });
}

export async function reportComment(token, commentId) {
    return apiRequest(`/comments/${commentId}/report`, {
        method: "POST",
        token
    });
}

export async function getComments(token, postId) {
    return apiRequest(`/posts/${postId}/comments`, {
        method: "GET",
        token
    });
}


