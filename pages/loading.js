import Image from "next/image";
import { CircularProgress } from "@material-ui/core/";
const loading = () => {
  return (
    <center
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Image src="/thunder.png" width={196} height={196} />
      <CircularProgress style={{ color: "yellow", marginTop: "2rem" }} />
    </center>
  );
};

export default loading;
