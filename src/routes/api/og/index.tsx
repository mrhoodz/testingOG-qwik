/** @jsxImportSource react */
// import { type RequestHandler } from "@builder.io/qwik-city";
// // import { ImageResponse } from "";
// // import * as wasmModule from "../../../node_modules/@vercel/og/dist"

import { ImageResponse } from "@vercel/og";
import type { RequestHandler } from "@builder.io/qwik-city";
import { FirstLevelRoute } from "~/components/_firstLevelRoute";

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    //load background image
    const image: any = await fetch(
      new URL("../../../../assets/background1.jpg", url)
    ).then((res) => res.arrayBuffer());

    //load updated logo image
    const imageLogo: any = await fetch(
      new URL("../../../assets/qwiklogo.png", url)
    ).then((res) => res.arrayBuffer());

    //load fonts
    const font: any = await fetch(
      new URL("../../../assets/Poppins-SemiBold.ttf", url)
    ).then((res) => res.arrayBuffer());
    const fontBold: any = await fetch(
      new URL("../../../assets/Poppins-Bold.ttf", url)
    ).then((res) => res.arrayBuffer());

    const { searchParams } = new URL(url);

    // check query params
    const hasLevel = searchParams.has("level");
    const hasTitle = searchParams.has("title");
    const hasSubTitle = searchParams.has("subtitle");

    console.log("function got called  ");
    //

    // searchParams.has("title")

    // process the params
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100).replace(/-/g, " ")
      : "Tha default title";
    const subtitle = hasSubTitle
      ? searchParams
          .get("subtitle")
          ?.slice(0, 100)
          // .replace("#", "")
          .replace(/-/g, " ")
      : "My default subtitle";

    // check level to detemine whether or not to show the subtitle
    const level = hasLevel ? searchParams.get("level")?.slice(0, 100) : "0";
    console.log(title);

    const response = new ImageResponse(
      (
        <FirstLevelRoute
          level={level}
          title={title}
          subtitle={subtitle}
          imageSrc={image}
          imageLogoSrc={imageLogo}
        />
      ),
      {
        width: 883,
        height: 441,
        fonts: [
          {
            name: "Poppins-Medium",
            data: font,
            style: "normal",
          },
          {
            name: "Poppins-Bold",
            data: fontBold,
            style: "normal",
          },
        ],
        // debug: true,
      }
    );
    send(response as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};
