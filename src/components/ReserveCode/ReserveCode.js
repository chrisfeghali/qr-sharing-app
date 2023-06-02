import { database, ref } from "../../apis/firebase";
import { useListKeys } from "react-firebase-hooks/database";
import { useState, useEffect } from "react";

import "firebase/database";
import GroupCode from "../GroupCode/GroupCode";

const ReserveCode = ({ groupValue }) => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    //console.log("reserve mounted");
    //console.log("groupValue", groupValue);
    return () => {
      //console.log("reserve unmounted");
      //console.log("groupValue", groupValue);
      setIsMounted(false);
    };
  }, [setIsMounted]);

  const [codeListKeys] = useListKeys(
    ref(database, `groups/${groupValue}/codes/`)
  );

  return (
    <>
      {isMounted &&
        !!codeListKeys &&
        codeListKeys.map((v) => <GroupCode key={v} codeKey={v} />)}
    </>
  );
};

export default ReserveCode;
