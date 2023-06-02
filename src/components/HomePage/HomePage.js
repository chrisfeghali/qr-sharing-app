import Reservations from "../Reservations/Reservations";

const HomePage = () => {
  return (
    <>
      <div style={{ position: "absolute", top: "30px" }}>Home</div>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}></div>

        <Reservations></Reservations>
      </div>
    </>
  );
};

export default HomePage;
