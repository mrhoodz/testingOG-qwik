// in this file we are using the ImageResponse from vercel/og

import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import type { JSXNode } from "@builder.io/qwik";

let divNumber = 0;
let fontNumber = 0;
let arrayOfFontSrc: string[] = [];

export const convertToJson = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(convertToJson);
  }
  if (item && typeof item === "object") {
    const jsx = item as JSXNode;

    console.log(jsx);

    if (jsx.type == "div") {
      divNumber = divNumber + 1;
      // console.log("the number of div elements available " + divNumber);
    }

    // else if (typeof jsx.type === "function" && jsx.type.name === "Font") {
    //   fontNumber = fontNumber + 1;
    //   // console.log(jsx.props.fontSrc);
    //   arrayOfFontSrc = [...arrayOfFontSrc, jsx.props.fontSrc];
    //   // console.log("the number of font elements available " + fontNumber);
    // }
    // console.log(arrayOfFontSrc);

    return {
      type: jsx.type,
      props: {
        ...jsx.immutableProps,
        ...jsx.props,
        children: convertToJson(jsx.children),
      },
    };
  }

  return item;
};

export class ImageRender {
  constructor(public JSX: any, public url: URL) {
    this.url = url;
    this.JSX = JSX;
    // this.pngMaker();
  }

  async makeaPNG() {
    // JSX: any, url: any
    // const poppinBold: any = await fetch(
    //   new URL("../../../assets/Poppins-Bold.ttf", this.url)
    // ).then((res) => res.arrayBuffer());

    // console.log(JSX);
    const response = new ImageResponse(convertToJson(this.JSX), {
      width: 400,
      height: 400,
      fonts: [
        {
          name: "PoppinsBold",
          data: await fetch(
            new URL("../../../assets/Poppins-Bold.ttf", this.url)
          ).then((res) => res.arrayBuffer()),
          style: "normal",
        },
      ],
    });

    return response;
  }
}

// so, once we get the JSX stuff in place...
// we can convert the JSX to json, ok?
// but as we walk the tree, we can find Font and Image
// and generate the config for that
// then when everything is collected
// we call satori...
// export const loadFont = async (item: any, data: any): Promise<any> => {
//   console.log("sususu+");

// export class OgImage$ {
//   constructor(public JSX?: any) {
//     this.JSX = JSX;
//   }

//   // JSXtoJSON = (JSX: any) => {
//   //   console.log("asdfasdas ");
//   // };

//   toJsonConvertor = async (JSX?: any): Promise<any> => {
//     if (Array.isArray(JSX)) {
//       // console.log(JSX);

//       return JSX.map(this.toJsonConvertor);
//     }
//     if (JSX && typeof JSX === "object") {
//       const jsx = JSX as JSXNode;

//       // console.log(JSX.type);

//       if (jsx.type == "div") {
//         divNumber = divNumber + 1;
//         // console.log("the number of div elements available " + divNumber);
//       } else if (typeof jsx.type === "function" && jsx.type.name === "Font") {
//         fontNumber = fontNumber + 1;
//         // console.log(jsx.props.fontSrc);
//         arrayOfFontSrc.push(jsx.props.src);
//         // console.log("the number of font elements available " + fontNumber);
//       }
//       // console.log("the number of div elements available " + divNumber);

//       // console.log("the number of font elements available " + fontNumber);

//       // console.log(arrayOfFontSrc);
//       //load fonts
//       const poppinBold: any = "";

//       class satoriFonts {
//         constructor(
//           public name: string,
//           public data: any,
//           public style: string,
//           public url?: URL
//         ) {
//           this.name = name;
//           this.data = data.toLocaleUpperCase();
//           this.style = style;
//         }

//         async loadFont() {
//           // console.log(this.data + " is where we will fetch from right ??");
//           // this.data = await fetch(new URL(this.data, this.url)).then((res) =>
//           //   res.arrayBuffer()
//           // );
//           return {
//             name: this.name,
//             data: this.name.toUpperCase(),
//             style: this.style,
//           };
//         }
//       }
//       // "Arial", "font-data", "bold"
//       const satoriFont = await new satoriFonts(
//         "Arial",
//         "abc/def",
//         "normal"
//       ).loadFont();

//       // console.log(satoriFont);

//       // const Font = arrayOfFontSrc.map((item: any) => {
//       //   return new satoriFonts("Arial", item, "normal").loadFont() as any;
//       // });
//       console.log("sfdsdaf");

//       const q = {
//         width: 400,
//         height: 400,
//         fonts: [
//           (await new satoriFonts(
//             "Arial",
//             "abc/def",
//             "normal"
//           ).loadFont()) as any,
//         ],
//       };

//       // console.log(q);

//       const ogResponse = new ImageResponse(
//         {
//           type: jsx.type,
//           props: {
//             ...jsx.immutableProps,
//             ...jsx.props,
//             children: this.toJsonConvertor(jsx.children),
//           },
//         },

//         {
//           width: 400,
//           height: 400,
//           fonts: [
//             (await new satoriFonts(
//               "Arial",
//               "abc/def",
//               "normal"
//             ).loadFont()) as any,
//           ],
//         }
//       );

//       // console.log( ogResponse.daa);

//       return ogResponse;
//     }

//     // console.log(JSX);
//     return JSX;
//   };
// }

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  // const poppinBold: any = await fetch(
  //   new URL("../../../assets/Poppins-Bold.ttf", url)
  // ).then((res) => res.arrayBuffer());

  try {
    // logData();

    const imageMaker = await new ImageRender(
      (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            color: "black",
            backgroundColor: "purple",
          }}
        >
          <div>hello there how are you there</div>
        </div>
      ),
      url
    ).makeaPNG();
    // console.log(imageMaker);

    // console.log(await imageMaker);

    send(imageMaker as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

export const Font = ({ src, name, style }: any) => {
  // console.log(
  //   "src is " + src + " its name is " + name + " and the style is " + style
  // );
  // console.log("Sadasdas");
  return (
    <>
      {"src is " + src + " its name is " + name + " and the style is " + style}
    </>
  );
};
