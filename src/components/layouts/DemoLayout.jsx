import React, { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import Footer from "./Footer";

const DemoLayout = ({ content }) => {
  return (
    <>
      <Header />
      {/* <Sidebar /> */}
      {/* main page */}
      <Suspense>
      <div style={{marginTop: "8.5rem"}}>
      {content}
      </div>
      </Suspense>
      <Footer />
    </>
  );
};

export default DemoLayout;
