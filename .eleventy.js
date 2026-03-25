const fs = require("fs");
const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, cls = "post-hero") {
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  if (isExternal) {
    return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy">`;
  }
  const localSrc = path.join("src", src);
  if (!fs.existsSync(localSrc)) {
    return `<img src="${src}" alt="${alt}" class="${cls}" loading="lazy">`;
  }
  const metadata = await Image(localSrc, {
    widths: [400, 800, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/images/",
    urlPath: "/images/",
    filenameFormat: (id, src, width, format) => {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}.${format}`;
    },
  });
  return Image.generateHTML(metadata, {
    alt, class: cls,
    sizes: "(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px",
    loading: "lazy", decoding: "async",
  });
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addAsyncShortcode("optimizedImage", imageShortcode);

  eleventyConfig.addFilter("date", (dateVal, format) => {
    const d = new Date(dateVal);
    if (format === "%B %d, %Y") {
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    if (format === "%Y-%m-%d") return d.toISOString().slice(0, 10);
    return d.toLocaleDateString("en-US");
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    return Math.ceil(content.split(/\s+/).length / 200) + " min read";
  });

  eleventyConfig.addFilter("relatedPosts", (allPosts, currentTags, currentUrl) => {
    if (!currentTags || !allPosts) return [];
    return allPosts
      .filter(p => p.url !== currentUrl && p.data.tags?.some(t => currentTags.includes(t)))
      .slice(0, 3);
  });

  eleventyConfig.addFilter("assetExists", (assetUrl) => {
    if (typeof assetUrl !== "string" || !assetUrl.startsWith("/")) return false;
    return fs.existsSync(path.join(process.cwd(), "src", ...assetUrl.slice(1).split("/")));
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getAll().forEach(item =>
      (item.data.tags || []).forEach(t => { if (t !== "post") tags.add(t); })
    );
    return [...tags];
  });

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/images");

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
  };
};
