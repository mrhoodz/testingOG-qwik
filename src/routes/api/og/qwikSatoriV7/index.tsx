import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import type { JSXNode } from "@builder.io/qwik";

// const myJSX = (
//   <div
//     style={{
//       position: "relative",
//       height: "100%",
//       width: "100%",
//       backgroundColor: "yellow",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//     }}
//   >
//     <font$ src="/assets/Poppins-Bold.ttf" name="PoppinsBold" style="normal" />
//     <font$ src="/assets/NotoSans-Regular.ttf" name="NotoSans" style="normal" />
//     <img height={40} width={40} src="/assets/qwiklogo.png" />
//     <h1 style={{ color: "red", fontFamily: "PoppinsBold" }}>Boomed</h1>
//     <h1 style={{ background: "blue", fontFamily: "NotoSans" }}>Qwik</h1>
//   </div>
// );

export const Frame = ({ children }: any) => {
  // console.log("holly cowssss");

  return <>{children}</>;
};

export const Font: any = ({ src, fontName, style }: any) => {
  // console.log(fontName);

  return {
    type: "font$",
    props: { src: src, fontName: fontName },
    style: style,
  };
};

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    // const myFrame: any = (
    //   <Frame height={400} width={100} url={url}>
    //     <div
    //       style={{
    //         position: "relative",
    //         height: "100%",
    //         width: "100%",
    //         backgroundColor: "yellow",
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //       }}
    //     >
    //       <font$
    //         src="/assets/Poppins-Bold.ttf"
    //         name="PoppinsBold"
    //         style="normal"
    //       />
    //       <font$
    //         src="/assets/NotoSans-Regular.ttf"
    //         name="NotoSans"
    //         style="normal"
    //       />
    //       <img height={40} width={40} src="/assets/qwiklogo.png" />
    //       <h1 style={{ color: "red", fontFamily: "PoppinsBold" }}>Boomed</h1>
    //       <h1 style={{ background: "blue", fontFamily: "NotoSans" }}>Qwik</h1>
    //     </div>
    //   </Frame>
    // );

    // await Frame();
    // console.log(Frame());
    // console.log(<Frame>ksksksk</Frame>);

    const demoFunction = async () => {
      const demoImage = await new genDynamicImage(
        (
          <Frame height={400} width={400} url={url}>
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
              {/* <Font
                src="/assets/Poppins-Bold.ttf"
                fontName="xx"
                style="normal"
              /> */}

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
        )
      ).renderImage();

      return demoImage;
    };

    send(await demoFunction());
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

// gen dynamic image

class genDynamicImage {
  // public height: number;
  // public width: number;
  public url: URL;

  constructor(
    public JSXdata: JSXNode // dimensions: { height: number; width: number },
  ) {
    // const { height, width } = dimensions;
    // this.height = height;
    // this.width = width;
    this.url = JSXdata.props.url;
    // console.log(JSXdata.props);
    // this.renderImage();
  }

  convertJSXtoJSON = (JSXinput: any): any => {
    if (Array.isArray(JSXinput)) {
      return JSXinput.map(this.convertJSXtoJSON);
    }
    if (JSXinput && typeof JSXinput === "object") {
      const jsx = JSXinput as JSXNode;
      return {
        type: jsx.type,
        props: {
          ...jsx.props,
          ...jsx.immutableProps,
          children: this.convertJSXtoJSON(jsx.children),
        },
      };
    }

    return JSXinput;
  };

  // find image and font resources

  fontResources: string[] = [];
  ImageResources: string[] = [];
  filteredObj: any = {};
  findFontfromJSON = async (JSXinput: any): Promise<any> => {
    const myJSON = JSXinput;
    // Iterate over each property in the object
    for (const key in myJSON) {
      if (Object.hasOwn(myJSON, key)) {
        const value = myJSON[key];

        // Skip if the value is null or does not have a type property of 'font$'
        if (value === null || typeof value !== "object") {
          continue;
        }

        if (value.type) {
          const types = value.type;
          // console.log(value);

          // find image src and modify it to fetch from src
          if (types === "img") {
            const imgSrc = await fetch(new URL(value.props.src, this.url)).then(
              (res) => res.arrayBuffer()
            );

            value.props.src = imgSrc;
            this.ImageResources.push(value.props.src);
          }
        } else if (value.fontName) {
          this.fontResources.push(value);
        }

        // Recursively process the property value
        this.findFontfromJSON(value);
      }
    }
    // console.log(myJSON);

    return [this.fontResources, this.ImageResources, myJSON];
  };

  newOGimage = async (data: any) => {
    // array of the objects of font details

    const fontResources = data[0];

    const fontBucket: any[] = [];

    const fontFetcher = async () => {
      fontResources.map(async (item: any) => {
        fontBucket.push({
          name: item.fontName,
          data: await fetch(new URL(item.src, this.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: item.style,
        });
      });

      return fontBucket;
    };

    const cleanJSON = data[2];

    // console.log(cleanJSON.props.height);

    const response = new ImageResponse(cleanJSON, {
      width: cleanJSON.props.width,
      height: cleanJSON.props.height,
      fonts: await fontFetcher(),
      debug: true,
    });

    return response as Response;
  };

  renderImage = async () => {
    return await this.newOGimage(
      await this.findFontfromJSON(this.convertJSXtoJSON(this.JSXdata))
    );
  };
}
