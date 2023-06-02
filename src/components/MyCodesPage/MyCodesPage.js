import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import AddQRModal from "../AddQRModal/AddQRModal";
import CodeSection from "../CodeSection/CodeSection";
import CodeTile from "../CodeTile/CodeTile";

const MyCodesPage = () => {
  const [qr, setQr] = useState(null);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const html5QrCode = new Html5Qrcode("reader");

  const AddCode = (e) => {
    let imageFile = e.target.files[0];
    html5QrCode
      .scanFile(imageFile, false)
      .then((decodedText) => {
        setQr(decodedText);
        setShow(true);
      })
      .catch((err) => {
        setErrorMessage(`Error scanning file. Reason: ${err}`);
        setShowError(true);
      });
  };
  const qrInput = useRef(null);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <div>
            <input
              id="qrInputFile"
              type="file"
              accept="image/*"
              ref={qrInput}
              style={{ display: "none" }}
              onChange={AddCode}
            />
            <Button className="mb-2" onClick={() => qrInput.current.click()}>
              Add code
            </Button>
          </div>
          <AddQRModal show={show} onShowChange={setShow} text={qr} />
          <Alert
            className="position-absolute top-25"
            variant="danger"
            show={showError}
            style={{ zIndex: 1 }}
            onClose={() => {
              setShowError(false);
            }}
            dismissible
          >
            <Alert.Heading>{errorMessage}</Alert.Heading>
          </Alert>
        </div>
        <CodeSection
          emptyMessage={`No codes added`}
          codeObject={(props) => <CodeTile {...props}></CodeTile>}
        />
      </div>
    </>
  );
};

export default MyCodesPage;
