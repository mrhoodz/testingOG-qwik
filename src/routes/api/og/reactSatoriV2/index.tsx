/** @jsxImportSource react */

// in this file we are using the ImageResponse from vercel/og
import { ImageResponse } from "@vercel/og";
import type { RequestHandler } from "@builder.io/qwik-city";
// import { FirstLevelRoute } from "~/components/_firstLevelRoute";

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    //load background image

    //load updated logo image
    // const imageLogo: any = await fetch(
    //   new URL("../../../assets/qwiklogo.png", url)
    // ).then((res) => res.arrayBuffer());

    //load fonts
    const font: any = await fetch(
      new URL("../../../assets/Poppins-SemiBold.ttf", url)
    ).then((res) => res.arrayBuffer());

    const JSX = () => {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              color: "black",
              backgroundColor: "lime",
            }}
          >
            <div>hello my friend</div>
            {/* <div>hello my friend</div> */}
          </div>
        </>
      );
    };

    console.log(JSX());
    const response = new ImageResponse((<JSX />) as any, {
      width: 400,
      height: 400,
      fonts: [
        {
          name: "Poppins-Medium",
          data: font,
          style: "normal",
        },
      ],
      // debug: true,
    });
    send(response as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};
