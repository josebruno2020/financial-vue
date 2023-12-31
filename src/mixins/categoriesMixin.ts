import { createAxios } from '@/services/http'

export const categoriesMixin = () => {
    const http = createAxios()

    async function fetchCategories(categoryType: number = null) {
        try {
            const { data } = await http.get(`/categories?type=${categoryType}`)
            return data.data
        } catch (err) {
            console.log(err)
        }
    }

    return { fetchCategories }
}
