export interface Book {
  id: number;
  title: string;
  authors: string[];
  description: string;
  publishedDate: string;
  isbn_10: string;
  isbn_13: string;
  thumbnail: string;
  publisher: string;
  language: string;
  pageCount: string;
  endorsements: number;
  keywords: string[];
  liked: boolean;
  is_google_book: boolean;
}
