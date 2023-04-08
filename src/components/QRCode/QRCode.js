import qrcodegen from "nayuki-qr-code-generator";

function toSvgString(qr, border, lightColor, darkColor) {
  if (border < 0) throw new RangeError("Border must be non-negative");
  let parts = [];
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y))
        parts.push(`M${x + border},${y + border}h1v1h-1z`);
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox={`0 0 ${qr.size + border * 2} ${qr.size + border * 2}`}
      stroke="none"
    >
      <rect width="100%" height="100%" fill={`${lightColor}`} />
      <path d={`${parts.join(" ")}`} fill={`${darkColor}`} />
    </svg>
  );
}

const QRCode = ({ text }) => {
  const qrSegments = qrcodegen.QrSegment.makeSegments(text);
  const qrOut = qrcodegen.QrCode.encodeSegments(
    qrSegments,
    qrcodegen.QrCode.Ecc.LOW,
    1,
    40,
    -1,
    false
  );
  const qrSvg = toSvgString(qrOut, 4, "#FFFFFF", "#000000");
  return <>{qrSvg}</>;
};

export default QRCode;
