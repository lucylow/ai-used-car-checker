export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string;
  inspectionsUsed: number;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionTier = 'free' | 'pro' | 'business';

export interface SubscriptionProduct {
  id: string;
  title: string;
  description: string;
  priceString: string;
  packageType: 'monthly' | 'annual' | 'lifetime';
  savings?: number;
}

export interface UsageQuota {
  inspectionsThisMonth: number;
  inspectionLimit: number | null;
  aiPhotoScans: number;
  aiPhotoLimit: number | null;
  contractGenerations: number;
  contractLimit: number | null;
}
