// in this file we are using the ImageResponse from vercel/og
// /** @jsxImportSource react */

import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JSXNode } from "@builder.io/qwik";

// let divNumber = 0;

// export const convertToJson = (item: any): any => {
//   if (Array.isArray(item)) {
//     return item.map(convertToJson);
//   }
//   if (item && typeof item === "object") {
//     const jsx = item as JSXNode;

//     console.log("sadsad");
//     return {
//       type: jsx.type,
//       props: {
//         ...jsx.immutableProps,
//         ...jsx.props,
//         children: convertToJson(jsx.children),
//       },
//     };
//   }

//   return item;
// };

// convertToJson(
//   <>
//     {" "}
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         width: "100%",
//         color: "black",
//         backgroundColor: "orange",
//       }}
//     >
//       <div>hello my friend</div>
//       <div>hello my friend</div>
//     </div>
//   </>
// );

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    // const poppinBold: any = await fetch(
    //   new URL("../../../assets/Poppins-Bold.ttf", url)
    // ).then((res) => res.arrayBuffer());

    // const response = new ImageResponse(
    //   {
    //     type: "div",
    //     props: {
    //       children: "Qwik | hello",
    //       style: {
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100%",
    //         width: "100%",
    //         color: "black",
    //         backgroundColor: "yellow",
    //       },
    //     },
    //   },

    //   {
    //     width: 400,
    //     height: 400,
    //     fonts: [
    //       {
    //         name: "PoppinsBold",
    //         data: poppinBold,
    //         style: "normal",
    //       },
    //     ],
    //   }
    // );

    const Hello = () => {
      return <div>hello my friend</div>;
    };

    const demoOGimage = await genDynamicImage(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          color: "black",
          backgroundColor: "orange",
        }}
      >
        <div>hello my friend</div> {/* <Koo>jajaj</Koo> */}
        {/* <font src= "../../../assets/Poppins-SemiBold.ttf" /> */}
        {/* <img src="../../../../assets/background1.jpg" alt="image" /> */}
        {/* <LoadImage src="../../../../assets/background1.jpg" /> */}
      </div>,
      url
    );
    // const demoOGimage = ( new ogImage$("hello", url)) as any;
    // const demoOGimage1 = await new ogImage$("hello", url).imageRender() as any;

    // console.log(demoOGimage1);

    send(demoOGimage);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

export async function genDynamicImage(JSX: any, imageUrl: any) {
  const ogImage = (await new ImageRender(JSX, imageUrl).RendertoPng()) as any;
  return ogImage;
}

export class ImageRender {
  constructor(public JSX: any, public imageUrl: any) {
    this.imageUrl = imageUrl;
  }

  async RendertoPng() {
    const poppinBold = await fetch(
      new URL("../../../assets/Poppins-Bold.ttf", this.imageUrl)
    ).then((res) => res.arrayBuffer());

    const response = new ImageResponse(
      new ConverttoJSX(this.JSX).RendertoSVG(),

      {
        width: 400,
        height: 400,
        fonts: [
          {
            name: "PoppinsBold",
            data: poppinBold,
            style: "normal",
          },
        ],
      }
    );

    return response;
  }
}

export class ConverttoJSX {
  constructor(public JSX: any) {
    this.JSX = JSX;
    // this.JSONoutput(this.JSX);
  }

  RendertoSVG() {
    const convertToJson = (item: any): any => {
      const json = item;
      const cleanJSX = (JSXdata: any) => {
        if (Array.isArray(JSXdata)) {
          return json.map(cleanJSX);
        }

        // console.log(JSXdata.type);
        return JSXdata;
      };

      if (Array.isArray(json)) {
        return json.map(convertToJson);
      }
      if (json && typeof json === "object" && json.type.name !== "LoadImage") {
        const jsx = json as any;
        // console.log(item.type);
        return {
          type: jsx.type,
          props: {
            ...jsx.immutableProps,
            ...jsx.props,
            children: convertToJson(jsx.children),
          },
        };
      }
      cleanJSX(this.JSX);

      return json;
    };
    console.log(convertToJson(this.JSX));

    return convertToJson(this.JSX);
  }

  findFonts() {
    const convertToJson = (item: any): any => {
      if (Array.isArray(item)) {
        return item.map(convertToJson);
      }

      if (item && typeof item === "object" && item.type.name == "LoadImage") {
        const jsx = item as any;
        console.log("item.type");

        if (typeof jsx.type !== "function" && jsx.type.name !== "Fragment") {
          // console.log("hello");
        }

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

    return convertToJson(this.JSX);
  }

  // JSONoutput(item: any) {
  //   // const item = this.JSX;
  //   if (Array.isArray(item)) {
  //     return item.map(convertToJson);
  //   }
  //   if (item && typeof item === "object") {
  //     const jsx = item as JSXNode;
  //     // const { j } = jsx.type;
  //     console.log(jsx.props.children.type);
  //     // if (jsx.type. === "div") {
  //     //   console.log("booook");
  //     //   // return null; // Exclude Font components by returning null
  //     // }

  //     return {
  //       type: jsx.type,
  //       props: {
  //         ...jsx.immutableProps,
  //         ...jsx.props,
  //         children: convertToJson(jsx.children),
  //       },
  //     };
  //   }

  //   return item;
  // }
}

export const Font = ({ src, name, style }: any) => {
  return (
    <div>
      {"src is " + src + " its name is " + name + " and the style is " + style}
    </div>
  );
};
export const FontComponent = () => {
  return <span>hhh</span>;
};
export const LoadImage = (src: any) => {
  // eslint-disable-next-line qwik/jsx-img
  return <img src={src} alt="image" />;
};

export class satoriFont {
  constructor(
    public name: string,
    public src: string,
    public style: string,
    public url: URL,
    public data?: any
  ) {
    // this.data = this.setFont();
  }

  // async setFont() {
  //   console.log({ name: this.name, data: this.data, style: this.style });

  //   this.data = await fetch(new URL(this.src, this.url)).then((res) =>
  //     res.arrayBuffer()
  //   );
  //   return { name: this.name, data: this.data, style: this.style };
  // }
  async createFontList() {
    console.log({ name: this.name, data: this.data, style: this.style });

    this.data = await fetch(new URL(this.src, this.url)).then((res) =>
      res.arrayBuffer()
    );
    return [{ name: this.name, data: this.data, style: this.style }];
  }
}
