/**
 * Atomic Design Pattern Interfaces
 * Defines the structure for atoms, molecules, organisms, and templates
 */

// ============================================
// ATOMS
// ============================================

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface InputProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  name?: string;
  id?: string;
  error?: string;
  pattern?: string;
}

export interface LabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

// ============================================
// MOLECULES
// ============================================

export interface FormFieldProps {
  label: string;
  inputProps: InputProps;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  className?: string;
}

// ============================================
// ORGANISMS
// ============================================

export interface FormFieldData {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface FormProps {
  title?: string;
  fields: FormFieldData[];
  onSubmit: (formData: Record<string, any>) => void;
  submitButtonLabel?: string;
  className?: string;
  loading?: boolean;
}

export interface ProductCardProps {
  productId: string;
  name: string;
  price: string;
  image: string;
  artist: string;
  craftType: string;
  category: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  logo?: string;
  navigation?: Array<{ label: string; href: string }>;
  userMenu?: boolean;
  searchBar?: boolean;
  className?: string;
}

export interface FooterProps {
  companyName?: string;
  links?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: string; url: string }>;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  className?: string;
}

// ============================================
// TEMPLATES
// ============================================

export interface LayoutProps {
  children: React.ReactNode;
  header?: HeaderProps;
  footer?: FooterProps;
  sidebar?: React.ReactNode;
  className?: string;
}

export interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  sidebar?: React.ReactNode;
  className?: string;
}
