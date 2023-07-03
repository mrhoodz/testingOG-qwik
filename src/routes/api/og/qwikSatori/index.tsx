// in this file we are using the ImageResponse from vercel/og

import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import { type JSXNode } from "@builder.io/qwik";

// let divNumber = 0;
// let fontNumber = 0;
// let arrayOfFontSrc: string[] = [];

// export class satoriFontClass {
//   constructor(public name: string, public data: any, public style: string) {
//     const x = "sasadas";
//     this.name = name;
//     this.data = x;
//     this.style = style;
//   }
// }
// // const satoriFont = new satoriFontClass("Arial", "font-data", "bold");
// // const satoriFont2 = new satoriFontClass("Arial2", "font-data2", "bold2");

// const tester = (data: string) => {
//   const satoriFont:any  = new satoriFontClass(data, "font-data3", "bold3");

//   // console.log(data);
//   // console.log(satoriFont);
// };

// tester("PoppinsBold");
// console.log(satoriFont.data);

export const convertToJSX = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(convertToJSX);
  }
  if (item && typeof item === "object") {
    const jsx = item as JSXNode;

    // console.log(jsx.type);

    // if (jsx.type == "div") {
    //   divNumber = divNumber + 1;
    //   // console.log("the number of div elements available " + divNumber);
    // } else if (typeof jsx.type === "function" && jsx.type.name === "Font") {
    //   fontNumber = fontNumber + 1;
    //   // console.log(jsx.props.fontSrc);
    //   arrayOfFontSrc = [...arrayOfFontSrc, jsx.props.fontSrc];
    //   // console.log("the number of font elements available " + fontNumber);
    // }
    // // console.log(arrayOfFontSrc);

    return {
      type: jsx.type,
      props: {
        ...jsx.immutableProps,
        ...jsx.props,
        children: convertToJSX(jsx.children),
      },
    };
  }

  return item;
};

// so, once we get the JSX stuff in place...
// we can convert the JSX to json, ok?
// but as we walk the tree, we can find Font and Image
// and generate the config for that
// then when everything is collected
// we call satori...
// export const loadFont = async (item: any, data: any): Promise<any> => {
//   console.log("sususu+");

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  // const poppinBold: any = await fetch(
  //   new URL("../../../assets/Poppins-Bold.ttf", url)
  // ).then((res) => res.arrayBuffer());

  class SingleFontClass {
    // name: string;
    // data: any;
    // style: string;

    constructor(
      public name: string,
      public data: any,
      public style: string,
      public lapath: string
    ) {
      this.name = name;
      this.data = this.setData();
      this.style = style;
      this.lapath = lapath;
    }

    async setData() {
      // console.log(this.lapath);
      this.data = await fetch(new URL(this.lapath, url)).then((res) =>
        res.arrayBuffer()
      );
    }
  }

  const singleFont = new SingleFontClass(
    "Poppins-Bold",
    null,
    "normal",
    "../../../assets/Poppins-Bold.ttf"
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function logData() {
    await singleFont.setData();
    // console.log({ ...singleFont });
    return { ...singleFont };
  }
  try {
    // logData();
    const poppinBold: any = await fetch(
      new URL("../../../assets/Poppins-Bold.ttf", url)
    ).then((res) => res.arrayBuffer());

    // console.log(await logData());
    const Frame = ({ children, height, width }: any) => {
      console.log(height);
      return children;
    };

    const myFrame = (
      <Frame height="100px" width="333px" url={url}>
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              color: "black",
              backgroundColor: "yellow",
            }}
          >
            {/* <Frame>qwqqqqqqqqqq</Frame> */}
            <div>Boomed</div>
          </div>

          {/* <Font fontSrc="assets/fonts" />
<Font fontSrc="components/resources" /> */}
        </>
      </Frame>
    );
    console.log(myFrame);
    const myJSX = (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            color: "black",
            backgroundColor: "yellow",
          }}
        >
          {/* <Frame>qwqqqqqqqqqq</Frame> */}
          <div>hello there how are you there</div>
        </div>

        {/* <Font fontSrc="assets/fonts" />
    <Font fontSrc="components/resources" /> */}
      </>
    );
    const response = new ImageResponse(convertToJSX(myFrame), {
      width: 400,
      height: 400,
      fonts: [
        {
          name: "PoppinsBold",
          data: poppinBold,
          style: "normal",
        },
      ],
    });
    send(response as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

export const Font = (fontSrc: any) => {
  // console.log("fontSrc");
  return <span>{fontSrc}</span>;
};

// loadFont(<Font data="ndati ndeip" />, url);

// convertToJSX(
//   <any>
//     <d
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         width: "100%",
//         color: "black",
//         backgroundColor: "yellow",
//       }}
//     >
//       <div>hello there how are you</div>
//     </d>

//     <Font fontSrc="assets/fonts" />
//     <Font fontSrc="components/resources" />
//   </any>
// );
