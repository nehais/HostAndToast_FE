// Map.jsx
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useContext, useEffect, useState } from "react";
import { AddressContext } from "../contexts/address.context";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
// import markerIcon from "../assets/marker-icon.png"; // if needed

const DEFAULT_LAT = 51.16423;
const DEFAULT_LONG = 10.45412;
const DEFAULT_ZOOM = 5;

// This component updates the map view
const MapUpdater = ({ lat, long, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, long], zoom);
  }, [lat, long, zoom, map]);
  return null;
};

// New component to report bounds back to the parent.
const MapEvents = ({ onBoundsChange }) => {
  const map = useMap();
  useEffect(() => {
    const updateBounds = () => {
      const bounds = map.getBounds();
      if (onBoundsChange) onBoundsChange(bounds);
    };
    map.on("moveend", updateBounds);
    // Call it once to initialize the bounds.
    updateBounds();
    return () => {
      map.off("moveend", updateBounds);
    };
  }, [map, onBoundsChange]);
  return null;
};

const Map = ({ markers, onBoundsChange }) => {
  const { address } = useContext(AddressContext);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [long, setLong] = useState(DEFAULT_LONG);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    if (address) {
      const newLat = address.lat || DEFAULT_LAT;
      const newLong = address.lon || DEFAULT_LONG;
      setLat(newLat);
      setLong(newLong);
      setZoom(address.lat ? 11 : DEFAULT_ZOOM);
    }
  }, [address]);

  // If you wish to use a custom marker icon or cluster icon, you can uncomment and adjust the code below.
  /*
  const customMarkerIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster) => {
    return new DivIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: [33, 33],
    });
  };
  */

  return (
    <MapContainer center={[lat, long]} zoom={zoom}>
      {/* Update the view if lat/long/zoom change */}
      <MapUpdater lat={lat} long={long} zoom={zoom} />
      {/* Listen to map movements and report new bounds */}
      <MapEvents onBoundsChange={onBoundsChange} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geocode}
            // icon={customMarkerIcon}  // Uncomment if you are using a custom icon.
          >
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
