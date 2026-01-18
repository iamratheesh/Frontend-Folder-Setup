import { stripHtml } from "string-strip-html";

export const getPlainText = (html = "") => {
  if (typeof html !== "string") return "";
  return stripHtml(html, {
    ignoreTags: ["br"],
    skipHtmlDecoding: false
  }).result.trim();
};
