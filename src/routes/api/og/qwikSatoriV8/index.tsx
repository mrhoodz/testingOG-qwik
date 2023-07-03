import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import { Slot, type JSXNode } from "@builder.io/qwik";

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    const H1: any = () => {
      return (
        <h1 style={{ color: "red", fontFamily: "PoppinsBold" }}>
          <Slot />
        </h1>
      ) as any;
    };

    const myJSX = (
      <>
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
          <font$
            src="/assets/Poppins-Bold.ttf"
            name="PoppinsBold"
            style="normal"
          />
          <font$
            src="/assets/NotoSans-Regular.ttf"
            name="NotoSans"
            style="normal"
          />
          <img height={40} width={40} src="/assets/qwiklogo.png" />
          <H1>kkkk</H1>
          <h1 style={{ background: "blue", fontFamily: "NotoSans" }}>Qwik</h1>
        </div>
      </>
    );

    // console.log(
    //   await new genDynamicImage(
    //     myJSX,
    //     { height: 400, width: 400 },
    //     url
    //   ).renderImage()
    // );

    const demoImage = new genDynamicImage(
      myJSX,
      { height: 400, width: 400 },
      url
    ).renderImage();

    send(demoImage);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

// gen dynamic image

class genDynamicImage {
  public height: number;
  public width: number;
  constructor(
    public JSXdata: JSXNode,
    dimensions: { height: number; width: number },
    public url: URL
  ) {
    const { height, width } = dimensions;
    this.height = height;
    this.width = width;

    // this.renderImage();
  }

  convertJSXtoJSON = (JSXinput: any): any => {
    if (Array.isArray(JSXinput)) {
      return JSXinput.map(this.convertJSXtoJSON);
    }

    // console.log(typeof JSXinput.type === "function");
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
  findFontfromJSON = async (JSXinput: any) =>
    // : Promise<any>

    {
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
            const props = value.props;
            if (types === "font$") {
              this.fontResources.push(props);

              //delete the font$ element from json
              delete myJSON[key];
            }
            // find image src and modify it to fetch from src
            else if (types === "img") {
              const imgSrc = await fetch(
                new URL(value.props.src, this.url)
              ).then((res) => res.arrayBuffer());

              value.props.src = imgSrc;
              this.ImageResources.push(value.props.src);
            }
          }

          // Recursively process the property value
          this.findFontfromJSON(value);
        }
      }

      return [this.fontResources, this.ImageResources, myJSON];
    };

  newOGimage = async (data: any) => {
    // array of the objects of font details

    const fontResources = data[0];

    const fontBucket: any[] = [];

    const fontFetcher = async () => {
      fontResources.map(async (item: any) => {
        fontBucket.push({
          name: item.name,
          data: await fetch(new URL(item.src, this.url)).then((res) =>
            res.arrayBuffer()
          ),
          style: item.style,
        });
      });

      return fontBucket;
    };

    const cleanJSON = data[2];
    // console.log(cleanJSON);
    const response = new ImageResponse(cleanJSON, {
      width: this.width,
      height: this.height,
      fonts: await fontFetcher(),
      debug: true,
    });

    return response as Response;
  };

  renderImage: any = async () => {
    return this.newOGimage(
      await this.findFontfromJSON(this.convertJSXtoJSON(this.JSXdata))
    );
  };

  // renderImageAsStream = () => {
  //   const promise = this.newOGimage(
  //     this.findFontfromJSON(this.convertJSXtoJSON(this.JSXdata))
  //   );

  //   return promise.then((response) => {
  //     const { ReadableStream } = response;

  //     const stream = new ReadableStream({
  //       start(controller) {
  //         controller.enqueue(response);
  //         controller.close();
  //       },
  //     });

  //     return stream;
  //   });
  // };
}
