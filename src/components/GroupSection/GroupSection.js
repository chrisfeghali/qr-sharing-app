import { useState, useEffect } from "react";
import { CreateGroup, GetGroupName, database, ref } from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys } from "react-firebase-hooks/database";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

const GroupSection = () => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);

  const submitForm = async (e) => {
    e.preventDefault();
    e.target[0].value &&
      (await CreateGroup(currentUser.uid, e.target[0].value));
    e.target.reset();
  };

  const [keys, ,] = useListKeys(
    ref(database, `users/${currentUser.uid}/groups/`)
  );

  useEffect(() => {
    const fetchGroupNames = async () => {
      let groupNames = [];
      for (const [, value] of Object.entries(keys)) {
        const groupName = await GetGroupName(value);
        groupNames = [...groupNames, { value, groupName }];
      }
      return setGroups(groupNames);
    };

    fetchGroupNames();
  }, [keys]);

  return (
    <>
      {groups.map((v) => {
        return (
          <LinkContainer key={v.value} to={`group/${v.value}`}>
            <Button>{v.groupName}</Button>
          </LinkContainer>
        );
      })}

      <form onSubmit={submitForm} style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Create new group"
          maxLength="50"
          className="sidebar-text-input"
        />
        <input type="submit" value="+" />
      </form>
    </>
  );
};

export default GroupSection;
