import { useEffect } from "react";
import { database, ref } from "../../apis/firebase";
import { useObject } from "react-firebase-hooks/database";
import { useGroup } from "../../contexts/GroupContext";

const GroupCode = ({ codeKey }) => {
  const { updateCodes, encodeReservations, preprocessCode } = useGroup();
  const [code, loading] = useObject(ref(database, `codes/${codeKey}`));
  useEffect(() => {
    const preprocessAndUpdate = async () => {
      if (!loading && !!code.val()) {
        //console.log(code.val());
        //console.log(code.val().name, code.val().minutesBetweenUses);
        let val = code.val();
        const preprocessReturn = await preprocessCode(codeKey, code.val());
        if (!preprocessReturn) {
          val.encodedReservations = encodeReservations(code.val());
          updateCodes(codeKey, val);
        }
      }
    };
    preprocessAndUpdate();
    return () => {
      updateCodes(codeKey, undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, updateCodes, codeKey, loading]);

  return <></>;
};

export default GroupCode;
