export interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[]
}
