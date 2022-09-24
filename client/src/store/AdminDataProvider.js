import { createContext, useState } from "react";

const AdminContext = createContext();

export function AdminDataProvider(props) {
  const [userData, setUserData] = useState({});

  const value = {
    userData,
    setUserData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
