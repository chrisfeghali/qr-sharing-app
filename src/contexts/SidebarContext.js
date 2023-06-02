import React, { useContext, useState } from "react";

const SidebarContext = React.createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children, ...props }) {
  const [open, setOpen] = useState(true);

  const value = {
    open,
    setOpen,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
