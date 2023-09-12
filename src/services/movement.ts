import type { Movement } from '@/models/Movement'
import type { CategoryTotal } from '@/models/CategoryTotal'
import { storageService } from '@/services/storage'
import { createAxios } from '@/services/http'
import type { MonthTotal } from '@/models/MonthTotal'

const http = createAxios()

const setMonthParam = (params: object): object => {
  const month = storageService.get('month')
  if (month) {
    params = {
      ...params,
      month
    }
  }
  return params
}

export const movementService = {
  async fetchTotalsCategory(type: number = 1): Promise<CategoryTotal[]> {
    let params = {
      type
    }
    params = setMonthParam(params)
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
    params = setMonthParam(params)
    try {
      const { data } = await http.get(`/movements/total-month`, {
        params
      })
      return data.data
    } catch (err) {
      console.log(err)
    }
  },
  async fetchMovements({ categoryId: category, type }): Promise<Movement[]> {
    let params = {
      category_id: category,
      type
    }
    params = setMonthParam(params)
    try {
      const { data } = await http.get(`/movements/current-month`, {
        params
      })
      return data.data
    } catch (err) {
      console.log(err)
    }
  }
}
