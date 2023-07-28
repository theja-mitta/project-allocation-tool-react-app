import React from "react";

const Layout = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url('../assets/desktop-wallpaper-what-makes-a-human-resource-management-system-unique-human-resources.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
};

export default Layout;