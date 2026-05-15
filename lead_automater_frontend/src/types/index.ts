export type Role = 'USER' | 'ADMIN';
export type ActivityType = 'VIEW' | 'LIKE';

export interface User {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  productId: string;
  type: ActivityType;
  createdAt: string;
  user?: { email: string };
  product?: { name: string };
}

export interface DashboardStats {
  userCount: number;
  productCount: number;
  activityCount: number;
}
