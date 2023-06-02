import { useGroup } from "../../contexts/GroupContext";
import AddCodeButton from "../AddCodeButton/AddCodeButton";
import BookingComponent from "../BookingComponent/BookingComponent";
import RemoveCodeButton from "../RemoveCodeButton/RemoveCodeButton";
import ReserveCode from "../ReserveCode/ReserveCode";

const CodePage = () => {
  const { groupValue } = useGroup();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <AddCodeButton />
          <RemoveCodeButton />
        </div>
        <div>
          <ReserveCode groupValue={groupValue} />
        </div>
        <BookingComponent />
      </div>
    </>
  );
};

export default CodePage;
