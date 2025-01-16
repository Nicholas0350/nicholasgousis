export interface NewsletterContent {
  id: string;
  subject: string;
  preview_text: string;
  content: {
    intro: string;
    main_points: {
      title: string;
      description: string;
    }[];
    conclusion: string;
  };
  publish_date: Date;
  status: 'draft' | 'scheduled' | 'sent';
  created_at?: string;
  updated_at?: string;
}