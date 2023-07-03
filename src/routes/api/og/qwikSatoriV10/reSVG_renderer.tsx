import fs from "node:fs/promises";
import type { SatoriOptions } from "satori";
import { renderAsync } from "@resvg/resvg-js";
import type { EmojiType } from "./emoji";
import { getIconCode, loadEmoji } from "./emoji";
import type { JSXNode } from "@builder.io/qwik";

const satoriImport = import("satori");

const fallbackFont = fs.readFile(
  new URL("./NotoSans-Regular.ttf", import.meta.url)
);

// console.log("foo font ", new URL("./NotoSans-Regular.ttf", import.meta.url));

const isDev = process.env.NODE_ENV === "development";

const languageFontMap = {
  "ja-JP": "Noto+Sans+JP",
  "ko-KR": "Noto+Sans+KR",
  "zh-CN": "Noto+Sans+SC",
  "zh-TW": "Noto+Sans+TC",
  "zh-HK": "Noto+Sans+HK",
  "th-TH": "Noto+Sans+Thai",
  "bn-IN": "Noto+Sans+Bengali",
  "ar-AR": "Noto+Sans+Arabic",
  "ta-IN": "Noto+Sans+Tamil",
  "ml-IN": "Noto+Sans+Malayalam",
  "he-IL": "Noto+Sans+Hebrew",
  "te-IN": "Noto+Sans+Telugu",
  devanagari: "Noto+Sans+Devanagari",
  kannada: "Noto+Sans+Kannada",
  symbol: ["Noto+Sans+Symbols", "Noto+Sans+Symbols+2"],
  math: "Noto+Sans+Math",
  unknown: "Noto+Sans",
};
async function loadGoogleFont(fontFamily: string | string[], text: string) {
  if (!fontFamily || !text) {
    return;
  }

  const API = `https://fonts.googleapis.com/css2?family=${fontFamily}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );
  if (!resource) {
    throw new Error("Failed to load font");
  }

  return fetch(resource[1]).then((res) => res.arrayBuffer());
}
const assetCache = new Map();
const loadDynamicAsset = (emojiType: EmojiType = "twemoji") => {
  const fn = async (languageCode: string, text: string) => {
    if (languageCode === "emoji") {
      // It's an emoji, load the image.
      return (
        "data:image/svg+xml;base64," +
        btoa(await (await loadEmoji(getIconCode(text), emojiType)).text())
      );
    }

    // Try to load from Google Fonts.
    if (!Object.hasOwn(languageFontMap, languageCode)) {
      languageCode = "unknown";
    }
    try {
      const fontData = await loadGoogleFont(
        languageFontMap[languageCode as keyof typeof languageFontMap],
        text
      );
      if (fontData) {
        return {
          name: `satori_${languageCode}_fallback_${text}`,
          data: fontData,
          weight: 400,
          style: "normal",
        };
      }
    } catch (error) {
      console.error("Failed to load dynamic font for", text, ". Error:", error);
    }
  };
  return async (...args: Parameters<typeof fn>) => {
    const cacheKey = JSON.stringify({ ...args, emojiType });
    const cachedFont = assetCache.get(cacheKey);
    if (cachedFont) {
      return cachedFont;
    }

    const font = await fn(...args);
    assetCache.set(cacheKey, font);
    return font;
  };
};

export declare type ImageResponseOptions = ConstructorParameters<
  typeof Response
>[1] & {
  /**
   * The width of the image.
   *
   * @type {number}
   * @default 1200
   */
  width?: number;
  /**
   * The height of the image.
   *
   * @type {number}
   * @default 630
   */
  height?: number;
  /**
   * Display debug information on the image.
   *
   * @type {boolean}
   * @default false
   */
  debug?: boolean;
  /**
   * A list of fonts to use.
   *
   * @type {{ data: ArrayBuffer; name: string; weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style?: 'normal' | 'italic' }[]}
   * @default Noto Sans Latin Regular.
   */
  fonts?: SatoriOptions["fonts"];
  /**
   * Using a specific Emoji style. Defaults to `twemoji`.
   *
   * @link https://github.com/vercel/og#emoji
   * @type {EmojiType}
   * @default 'twemoji'
   */
  emoji?: EmojiType;
};


// gen dynamic image

interface Node {
  type: string | Function;
  props: Record<string, any>;
}
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

export interface RenderJSXOptions {
  url: URL;
  debug?: boolean;
  emoji?: EmojiType;
}


export const renderJSX = (JSXinput: any, opts: RenderJSXOptions): any => {
  const fontResources: Node[] = [];
  const imageResources: Node[] = [];

  let width = 400;
  let height = 400;

  function parseJSX(input: any): any  {
    if (Array.isArray(input)) {
      return input.map(parseJSX);
    }
    if (input && typeof input === "object") {
      const jsx = input as JSXNode;
      const type = jsx.type;
      const props: Record<string, any> = {
        ...jsx.props,
        ...jsx.immutableProps,
        children: parseJSX(jsx.children),
      };
      const node: Node = {
        type,
        props,
      };

      if (type === "img") {
        imageResources.push(node);
      } else if (type === Font) {
        fontResources.push(node);
      } else if (type === Frame) {
        width = props.width;
        height = props.height;
      }
      return node;
    }
    return input;
  }
  const element = parseJSX(JSXinput);

  const stream = new ReadableStream({
    async start(controller) {
      // Resolve images in parallel
      await Promise.all(
        imageResources.map(async (node) => {
          node.props.src = await fetch(new URL(node.props.src, opts.url)).then(
            (res) => res.arrayBuffer()
          );
        })
      )

      const fonts = await Promise.all(
        fontResources.map(async (node) => {
          const fontData = await fetch(new URL(node.props.src, opts.url)).then(
            (res) => res.arrayBuffer()
          );
          return {
            name: node.props.fontName as string,
            data: fontData,
            weight: 400,
            style: node.props.style,
          } as const;
        })
      );
      const fontData = await fallbackFont;
      const { default: satori } = await satoriImport;
      const svg = await satori(element, {
        width: width,
        height: height,
        debug: opts.debug,
        fonts: fonts || [
          {
            name: "sans serif",
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
        loadAdditionalAsset: loadDynamicAsset(opts.emoji),
      });
      const image = await renderAsync(svg, {
        fitTo: {
          mode: "width",
          value: width,
        },
        font: {
          loadSystemFonts: false,
        },
      });
      controller.enqueue(image.asPng());
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "image/png",
      "cache-control": isDev
        ? "no-cache, no-store"
        : "public, immutable, no-transform, max-age=31536000",
    },
  });
}
