const BASE_URL = 'http://127.0.0.1:8000/api/v1';

export async function getBands() {
  const response = await fetch(`${BASE_URL}/bands/`);
  const json = await response.json();
  return json;
}
