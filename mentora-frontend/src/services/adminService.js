import { apiRequest } from "./api";

export async function getAllMentors(token, status, page, limit) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  return apiRequest(`/admin/mentors?${params.toString()}`, {
    method: "GET",
    token,
  });
}

export async function getAllMentees(token, page, limit) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  return apiRequest(`/admin/mentees?${params.toString()}`, {
    method: "GET",
    token,
  });
}

export async function approveMentor(token, id) {
  return apiRequest(`/admin/mentors/${id}/approve`, { method: "PUT", token });
}

export async function rejectMentor(token, id) {
  return apiRequest(`/admin/mentors/${id}/reject`, { method: "PUT", token });
}

export async function getReportedContent(token, page, limit) {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  return apiRequest(`/admin/reported-content?${params.toString()}`, {
    method: "GET",
    token,
  });
}

export async function dismissPostReport(token, id) {
  return apiRequest(`/admin/posts/${id}/dismiss`, { method: "PUT", token });
}

export async function removeReportedPost(token, id) {
  return apiRequest(`/admin/posts/${id}`, { method: "DELETE", token });
}

export async function dismissCommentReport(token, id) {
  return apiRequest(`/admin/comments/${id}/dismiss`, { method: "PUT", token });
}

export async function removeReportedComment(token, id) {
  return apiRequest(`/admin/comments/${id}`, { method: "DELETE", token });
}

export async function toggleUserStatus(token, id) {
  return apiRequest(`/admin/users/${id}/status`, { method: "PUT", token });
}

export async function deleteMentorAccount(token, id) {
  return apiRequest(`/admin/mentors/${id}`, { method: "DELETE", token });
}

export async function deleteMenteeAccount(token, id) {
  return apiRequest(`/admin/mentees/${id}`, { method: "DELETE", token });
}

export async function getAllAdmins(token) {
  return apiRequest("/admin/admins", { method: "GET", token });
}

export async function createAdmin(token, adminData) {
  return apiRequest("/admin/admins", {
    method: "POST",
    token,
    body: adminData,
  });
}

export async function removeAdmin(token, id) {
  return apiRequest(`/admin/admins/${id}`, { method: "DELETE", token });
}

export async function getStats(token) {
  return apiRequest("/admin/stats", { method: "GET", token });
}
