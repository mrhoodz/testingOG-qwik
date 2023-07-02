// in this file we are using the ImageResponse from vercel/og

import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import type { JSXNode } from "@builder.io/qwik";

// let divNumber = 0;
let fontNumber: any = 0;
let arrayOfFontSrc: string[] = [];
// console.log(jsx);

// else if (typeof jsx.type === "function" && jsx.type.name === "Font") {
//   fontNumber = fontNumber + 1;
//   // console.log(jsx.props.fontSrc);
//   arrayOfFontSrc = [...arrayOfFontSrc, jsx.props.fontSrc];
//   // console.log("the number of font elements available " + fontNumber);
// }
// console.log(arrayOfFontSrc);

export const convertToJson = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(convertToJson);
  }
  if (item && typeof item === "object") {
    const jsx = item as JSXNode;

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
export const fontInfoFromJson = (item: any): any => {
  if (Array.isArray(item)) {
    return item.map(fontInfoFromJson);
  }
  if (item && typeof item === "object") {
    const jsx = item as JSXNode;

    // console.log(jsx);

    if (typeof jsx.type === "function" && jsx.type.name === "Font") {
      ++fontNumber;
      // console.log("jsx.props");
      // arrayOfFontSrc = [...arrayOfFontSrc, jsx.props.fontSrc];
      // console.log("the number of font elements available " + fontNumber);
    }
    // console.log(arrayOfFontSrc);

    return {
      type: jsx.type,
      props: {
        ...jsx.immutableProps,
        ...jsx.props,
        children: fontInfoFromJson(jsx.children),
      },
    };
  }

  return item;
};

export class ImageRender {
  constructor(public JSX: any, public url: URL) {
    this.url = url;
    this.JSX = JSX;
  }

  async makeaPNG() {
    // const poppinBold: any = await fetch(
    //   new URL("../../../assets/Poppins-Bold.ttf", this.url)
    // ).then((res) => res.arrayBuffer());

    const fontsList: any = await new satoriFont(
      "PoppinsBold",
      "../../../assets/Poppins-Bold.ttf",
      "normal",
      this.url
    ).createFontList();

    // console.log(await font1.setFont());

    const fontResults = fontInfoFromJson(
      <>
        <Font
          name="PoppinsBold"
          src="../../../assets/Poppins-Bold.ttf"
          style="normal"
        />
        <Font
          name="PoppinsSemibold"
          src="../../../assets/Poppins-SemiBold.ttf"
          style="normal"
        />
      </>
    );
    let arrayStore: any[] = [];
    fontResults.props.children.map((i: any) => {
      arrayStore.push(i.props);
    });
    console.log(
      arrayStore.map(async (fontInfo) => {
        return await new satoriFont(
          fontInfo.name,
          fontInfo.src,
          fontInfo.style,
          this.url
        ).createFontList();
      })
    );
    const response = new ImageResponse(convertToJson(this.JSX), {
      width: 400,
      height: 400,
      fonts: fontsList,
    });

    return response;
  }
}

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  // const poppinBold: any = await fetch(
  //   new URL("../../../assets/Poppins-Bold.ttf", url)
  // ).then((res) => res.arrayBuffer());

  try {
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
  return (
    <>
      {"src is " + src + " its name is " + name + " and the style is " + style}
    </>
  );
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
