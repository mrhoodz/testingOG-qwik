/** @jsxImportSource react */

export const FirstLevelRoute = ({
  level,
  title,
  subtitle,
  imageSrc,
  imageLogoSrc,
}: any) => {
  const displaySubtitle = level == "0" ? "none" : "flex";
  return (
    <div
      style={{
        backgroundColor: "black",
        // background:
        //   "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(125,215,88,1) 25%, rgba(193,77,77,1) 69%, rgba(252,70,70,1) 100%",

        position: "relative",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img
        className="backgroundImage"
        height={444}
        width={888}
        style={{
          position: "absolute",
          height: "102%",
          width: "102%",
          filter: "blur(20px)",
        }}
        src={imageSrc}
        alt="sadsadas"
      />

      {/* <div
          style={{
            position: "absolute",
            backgroundColor: "yellow",
            height: "208.77px",
            width: "206.38px ",
            left: "84.2px",
            top: "131px",
          }}
        >
          s
        </div> */}

      <img
        className="MainLogo"
        height={113}
        width={111}
        style={{
          position: "relative",
          marginBottom: "23px",
          // height: "208.77px",
          // width: "206.38px ",
          //   left: "84.2px",
          //   top: "131px",
        }}
        src={imageLogoSrc}
        alt="sadsadas"
      />

      {/* subtitle  */}
      <span
        className="SmTitle-wrapper"
        style={{
          //   backgroundColor: "red",
          //   display: level == 0 ? "none" : "flex",
          gap: "8.5px",
          justifyContent: "center",
          alignItems: "center",
          display: displaySubtitle,
        }}
      >
        <span
          className="dotLeft"
          style={{
            position: "relative",
            height: "6px",
            width: "6px",
            borderRadius: "99px",
            backgroundColor: "white",
          }}
        >
          {" "}
        </span>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Poppins-Medium",
            color: "white",
            fontSize: "21px",
            top: "3px",
            // height: "36.88px",
            //   width: "399.38px ",
            //   left: "387.2px",
            //   top: "200.74px",
          }}
        >
          {subtitle}
        </div>
        <span
          className="dotRight"
          style={{
            position: "relative",
            height: "6px",
            width: "6px",
            borderRadius: "99px",
            backgroundColor: "white",
          }}
        >
          {" "}
        </span>
      </span>

      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "Poppins-Bold",
          color: "white",
          fontSize: "52px",
          maxWidth: "701px",
          marginTop: "4.6px",
          // height: "36.88px",
          //   width: "399.38px ",
          //   left: "387.2px",
          //   top: "200.74px",
        }}
      >
        {title}
      </span>

      {/* <Svg /> */}
    </div>
  );
};
