import { database, ref, query } from "../../apis/firebase";
import ListGroup from "react-bootstrap/ListGroup";
import { useGroup } from "../../contexts/GroupContext";
import { useList } from "react-firebase-hooks/database";
import MemberEntry from "../MemberEntry/MemberEntry";
import { orderByValue } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const MemberPage = () => {
  const { groupValue } = useGroup();
  const { currentUser } = useAuth();
  const [memberList, setMemberList] = useState([{ key: "", value: "" }]);
  const dbQuery = query(
    ref(database, `groups/${groupValue}/members/`),
    orderByValue()
  );

  const [members, loading] = useList(dbQuery);

  useEffect(() => {
    if (!members) {
      return;
    }

    const tempArray = [];
    members.forEach((v) => {
      const key = v.key;
      const value = v.val();
      tempArray.unshift({ key, value });
    });
    tempArray.unshift(
      tempArray.splice(
        tempArray.findIndex((v) => v.key === currentUser.uid),
        1
      )[0]
    );

    setMemberList(tempArray);
  }, [currentUser.uid, members]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="mb-2"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div>Members ({memberList.length})</div>
        </div>

        <ListGroup variant="flush">
          {!loading &&
            !!memberList?.[0] &&
            memberList.map((v) => (
              <MemberEntry key={v.key} memberKey={v.key} memberVal={v.value} />
            ))}
        </ListGroup>
      </div>
    </>
  );
};

export default MemberPage;
