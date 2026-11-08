async function getWeather(query) {
  const searchParams = new URLSearchParams(query);
  const response = await fetch(`/api/weather?${searchParams}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo obtener el clima.");
  }

  return data;
}

export function getWeatherByCity(city) {
  return getWeather({ city });
}

export function getWeatherByCoords(lat, lon) {
  return getWeather({ lat: String(lat), lon: String(lon) });
}
