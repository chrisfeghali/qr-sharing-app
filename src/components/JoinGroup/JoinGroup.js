import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams, Navigate } from "react-router-dom";

const JoinGroup = () => {
  const { joinCode } = useParams();
  const { setJoinCode } = useAuth();
  useEffect(() => {
    setJoinCode(joinCode);
  }, [joinCode, setJoinCode]);

  return <Navigate to="/" />;
};

export default JoinGroup;
