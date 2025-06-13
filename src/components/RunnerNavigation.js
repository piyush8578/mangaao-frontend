import React from 'react';

const RunnerNavigation = ({ origin, destination }) => {
  const googleMapsKey = "YOUR_GOOGLE_MAPS_API_KEY";

  const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${googleMapsKey}&origin=${origin}&destination=${destination}&mode=driving`;

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-center text-lg font-semibold mb-2">Navigation</h2>
      <iframe
        title="Runner Map"
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        src={mapSrc}
        className="rounded shadow"
      ></iframe>
    </div>
  );
};

export default RunnerNavigation;