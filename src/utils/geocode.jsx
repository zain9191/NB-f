export const geocodeAddress = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status === "OK") {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error("Geocoding failed");
  }
};
