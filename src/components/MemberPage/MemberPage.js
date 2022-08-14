import Button from "react-bootstrap/Button";
import { useGroup } from "../../contexts/GroupContext";
import { useParams } from "react-router-dom";
import { DeleteGroup } from "../../apis/firebase";
import { useNavigate } from "react-router-dom";

const MemberPage = () => {
  const { groupName } = useGroup();
  const params = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div>Members</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{groupName}</div>
        </div>
      </div>
      <div className="Sign-header-links">
        <Button
          onClick={async () => {
            try {
              await DeleteGroup(params.groupID);
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

export default MemberPage;
