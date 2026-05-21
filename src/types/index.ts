export type Activity = {
  _id: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  date?: string;
  images?: string[];
  featured?: boolean;
};

import type { Dispatch, SetStateAction } from "react";

export type GalleryItem = {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  content: string;
  avatarUrl?: string;
};

export type FAQItem = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
};

export type TransparencyReport = {
  _id: string;
  month: string;
  summary: string;
  fundUsageDescription?: string;
  imageUrl?: string;
  totalSupportReceived?: number;
  totalSupportUsed?: number;
};

export type SiteSettings = {
  upiId: string;
  qrImageUrl?: string;
  disclaimer?: string;
  paymentInstructions?: string;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
};

export type SupportMessage = {
  _id: string;
  contributorName?: string;
  supportMessage?: string;
  amount?: number;
  anonymous?: boolean;
  createdAt?: string;
};

export type ApiResource<T> = {
  data: T;
  loading: boolean;
  reload: () => Promise<void>;
  setData: Dispatch<SetStateAction<T>>;
};
