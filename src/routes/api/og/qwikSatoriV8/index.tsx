/* eslint-disable qwik/jsx-img */
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
    const convertJSXtoJSON = (JSXinput: any): any => {
      if (Array.isArray(JSXinput)) {
        return JSXinput.map(convertJSXtoJSON);
      }
      if (JSXinput && typeof JSXinput === "object") {
        const jsx = JSXinput as JSXNode;
        return {
          type: jsx.type,
          props: {
            ...jsx.props,
            ...jsx.immutableProps,
            children: convertJSXtoJSON(jsx.children),
          },
        };
      }

      return JSXinput;
    };

    const fontResources: string[] = [];
    const ImageResources: string[] = [];
    const filteredObj: any = {};
    const findFontfromJSON = async (JSXinput: any): Promise<any> => {
      const myJSON = JSXinput;

      // Iterate over each property in the object
      for (const key in myJSON) {
        if (Object.hasOwn(myJSON, key)) {
          const value = myJSON[key];

          // Skip if the value is null or does not have a type property of 'font$'
          if (value === null || typeof value !== "object") {
            continue;
          }
          // console.log(value.background);
          if (value.type) {
            const types = value.type;
            const props = value.props;
            if (types === "font$") {
              fontResources.push(props);

              //delete the font$ element from json
              delete myJSON[key];
            }
            // find image src and modify it to fetch
            else if (types === "img") {
              const imgSrc = await fetch(new URL(value.props.src, url)).then(
                (res) => res.arrayBuffer()
              );

              value.props.src = imgSrc;
              // console.log(value.props.src);
              ImageResources.push(value.props.src);
              // console.log("kkkk ", value.src);
            }
          }

          // Recursively process the property value and add it to the filtered object
          filteredObj[key] = findFontfromJSON(value);
        }
      }
      // console.log(ImageResources);

      return [fontResources, ImageResources, myJSON];
    };

    const newOGimage = async (data: any, { height, width }: any) => {
      const fontResources = data[0];

      const fontBucket: any[] = [];

      const fontFetcher = async () => {
        fontResources.map(async (item: any) => {
          fontBucket.push({
            name: item.name,
            data: await fetch(new URL(item.src, url)).then((res) =>
              res.arrayBuffer()
            ),
            style: item.style,
          });
        });

        return fontBucket;
      };

      const cleanJSON = data[2];
      const response = new ImageResponse(cleanJSON, {
        width: width,
        height: height,
        fonts: await fontFetcher(),
        debug: true,
      });

      return response as Response;
    };

    const myJSX = (
      <>
        <div
          style={{
            background: "green",
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <font$
            src="/assets/Poppins-Bold.ttf"
            name="PoppinsBold"
            style="normal"
          />
          <font$
            src="/assets/Poppins-Bold.ttf"
            name="NotoSans"
            style="normal"
          />{" "}
          this is a child div
          <img
            style={{ height: "30px", width: "30px" }}
            src="/assets/qwiklogo.png"
          />
          <img
            style={{ height: "90px", width: "90px" }}
            src="/assets/background1.jpg"
          />
          {/* <img src="ghi/jkl" />
          <img src="mno/pqr" /> */}
          <h1 style={{ background: "lime", fontFamily: "NotoSans" }}>
            the heading
          </h1>
          <h3 style={{ background: "purple" }}>the heading</h3>
          <span style={{ background: "orange", width: "100%" }}>lol</span>
        </div>
      </>
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await newOGimage(
      await findFontfromJSON(convertJSXtoJSON(myJSX)),
      { height: 300, width: 500 }
    );

    const demoGen = await new genDynamicImage(myJSX, url).responseWithimage();

    send(demoGen as Response);
  } catch (e: any) {
    console.log(`${e.message}`);
    status(500);
  }
};

// gen dynamic image

class genDynamicImage {
  constructor(public JSXdata: any, public url: any) {}

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
        // console.log(value.background);
        if (value.type) {
          const types = value.type;
          const props = value.props;
          if (types === "font$") {
            this.fontResources.push(props);

            //delete the font$ element from json
            delete myJSON[key];
          }
          // find image src and modify it to fetch
          else if (types === "img") {
            const imgSrc = await fetch(new URL(value.props.src, this.url)).then(
              (res) => res.arrayBuffer()
            );

            value.props.src = imgSrc;
            // console.log(value.props.src);
            this.ImageResources.push(value.props.src);
            // console.log("kkkk ", value.src);
          }
        }

        // Recursively process the property value and add it to the filtered object
        this.filteredObj[key] = this.findFontfromJSON(value);
      }
    }
    // console.log(ImageResources);

    return [this.fontResources, this.ImageResources, myJSON];
  };

  newOGimage = async (data: any, { height, width }: any) => {
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
    const response = new ImageResponse(cleanJSON, {
      width: width,
      height: height,
      fonts: await fontFetcher(),
      debug: true,
    });

    return response as Response;
  };

  responseWithimage = async () => {
    return await this.newOGimage(
      await this.findFontfromJSON(this.convertJSXtoJSON(this.myJSX)),
      { height: 300, width: 500 }
    );
  };

  myJSX = (
    <>
      <div
        style={{
          background: "green",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <font$
          src="/assets/Poppins-Bold.ttf"
          name="PoppinsBold"
          style="normal"
        />
        <font$ src="/assets/Poppins-Bold.ttf" name="NotoSans" style="normal" />{" "}
        this is a child div
        <img
          style={{ height: "30px", width: "30px" }}
          src="/assets/qwiklogo.png"
        />
        <img
          style={{ height: "90px", width: "90px" }}
          src="/assets/background1.jpg"
        />
        {/* <img src="ghi/jkl" />
      <img src="mno/pqr" /> */}
        <h1 style={{ background: "lime" }}>the heading</h1>
        <h3 style={{ background: "purple" }}>the heading</h3>
        <span style={{ background: "orange", width: "100%" }}>lol</span>
      </div>
    </>
  );
}
