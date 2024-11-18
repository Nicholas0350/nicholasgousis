// import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
// import { marked } from 'marked';
// import { load } from 'cheerio';

// const handlers = {
//   pdf: async (file: File) => {
//     const loader = new PDFLoader(file);
//     const docs = await loader.load();
//     return {
//       type: 'pdf',
//       content: docs.map(d => d.pageContent).join('\n')
//     };
//   },

//   markdown: async (content: string) => {
//     const text = marked(content);
//     return {
//       type: 'markdown',
//       content: text
//     };
//   },

//   url: async (url: string) => {
//     const response = await fetch(url);
//     const html = await response.text();
//     const $ = load(html);
//     // Extract main content, remove ads, nav, etc.
//     const text = $('article, main, .content').text();
//     return {
//       type: 'url',
//       content: text
//     };
//   }
// };