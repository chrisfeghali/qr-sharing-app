import { CreateGroup, database, ref } from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys } from "react-firebase-hooks/database";

import GroupButton from "../GroupButton/GroupButton";
import { useEffect, useState } from "react";

const GroupSection = (...props) => {
  const { currentUser } = useAuth();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    e.target[0].value && (await CreateGroup(e.target[0].value));
    e.target.reset();
  };

  const [groups] = useListKeys(
    ref(database, `users/${currentUser.uid}/groups/`)
  );

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, [setIsMounted]);
  return (
    <>
      {isMounted && (
        <>
          {groups.map((v) => {
            //console.log("v.value", v);
            return <GroupButton key={v} groupKey={v}></GroupButton>;
          })}

          <form onSubmit={handleCreateGroup} style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Create new group"
              maxLength="50"
              className="sidebar-text-input"
            />
            <input type="submit" value="+" />
          </form>
        </>
      )}
    </>
  );
};

export default GroupSection;
