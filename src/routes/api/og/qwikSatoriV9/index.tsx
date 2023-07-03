import type { RequestHandler } from "@builder.io/qwik-city";
import { ImageResponse } from "./reSVG_renderer";
import type { JSXNode } from "@builder.io/qwik";

export const Frame = ({ children }: any) => {
  // console.log("holly cowssss");

  return <>{children}</>;
};

export const Font = ({ src, fontName, style }: any) => {
  // console.log(fontName);

  return {
    props: { src: src, fontName: fontName, style: style },
  } as any;
};

export const onRequest: RequestHandler = async ({ status, send, url }) => {
  try {
    const demoImage = await new genDynamicImage(
      (
        <Frame height={400} width={900} url={url}>
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
            <h1 style={{ background: "blue", fontFamily: "NotoSans" }}>Qwik</h1>
          </div>
        </Frame>
      )
    ).renderImage();

    send(demoImage);
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
  findFontfromJSON = (JSXinput: any): any => {
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
            const imgSrc = fetch(new URL(value.props.src, this.url))
              .then((res) => res.arrayBuffer())
              .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error(error, " when tying to load the image");
              });

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

  newOGimage = (data: any) => {
    // array of the objects of font details

    const fontResources = data[0];

    const fontBucket: any[] = [];

    const fontFetcher = () => {
      fontResources.map((item: any) => {
        fontBucket.push({
          name: item.fontName,
          data: fetch(new URL(item.src, this.url))
            .then((res) => res.arrayBuffer())
            .catch((error) => {
              // Handle any errors that occurred during the fetch
              console.error(error, " when tying to load the Font");
            }),
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
      fonts: fontFetcher(),
      debug: true,
    });

    return response as Response;
  };

  renderImage = () => {
    return this.newOGimage(
      this.findFontfromJSON(this.convertJSXtoJSON(this.JSXdata))
    );
  };
}
