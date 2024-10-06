import Navbar from "./navbar";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: any;
}

const Layout = (props: LayoutProps) => {
  return (
    <div className="min-h-full w-full">
      <Navbar>{props.children}</Navbar>
    </div>
  );
};

export default Layout;
