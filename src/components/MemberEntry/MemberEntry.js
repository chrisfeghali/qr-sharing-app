import { database, ref } from "../../apis/firebase";
import { ListGroup } from "react-bootstrap";

import { useObjectVal } from "react-firebase-hooks/database";

const MemberEntry = ({ memberKey, memberVal }) => {
  const [username] = useObjectVal(
    ref(database, `users/${memberKey}/username/`)
  );

  return (
    <ListGroup.Item variant="primary">{`${username} ${
      memberVal ? "(admin)" : ""
    }`}</ListGroup.Item>
  );
};

export default MemberEntry;
