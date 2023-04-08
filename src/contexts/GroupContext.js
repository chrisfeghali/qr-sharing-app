import React, { useContext, useState, useEffect } from "react";
import { GetGroupAdmin, GetGroupName, UpdateGroupName } from "../apis/firebase";
import { useLocation } from "react-router-dom";

const GroupContext = React.createContext();

export function useGroup() {
  return useContext(GroupContext);
}

export function GroupProvider({ children, ...props }) {
  const location = useLocation();
  const [groupName, setGroupName] = useState();
  const [groupValue, setGroupValue] = useState(
    location.pathname.split("/").reverse()[1]
  );
  const [admin, setAdmin] = useState();
  const [members] = useState();
  const [codes] = useState();
  const [loading, setLoading] = useState(true);

  if (groupValue !== location.pathname.split("/").reverse()[1]) {
    setGroupValue(location.pathname.split("/").reverse()[1]);
  }

  const updateGroupName = (groupName) => {
    return UpdateGroupName(groupValue, groupName);
  };

  useEffect(() => {
    const getValues = async (groupValue) => {
      try {
        const adminResult = await GetGroupAdmin(groupValue);
        setAdmin(adminResult);
        const groupNameResult = await GetGroupName(groupValue);
        setGroupName(groupNameResult);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    return getValues(groupValue);
  }, [groupValue]);

  const value = {
    groupName,
    setGroupName,
    groupValue,
    admin,
    members,
    codes,
    loading,
    updateGroupName,
  };

  return (
    <GroupContext.Provider value={value}>
      {!loading && children}
    </GroupContext.Provider>
  );
}
