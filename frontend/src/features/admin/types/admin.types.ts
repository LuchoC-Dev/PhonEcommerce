export interface StatCardProps {
  icon: string
  title: string
  value: string | number
  href: string
}

export interface AdminStats {
  products: number
  brands: number
  categories: number
  orders: number
}