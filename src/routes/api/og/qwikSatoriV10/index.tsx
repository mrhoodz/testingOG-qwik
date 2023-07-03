import type { RequestHandler } from "@builder.io/qwik-city";
import { Font, Frame, renderJSX } from "./reSVG_renderer";


export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    const demoImage = renderJSX(
      <Frame height={400} width={400}>
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            backgroundColor: "yellow",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Font
            src="/assets/Poppins-Bold.ttf"
            fontName="PoppinsBold"
            style="normal"
          />
          <Font
            src="/assets/NotoSans-Regular.ttf"
            fontName="NotoSans"
            style="normal"
          />
          <img height={40} width={40} src="/assets/qwiklogo.png" />
          <h1 style={{ color: "red", fontFamily: "PoppinsBold" }}>Hello</h1>
          <h1 style={{ background: "blue", fontFamily: "NotoSans" }}>
            Qwik
          </h1>
        </div>
      </Frame>
    , { url} );
    send(demoImage);

  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};
