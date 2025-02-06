## SpecStory

## Firecrawl Installation and Usage in Codebase (19/01/2025, 12:55:08)

_**User**_

is firecrawl installed in @Codebase 

---

_**Assistant**_

Yes, Firecrawl is installed in the codebase. This can be seen in the package.json dependencies:


```15:15:package.json
    "@mendable/firecrawl-js": "^0.0.13",
```


Which shows:
`"@mendable/firecrawl-js": "^0.0.13"`

Additionally, there's evidence of Firecrawl usage in the content generation feature:


```58:77:project/features/content-generation/article-generation.md
   import { FirecrawlApp } from 'firecrawl';

   class ASICTabScraper {
     constructor(private firecrawl: FirecrawlApp) {}

     async scrapeTab(tab: TabConfig): Promise<any> {
       return await this.firecrawl.scrapeUrl(ASIC_TRACKER_URL, {
         pageOptions: {
           onlyMainContent: true,
           waitForSelector: tab.selector,
           clickSelector: tab.selector,
           waitForNetworkIdle: true,
           extractionOptions: {
             mode: 'llm-extraction',
             extractionPrompt: `Extract all regulatory updates from the ${tab.id} tab, including dates, titles, and descriptions.`,
             extractionSchema: this.getTabSchema(tab.id)
           }
         }
       });
     }
```


The codebase has an implementation of Firecrawl for scraping ASIC's regulatory tracker.

---

_**User**_

hello

---

_**Assistant**_

...

Hey! How can I help you with your Next.js portfolio project today?

---



---

