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

export async function getPostById(token, postId) {
  return apiRequest(`/posts/${postId}`, {
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

export async function editPost(token, postId, updates) {
  return apiRequest(`/posts/${postId}`, {
    method: "PUT",
    token,
    body: updates,
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
    token,
  });
}

export async function reportPost(token, postId) {
  return apiRequest(`/posts/${postId}/report`, {
    method: "POST",
    token,
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
    token,
  });
}

export async function reportComment(token, commentId) {
  return apiRequest(`/comments/${commentId}/report`, {
    method: "POST",
    token,
  });
}

export async function getComments(token, postId) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: "GET",
    token,
  });
}

export async function getPostsByMentor(mentorId, cursor, limit) {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit);

  return apiRequest(`/mentors/${mentorId}/posts?${params.toString()}`, {
    method: "GET",
  });
}
