import { useEffect } from "react";
import {
  database,
  ref,
  RemoveGroupFromUser,
  AlignUserAdminSettings,
} from "../../apis/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useObjectVal } from "react-firebase-hooks/database";
import Button from "react-bootstrap/Button";
import CollapsibleButton from "../CollapsibleButton/CollapsibleButton";
import { LinkContainer } from "react-router-bootstrap";
import { useSidebar } from "../../contexts/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";

const GroupButton = ({ groupKey, ...props }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = location.pathname.split("/").reverse()[1];

  const { setOpen } = useSidebar();

  const [groupName, loadingName, errorName] = useObjectVal(
    ref(database, `groups/${groupKey}/name`)
  );
  const [groupMember, loadingMember, errorMember] = useObjectVal(
    ref(database, `groups/${groupKey}/members/${currentUser.uid}`)
  );

  useEffect(() => {
    const checkUserInGroup = async () => {
      if (!loadingName && !loadingMember) {
        if (groupMember === null) {
          await RemoveGroupFromUser(groupKey);
          if (currentLocation === groupKey) {
            navigate("/home/homepage", { replace: true });
          }
        } else {
          await AlignUserAdminSettings(groupKey, groupMember);
        }
      }
    };

    checkUserInGroup();
  }, [
    loadingName,
    loadingMember,
    groupMember,
    groupName,
    groupKey,
    currentLocation,
    navigate,
  ]);

  if (loadingName || loadingMember || errorName || errorMember) {
    return <></>;
  }

  return (
    <>
      <CollapsibleButton
        buttonClassName={"sidebar-button-text"}
        buttonName={groupName}
        startOpen={false}
        closeSidebarOnClick={true}
        conditionalStatement="open === false"
        buttonLink={`group/${groupKey}/codes`}
        buttonSrc={(props) => <Button {...props}></Button>}
      >
        <LinkContainer to={`group/${groupKey}/codes`}>
          <Button
            className="final"
            onClick={() => {
              setOpen(false);
            }}
          >
            Codes
          </Button>
        </LinkContainer>
        <LinkContainer to={`group/${groupKey}/members`}>
          <Button
            className="final"
            onClick={() => {
              setOpen(false);
            }}
          >
            Members
          </Button>
        </LinkContainer>
        {groupMember ? (
          <>
            <LinkContainer to={`group/${groupKey}/invites`}>
              <Button
                className="final"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Invites
              </Button>
            </LinkContainer>
            <LinkContainer to={`group/${groupKey}/edit-group`}>
              <Button
                className="final"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Edit Group
              </Button>
            </LinkContainer>
          </>
        ) : (
          <></>
        )}
      </CollapsibleButton>
    </>
  );
};

export default GroupButton;
