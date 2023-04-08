import { database, ref } from "../../apis/firebase";
import { ListGroup } from "react-bootstrap";
import { useGroup } from "../../contexts/GroupContext";
import { useList } from "react-firebase-hooks/database";
import MemberEntry from "../MemberEntry/MemberEntry";

const MemberPage = () => {
  const { groupName, groupValue } = useGroup();
  const [members] = useList(ref(database, `groups/${groupValue}/members/`));

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
          <div>
            {groupName} - Members ({members.length})
          </div>
        </div>

        <ListGroup variant="flush">
          {!!members &&
            members
              .sort((a, b) => {
                const valA = a.val();
                const valB = b.val();
                if (valA && !valB) {
                  return -1; // a is admin, b is not admin
                } else if (!valA && valB) {
                  return 1; // b is admin, a is not admin
                } else {
                  return 0; // both are admin or both are not admin
                }
              })
              .map((v) => (
                <MemberEntry
                  key={v.key}
                  memberKey={v.key}
                  memberVal={v.val()}
                />
              ))}
        </ListGroup>
      </div>
    </>
  );
};

export default MemberPage;
