import Card from "react-bootstrap/Card";
import { database, ref } from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import QRCode from "../QRCode/QRCode";
import { AddCodeToGroup } from "../../apis/firebase";
import { useGroup } from "../../contexts/GroupContext";

const AddCodeTile = ({ handleClose, codeKey, ...props }) => {
  const { groupValue } = useGroup();
  const [code] = useObjectVal(ref(database, `codes/${codeKey}`));

  const handleCardClick = async () => {
    try {
      await AddCodeToGroup(codeKey, groupValue);
      handleClose();
    } catch (err) {
      //console.log(err.code);
    }
  };

  return (
    <>
      {!!code && (
        <>
          <Card
            style={{
              margin: "0 auto",
              width: "15rem",
              cursor: "pointer",
            }}
            onClick={handleCardClick}
          >
            <QRCode text={code.val} />
            <Card.Title
              style={{
                color: "black",
                textAlign: "center",
              }}
            >
              {code.name}
            </Card.Title>
          </Card>
        </>
      )}
    </>
  );
};

export default AddCodeTile;
