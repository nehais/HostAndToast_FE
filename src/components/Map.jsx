import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, DivIcon, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import { useContext, useEffect, useState } from "react";
import { AddressContext } from "../contexts/address.context";
import markerIcon from "../assets/marker-icon.png";

const DEFAULT_LAT = 51.16423;
const DEFAULT_LONG = 10.45412;
const DEFAULT_ZOOM = 5;

// Component to update the map center when state changes
const MapUpdater = ({ lat, long, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, long], zoom);
  }, [lat, long, zoom, map]);

  return null;
};

const Map = ({ markers }) => {
  const { address } = useContext(AddressContext);
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [long, setLong] = useState(DEFAULT_LONG);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    if (address) {
      setLat(address.lat || DEFAULT_LAT);
      setLong(address.lon || DEFAULT_LONG);
      setZoom(lat === DEFAULT_LAT ? DEFAULT_ZOOM : 11);
      // console.log("set lat long zoom", lat, long, zoom);
    }
  }, [address]);

  // Custom marker icon
  // const customMarkerIcon = new Icon({
  //   iconUrl: markerIcon,
  //   iconSize: [38, 38],
  // });

  // Custom cluster icon
  // const createCustomClusterIcon = (cluster) => {
  //   return new DivIcon({
  //     html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
  //     className: "custom-marker-cluster",
  //     iconSize: point(33, 33, true),
  //   });
  // };

  return (
    <MapContainer center={[lat, long]} zoom={zoom}>
      {/* Ensures the map updates when state changes */}
      <MapUpdater lat={lat} long={long} zoom={zoom} />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        // iconCreateFunction={createCustomClusterIcon}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.geocode}
            // icon={customMarkerIcon}
          >
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
