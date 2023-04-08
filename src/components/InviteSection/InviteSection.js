import { database, ref } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";
import { useList } from "react-firebase-hooks/database";
import InviteCode from "../InviteCode/InviteCode";

const InviteSection = () => {
  const { groupValue } = useGroup();
  const [inviteCodes] = useList(ref(database, `groups/${groupValue}/invites/`));

  return (
    // <ListGroup style={{ width: "80%", justifyContent: "center" }}>
    <>
      {!!inviteCodes &&
        inviteCodes.map((v) => (
          <InviteCode key={v.key} inviteKey={v.key} inviteVal={v.val()} />
        ))}
    </>
  );
};

export default InviteSection;
