import Button from "react-bootstrap/Button";
import { useGroup } from "../../contexts/GroupContext";
import { CreateInviteCode } from "../../apis/firebase";

import InviteSection from "../InviteSection/InviteSection";

const InvitePage = () => {
  const { groupValue } = useGroup();

  const generateInviteURL = async () => {
    try {
      await CreateInviteCode(groupValue);
    } catch (err) {
      //console.log(err.code);
    }
  };

  return (
    <>
      <div>
        <div style={{ textAlign: "center" }}>
          <Button onClick={generateInviteURL}>Create Invite Code</Button>
          <InviteSection></InviteSection>
        </div>
      </div>
    </>
  );
};

export default InvitePage;
