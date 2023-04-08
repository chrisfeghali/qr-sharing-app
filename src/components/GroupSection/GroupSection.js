import { useState, useEffect } from "react";
import {
  CreateGroup,
  GetGroupName,
  database,
  ref,
  GetGroupAdmin,
} from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useListKeys, useObjectVal } from "react-firebase-hooks/database";
import Button from "react-bootstrap/Button";
import CollapsibleButton from "../CollapsibleButton/CollapsibleButton";
import { LinkContainer } from "react-router-bootstrap";

const GroupSection = (...props) => {
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isMounted, setIsMounted] = useState(true);

  const submitForm = async (e) => {
    e.preventDefault();
    e.target[0].value && (await CreateGroup(e.target[0].value));
    e.target.reset();
  };

  const [keys] = useListKeys(ref(database, `users/${currentUser.uid}/groups/`));

  const [nameChangeVal] = useObjectVal(ref(database, `nameChange`));

  useEffect(() => {
    const FetchGroupNames = async () => {
      try {
        let groupNames = [];
        for (const [, value] of Object.entries(keys)) {
          const groupName = await GetGroupName(value);
          const admin = await GetGroupAdmin(value);
          groupNames = [...groupNames, { value, groupName, admin }];
        }
        if (isMounted) {
          setGroups(groupNames);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setIsMounted(true);
    FetchGroupNames();

    return () => {
      setIsMounted(false);
    };
  }, [keys, nameChangeVal, isMounted]);

  return (
    <>
      {groups.map((v) => {
        return (
          <CollapsibleButton
            key={v.value}
            buttonName={v.groupName}
            startOpen={false}
            conditionalStatement="open === false"
            buttonLink={`group/${v.value}`}
            buttonSrc={(props) => <Button {...props}></Button>}
          >
            <LinkContainer to={`group/${v.value}/codes`}>
              <Button className="final">Codes</Button>
            </LinkContainer>
            <LinkContainer to={`group/${v.value}/members`}>
              <Button className="final">Members</Button>
            </LinkContainer>
            {v.admin ? (
              <>
                <LinkContainer to={`group/${v.value}/invites`}>
                  <Button className="final">Invites</Button>
                </LinkContainer>
                <LinkContainer to={`group/${v.value}/edit-group`}>
                  <Button className="final">Edit Group</Button>
                </LinkContainer>
              </>
            ) : (
              <></>
            )}
          </CollapsibleButton>
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
