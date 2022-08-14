import Button from "react-bootstrap/Button";
import { useGroup } from "../../contexts/GroupContext";
import { DeleteGroup } from "../../apis/firebase";

const CodePage = () => {
  const { groupName, groupValue } = useGroup();

  return (
    <>
      <div>Codes</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{groupName}</div>
        </div>
      </div>
      <div className="Sign-header-links">
        <Button
          onClick={async () => {
            try {
              await DeleteGroup(groupValue);
              // navigate("/home/homepage", { replace: true });
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

export default CodePage;
