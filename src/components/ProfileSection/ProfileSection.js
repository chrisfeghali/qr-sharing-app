import { useAuth } from "../../contexts/AuthContext";

const ProfileSection = () => {
  const { userName } = useAuth();

  return (
    <>
      {!!userName && (
        <>
          <div className="h5 final sidebar-text">{userName}</div>
        </>
      )}
    </>
  );
};

export default ProfileSection;
