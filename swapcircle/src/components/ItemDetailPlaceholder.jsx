import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { LuLeaf } from "react-icons/lu";
import { BiRecycle } from "react-icons/bi";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "../../Pages/ItemDetail.css";

const ItemDetailPlaceholder = ({ data, imagepreview }) => {
  const [index, setIndex] = useState(0);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    // Re-center the map whenever the position changes
    let zoom;
    if (data?.location?.city) {
      zoom = 9;
    } else if (data?.location?.state) {
      zoom = 6;
    } else if (data?.location?.country) {
      zoom = 3;
    } else {
      zoom = 12;
    }

    if (mapRef.current) {
      mapRef.current.setView([data?.location?.lat, data?.location?.lng], zoom);
    }
  }, [data?.location]);

  return (
    <Container className="detail-container">
      <h3 className="page-title">Item Preview</h3>
      <Row>
        <Col md={9}>
          <Row>
            {imagepreview?.length > 0 ? (
              <>
                <Col xs={4} sm={3} lg={2} className="p-0">
                  <Container className="my-3 thumbnail-container">
                    <div className="thumbnail-scroll">
                      {imagepreview?.map((src, idx) => (
                        <Image
                          key={idx}
                          src={src}
                          className={`img-thumbnail ${
                            index === idx ? "img-thumbnail-selected" : ""
                          }`}
                          onClick={() => handleSelect(idx)}
                        />
                      ))}
                    </div>
                  </Container>
                </Col>
                <Col xs={8} sm={9} lg={10} className="main-image-carousel">
                  <Carousel activeIndex={index} onSelect={handleSelect}>
                    {imagepreview?.map((src, idx) => (
                      <Carousel.Item key={idx}>
                        <Image
                          className="w-100"
                          src={src}
                          alt={`Slide ${idx + 1}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </Col>
              </>
            ) : (
              <Col className="d-flex justify-content-center align-items-center">
                <div className="image-placeholder">
                  <h4>Image Preview</h4>
                </div>
              </Col>
            )}
          </Row>
        </Col>

        <Col md={3} className="my-3">
          <Card className="my-3">
            <Card.Title>{data.name}</Card.Title>
            <Card.Text style={{ fontSize: "0.8rem" }}>
              {data.description}
            </Card.Text>
            <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Estimated Value
            </Card.Text>
            <Card.Text style={{ fontSize: "1.5rem" }}>
              ${data?.price[0]} - ${data?.price[1]}
            </Card.Text>

            <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Description
            </Card.Text>
            <Card.Text style={{ fontSize: "0.8rem" }}>
              {data.description}
            </Card.Text>
          </Card>

          <Card className="my-3">
            <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Condition Details
            </Card.Text>

            {data?.condition && (
              <Card.Text style={{ fontSize: "0.8rem" }} className="m-0">
                {data?.condition.split("_").join(" ")}
              </Card.Text>
            )}
            {data?.eco_friendly && (
              <Card.Text style={{ fontSize: "0.8rem" }} className="m-0">
                <LuLeaf /> Eco-friendly
              </Card.Text>
            )}
            {data?.recyclable && (
              <Card.Text style={{ fontSize: "0.8rem" }} className="m-0">
                <BiRecycle /> Recyclable
              </Card.Text>
            )}
          </Card>

          <Card className="my-3">
            <Card.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
              Map Reference
            </Card.Text>
            <div style={{ height: "40vh", width: "100%" }}>
              <MapContainer
                center={[data?.location?.lat, data?.location?.lng]} // Center on the current data?.location?
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100% " }}
                ref={mapRef}
              >
                <TileLayer
                  attribution={`<a href="https://maps.google.com/?q=${data?.location?.lat},${data?.location?.lng}" target="_blank" rel="noopener noreferrer" style="font-size:1rem;">Open in larger map</a>`}
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[data?.location?.lat, data?.location?.lng]}
                  ref={markerRef}
                />
              </MapContainer>
            </div>
            <Card.Text className="mt-4 m-0">
              {data?.location?.city && `${data?.location?.city}, `}
              {data?.location?.state && `${data?.location?.state}, `}
              {data?.location?.country && `${data?.location?.country}`}
              {data?.location?.postcode && `- ${data?.location?.postcode}`}
            </Card.Text>
            <Card.Text style={{ fontSize: "0.8rem" }}>
              Location is approximate
            </Card.Text>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetailPlaceholder;
