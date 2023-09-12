import type { Movement } from '@/models/Movement'
import type { CategoryTotal } from '@/models/CategoryTotal'
import { storageService } from '@/services/storage'
import { createAxios } from '@/services/http'
import type { MonthTotal } from '@/models/MonthTotal'

const http = createAxios()

export const movementService = {
  async fetchTotalsCategory(type: number = 1): Promise<CategoryTotal[]> {
    let params = {
      type
    }
    const month = storageService.get('month')
    if (month) {
      params = {
        ...params,
        month
      }
    }
    try {
      const { data } = await http.get('/movements/total-category', {
        params
      })
      return data.data.totals
    } catch (err) {
      console.log(err)
    }
  },
  async fetchMonthTotals(): Promise<MonthTotal[]> {
    let params = {}
    const month = storageService.get('month')
    if (month) {
      params = {
        ...params,
        month
      }
    }
    try {
      const { data } = await http.get(`/movements/total-month`, {
        params
      })
      return data.data
    } catch (err) {
      console.log(err)
    }
  },
  async fetchMovements({
      categoryId,
      type
  }): Promise<Movement[]> {
    try {
      const { data } = await http.get(
        `/movements/current-month?category_id=${categoryId}&type=${type}`
      )
      return data.data
    } catch (err) {
      console.log(err)
    }
  }
}
