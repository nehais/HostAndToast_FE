import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
// import { Icon, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
// import markerIcon from "../assets/marker-icon.png";

const Map = () => {
  const markers = [
    //hannover 1
    {
      geocode: [52.375, 9.732],
      popUp: "Hannover 1",
    },
    //hannover 2
    {
      geocode: [52.365, 9.722],
      popUp: "Hannover 2",
    },
    //hannover 3
    {
      geocode: [52.39, 9.71],
      popUp: "Hannover 3",
    },
    // munich 1
    {
      geocode: [48.137, 11.575],
      popUp: "Munich 1",
    },
    // munich 2
    {
      geocode: [48.128, 11.52],
      popUp: "Munich 2",
    },
    //munich 3
    {
      geocode: [48.11, 11.58],
      popUp: "Munich 3",
    },
  ];

  // const customMarkerIcon = new Icon({
  //   iconUrl: markerIcon,
  //   iconSize: [38, 38],
  // });

  // const createCustomClusterIcon = (cluster) => {
  //   return new DivIcon({
  //     html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
  //     className: "custom-marker-cluster",
  //     iconSize: point(33, 33, true),
  //   });
  // };

  return (
    // <div>Map</div>
    <MapContainer center={[51.76088, 10.25032]} zoom={5}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        // iconCreateFunction={createCustomClusterIcon}
      >
        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              position={marker.geocode} //>icon={customMarkerIcon}
            >
              <Popup>{marker.popUp}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
export default Map;
