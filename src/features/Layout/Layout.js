import React from 'react';
import Header from "../../widgets/header/header";
import {Helmet} from "react-helmet";

const Layout = ({children}) => {
  return (
    <>
      <Helmet>
        <title>{`PetChat - test`}</title>
      </Helmet>
      <div style={{display: 'flex', width: '90%', top: 0, position: 'relative', flexDirection: 'column', backgroundColor: '#151618', height: '100vh'}}>
        <Header />
        {children}
      </div>
    </>
  );
};

export default Layout;
