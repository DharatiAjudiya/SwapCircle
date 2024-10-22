import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Form, FormControl } from "react-bootstrap";
import {
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import { GEOAPIFY_API_KEY } from "../../../config/app_config";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Box } from "@mui/system";
import { MdMyLocation } from "react-icons/md";
import { LoadingButton } from "@mui/lab";

const LocationFilterModal = ({
  visible,
  reverseGeocode,
  setVisible,
  autocompleteValue,
  setFieldValue,
  values,
  setValues,
}) => {
  const closeModal = () => {
    setVisible(false);
  };

  const markerRef = useRef(null);
  const popupRef = useRef(null);
  const mapRef = useRef(null);
  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [address, setAddress] = useState({
    name: "",
    houseNumber: "",
    street: "",
    postcode: "",
    city: "",
    state: "",
    country: "",
  });
  const [radius, setRadius] = useState("");

  useEffect(() => {
    // Use geolocation to get the current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          // Center the map on the current location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    }
  }, []);

  const handleCurrentLocation = () => {
    // Use geolocation to get the current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });

          // Center the map on the current location
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
          }
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    }
  };

  useEffect(() => {
    let zoom;
    switch (+radius) {
      case 500:
        zoom = 15;
        break;
      case 1000:
        zoom = 14;
        break;
      case 2000:
        zoom = 13;
        break;
      case 3000:
        zoom = 12;
        break;
      case 5000:
        zoom = 12;
        break;
      default:
        zoom = 13;
        break;
    }

    if (mapRef.current) {
      mapRef.current.setView([position.lat, position.lng], zoom);
    }
  }, [radius, position]);

  function onPlaceSelect(value) {
    // Update marker position
    const { lat, lon } = value.properties;
    setPosition({ lat, lng: lon });

    // Update address state
    setAddress({
      name: value.properties.name || "",
      houseNumber: value.properties.housenumber || "",
      street: value.properties.street || "",
      postcode: value.properties.postcode || "",
      city: value.properties.city || "",
      state: value.properties.state || "",
      country: value.properties.country || "",
    });
  }

  const handleChange = (event) => {
    setRadius(parseInt(event.target.value));
  };

  const handlesSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, lat: position.lat, lng: position.lng, radius });
    reverseGeocode(position.lat, position.lng);
    setVisible(false);
  };

  return (
    <>
      <Dialog
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        className="location-modal"
      >
        <h4 className=" d-flex justify-content-center align-items-center align-content-center w-100">
          Change Location
        </h4>
        <div
          style={{
            minWidth: 120,
            marginBottom: "25px",
            zIndex: 1000,
            position: "relative",
          }}
        >
          <Form.Group>
            <Form.Label>Radius</Form.Label>
            <Form.Select value={radius} onChange={handleChange}>
              <option value={""}>Select Radius</option>
              <option value={500}>500 METERS</option>
              <option value={1000}>1 KILOMETER</option>
              <option value={2000}>2 KILOMETER</option>
              <option value={3000}>3 KILOMETER</option>
              <option value={5000}>5 KILOMETER</option>
            </Form.Select>
          </Form.Group>
        </div>
        <Form.Group
          className="mb-3"
          style={{
            marginBottom: "20px",
            position: "relative",
            zIndex: 1000,
          }}
        >
          <Form.Label>Item Location</Form.Label>
          <GeoapifyContext apiKey={GEOAPIFY_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              value={autocompleteValue}
              className="autocomplete-container"
              placeholder="Enter location here"
              placeSelect={onPlaceSelect}
            />
            <Tooltip title={"Current Location"} arrow>
              <IconButton
                aria-label="location"
                size="small"
                sx={{ position: "absolute", bottom: "1px", left: 0 }}
                onClick={handleCurrentLocation}
              >
                <MdMyLocation style={{ fontSize: "1.5rem" }} />
              </IconButton>
            </Tooltip>
          </GeoapifyContext>
        </Form.Group>
        <MapContainer
          center={[position.lat, position.lng]} // Center on the current position
          zoom={13}
          scrollWheelZoom={false}
          className="map-container"
          ref={mapRef}
        >
          <TileLayer
            attribution={`<a href="https://maps.google.com/?q=${position.lat},${position.lng}" target="_blank" rel="noopener noreferrer" style="font-size:1rem;">Open in larger map</a>`}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} ref={markerRef}>
            <Popup ref={popupRef} minWidth={200}>
              <div>
                <strong>Address:</strong> {address.street},{" "}
                {address.houseNumber}
                <br />
                <strong>Postcode:</strong> {address.postcode}
                <br />
                <strong>City:</strong> {address.city}
                <br />
                <strong>State:</strong> {address.state}
                <br />
                <strong>Country:</strong> {address.country}
                <br />
                <strong>Latitude:</strong> {position.lat.toFixed(6)}
                <br />
                <strong>Longitude:</strong> {position.lng.toFixed(6)}
              </div>
            </Popup>
          </Marker>
          {radius && (
            <Circle
              center={position}
              radius={parseInt(radius)} // radius is in meters
              color="blue"
            />
          )}
        </MapContainer>
        <LoadingButton
          // loading={isLoading}
          loadingPosition="start"
          startIcon={""}
          variant="contained"
          type="submit"
          className="w-100 my-3 submit-btn"
          onClick={(e) => handlesSubmit(e)}
        >
          Submit
        </LoadingButton>
      </Dialog>
    </>
  );
};

export default LocationFilterModal;
