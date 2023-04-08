import { useGroup } from "../../contexts/GroupContext";
import AddCodeButton from "../AddCodeButton/AddCodeButton";

const CodePage = () => {
  const { groupName } = useGroup();

  return (
    <>
      <div>Codes</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>{groupName}</div>
        </div>
      </div>
      <div className="Sign-header-links">
        <AddCodeButton />
      </div>
    </>
  );
};

export default CodePage;
