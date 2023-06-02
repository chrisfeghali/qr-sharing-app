import Card from "react-bootstrap/Card";
import { RemoveCodeFromGroup, database, ref } from "../../apis/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import QRCode from "../QRCode/QRCode";
import { useGroup } from "../../contexts/GroupContext";

const RemoveCodeTile = ({ handleClose, codeKey, ...props }) => {
  const { groupValue } = useGroup();
  const [code] = useObjectVal(ref(database, `codes/${codeKey}`));

  const handleCardClick = async () => {
    try {
      await RemoveCodeFromGroup(codeKey, groupValue);
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

export default RemoveCodeTile;
