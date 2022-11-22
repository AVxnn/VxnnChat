import React from 'react';
import Header from "../../widgets/header/header";

const Layout = ({children}) => {
  return (
    <div style={{display: 'flex', width: '90%', top: 0, position: 'relative', flexDirection: 'column', backgroundColor: '#151618', height: '100vh'}}>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
