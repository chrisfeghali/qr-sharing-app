import { database, ref } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";
import { useList } from "react-firebase-hooks/database";
import InviteCode from "../InviteCode/InviteCode";
import { useEffect, useState } from "react";

const InviteSection = () => {
  const { groupValue } = useGroup();
  const [inviteCodes, loading] = useList(
    ref(database, `groups/${groupValue}/invites/`)
  );
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);

  return (
    // <ListGroup style={{ width: "80%", justifyContent: "center" }}>
    <>
      {isMounted &&
        !loading &&
        !!inviteCodes &&
        inviteCodes.map((v) => (
          <InviteCode key={v.key} inviteKey={v.key} inviteVal={v.val()} />
        ))}
    </>
  );
};

export default InviteSection;
