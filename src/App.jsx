import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import "primeicons/primeicons.css"; // PrimeIcons
import "primeflex/primeflex.css"; // PrimeFlex for utility classes
import "bootstrap/dist/css/bootstrap.min.css";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "leaflet/dist/leaflet.css";
// Default theme
import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/core";

import Routes from "../Routes";
function App() {
  return (
    <>
      <Routes />
    </>
  );
}

export default App;
