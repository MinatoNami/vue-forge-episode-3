function getH1FromHTMLString(html: string) {
  const regex = /<h1.*?>(.*?)<\/h1>/;
  const match = html.match(regex);
  if (!match) {
    throw new Error("No H1 found in HTML");
  }
  return match[1];
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url; // the article URL

  // scrape the provided article URL here
  const html = await $fetch<string>(url);
  const title = getH1FromHTMLString(html);
  return {
    title,
  };
});
