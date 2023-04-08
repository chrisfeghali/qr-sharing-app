import { Button } from "react-bootstrap";
import { useGroup } from "../../contexts/GroupContext";
import { CreateInviteCode } from "../../apis/firebase";

import InviteSection from "../InviteSection/InviteSection";

const InvitePage = () => {
  const { groupName, groupValue } = useGroup();

  const generateInviteURL = async () => {
    try {
      await CreateInviteCode(groupValue);
    } catch (err) {
      console.log(err.code);
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <div>{groupName}</div>
          <div>Invites</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Button onClick={generateInviteURL}>Create Invite Code</Button>
          <InviteSection></InviteSection>
        </div>
      </div>
    </>
  );
};

export default InvitePage;
