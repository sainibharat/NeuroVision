/**
 * NeuroVision Backend API Client
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API health check failed:", err.message);
    return null;
  }
}

export async function predictMri(file, explain = true) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${API_BASE_URL}/predict?explain=${explain}`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Server responded with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) errorMsg = errorData.detail;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return await response.json();
}
