const OPEN_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

function jsonError(error, status) {
  return Response.json({ error }, { status });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lon");
  const hasCoordinates = latitude !== null || longitude !== null;

  if ((city && hasCoordinates) || (!city && !hasCoordinates)) {
    return jsonError("Indica una ciudad o un par de coordenadas.", 400);
  }

  const query = new URLSearchParams({
    units: "metric",
    lang: "es",
  });

  if (city) {
    if (city.length > 100) {
      return jsonError("El nombre de la ciudad es demasiado largo.", 400);
    }

    query.set("q", city);
  } else {
    const lat = Number(latitude);
    const lon = Number(longitude);

    if (
      latitude === null ||
      longitude === null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return jsonError("Las coordenadas no son válidas.", 400);
    }

    query.set("lat", String(lat));
    query.set("lon", String(lon));
  }

  const apiKey =
    process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  if (!apiKey) {
    return jsonError(
      "El servicio del clima no está configurado. Añade WEATHER_API_KEY.",
      500
    );
  }

  query.set("appid", apiKey);

  let response;
  try {
    response = await fetch(`${OPEN_WEATHER_URL}?${query}`, {
      cache: "no-store",
    });
  } catch {
    console.error("No se pudo conectar con el servicio meteorológico.");
    return jsonError("No se pudo conectar con el servicio del clima.", 502);
  }

  if (response.status === 404) {
    return jsonError("No se encontró la ciudad solicitada.", 404);
  }

  if (response.status === 401) {
    return jsonError("La clave del servicio meteorológico no es válida.", 502);
  }

  if (response.status === 429) {
    return jsonError("Se alcanzó el límite de consultas al servicio del clima.", 429);
  }

  if (!response.ok) {
    console.error(`El servicio meteorológico respondió con ${response.status}.`);
    return jsonError("El servicio del clima no está disponible.", 502);
  }

  try {
    return Response.json(await response.json());
  } catch {
    console.error("El servicio meteorológico devolvió una respuesta inválida.");
    return jsonError("El servicio del clima devolvió una respuesta inválida.", 502);
  }
}
