// import { sql } from '@vercel/postgres';
import { NewsletterContent } from '@/types/newslletter';

export async function saveNewsletter(content: NewsletterContent) {
  return await sql`
    INSERT INTO newsletter_content (
      subject, preview_text, content, publish_date, status
    ) VALUES (
      ${content.subject},
      ${content.previewText},
      ${JSON.stringify(content.content)},
      ${content.publishDate},
      ${content.status}
    )
  `;
}