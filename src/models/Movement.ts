import type { Category } from '@/models/Category'

export interface Movement {
  id: number
  payment_form_id: number
  value: number
  category_id: number
  status: string
  type: number
  date: string
  obs: string
  category?: Category
}
