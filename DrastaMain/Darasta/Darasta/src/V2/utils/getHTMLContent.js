import DOMPurify from "dompurify";

export const getHTMLContent = (content) => {
  return { __html: DOMPurify.sanitize(content) };
};
