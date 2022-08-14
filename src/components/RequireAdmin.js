import { Navigate } from "react-router-dom";
import { useGroup } from "../contexts/GroupContext";

const RequireAdmin = ({ children }) => {
  const { groupValue, admin } = useGroup();
  return admin ? children : <Navigate to={`/home/group/${groupValue}`} />;
};

export default RequireAdmin;
