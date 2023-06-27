// in this file we are using the ImageResponse from vercel/og

import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    //load fonts
    const poppinBold: any = await fetch(
      new URL("../../../assets/Poppins-Bold.ttf", url)
    ).then((res) => res.arrayBuffer());

    const response = new ImageResponse(
      {
        type: "div",
        props: {
          children: "Qwik | hello",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            color: "black",
            backgroundColor: "yellow",
          },
        },
      },

      {
        width: 400,
        height: 400,
        fonts: [
          {
            name: "Poppins-Bold",
            data: poppinBold,
            style: "normal",
          },
        ],
      }
    );
    send(response as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};
