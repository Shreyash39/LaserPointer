// client/src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getData() {
  const res = await fetch(`${API_URL}/your-endpoint`);
  return res.json();
}
