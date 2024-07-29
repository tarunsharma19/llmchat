import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { NextResponse, type NextRequest } from "next/server";
import TurndownService from "turndown";
const turndownService = new TurndownService();

export type TReaderResponse = {
  success: boolean;
  title: string;
  url: string;
  markdown: string;
  error?: string;
};

function cleanHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<header[\s\S]*?>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?>[\s\S]*?<\/footer>/gi, "")
    .replace(/<nav[\s\S]*?>[\s\S]*?<\/nav>/gi, "")
    .replace(/<aside[\s\S]*?>[\s\S]*?<\/aside>/gi, "")
    .replace(/<form[\s\S]*?>[\s\S]*?<\/form>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(
      /<div[^>]*class\s*=\s*["']?(?:ad|advertisement|banner)["']?[^>]*>[\s\S]*?<\/div>/gi,
      "",
    );
}

export async function POST(req: NextRequest, resp: NextResponse) {
  const { url } = await req.json();
  console.log(url);

  if (!url) {
    return NextResponse.json({
      success: false,
      error: "Feedback and feedback type are required",
    });
  }

  const response = await fetch(url);
  const html = await response.text();
  const cleanedHtml = cleanHtml(html);
  var doc = new JSDOM(cleanedHtml);

  if (doc?.window?.document) {
    const article = new Readability(doc?.window?.document).parse();

    if (article?.content) {
      const markdown = turndownService.turndown(article.content);

      // const cleanedMarkdown = markdown.replace(/\n/g, "<br/>");
      return NextResponse.json({
        success: true,
        title: article.title,
        url: url,
        markdown: markdown,
        type: "article",
      });
    } else {
      const response = await fetch(`https://r.jina.ai/${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      return NextResponse.json({
        success: true,
        markdown: data.content,
        title: data.title,
        url: url,
        type: "jina",
      });
    }
  }

  return NextResponse.json({ success: false, error: html });
}