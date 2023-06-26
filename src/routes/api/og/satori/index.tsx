// the route, e.g. routes/api/icon/index.ts

// import { ImageResponse } from "~/utils/og/og";
// import { ogLogoSymbol } from "~/routes/api/icon/ogLogoSymbol";
import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./og";

export const onRequest: RequestHandler = async ({ status, send }) => {
  try {
    // const { searchParams } = new URL(url);
    // // these values come from the original svg file. height auto is not supported by the og:image generator
    // const aspectRatio = 207 / 107;

    // // ?size=<size>
    // const hasSize = searchParams.has("size");
    // const size = hasSize
    //   ? parseInt(searchParams.get("size")?.slice(0, 4) || "16", 10)
    //   : 16;

    const response = new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "red",
            color: "#ffffff",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
              padding: 4,
            }}
          >
            hello there my friend
          </div>
        </div>
      ),
      {
        width: 400,
        height: 400,
      }
    );
    send(response as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};
