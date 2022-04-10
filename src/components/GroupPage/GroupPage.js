import Button from "react-bootstrap/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { DeleteGroup } from "../../apis/firebase";
import { useNavigate } from "react-router-dom";

const GroupPage = () => {
  const { currentUser } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div>Group</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{params.groupID}</div>
        </div>
      </div>
      <div className="Sign-header-links">
        <Button
          onClick={async () => {
            try {
              await DeleteGroup(currentUser.uid, params.groupID);
              navigate("/home/homepage", { replace: true });
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Remove Group
        </Button>
      </div>
    </>
  );
};

export default GroupPage;
