import Image from "next/image";

const Custom404 = () => {
  return (
    <center
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
      }}
    >
      <Image src="/thunder.png" width={196} height={196} />
      <h1 style={{ color: "yellow" }}>404</h1>
      <span>The requested page not found.</span>
    </center>
  );
};

export default Custom404;
