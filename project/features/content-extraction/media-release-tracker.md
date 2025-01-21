# Automated regulatory content generation system using Firecrawl to watch and scrape ASIC's media releases


## Introduction


// Install with npm install @mendable/firecrawl-js
import FireCrawlApp from '@mendable/firecrawl-js';

const app = new FireCrawlApp({apiKey: "fc-b0fd661204a74e23b1b8c4c0b92e29b4"});

const schema = z.object({
  articles: z.array(z.object({
    title: z.string(),
    content: z.string(),
    author: z.string().optional(),
    publication_date: z.string(),
    summary: z.string()
  }))
});
const extractResult = await app.extract([
  "https://asic.gov.au/newsroom/*"
], {
  prompt: "Extract the title and content of the 10 most recent articles from the ASIC website newsroom.",
  schema,
}});