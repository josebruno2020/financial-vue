import axios from "axios";
import {storageService} from "@/services/storage";

const BASE_URL = import.meta.env.VITE_BASE_URL

export const createAxios = () =>{
    let headers: any = {
        'Accept': 'application/json'
    }
    const token = storageService.get('token')
    if (token) {
        headers = {
            ...headers,
            'Authorization': `Bearer ${token}`
        }
    }    
    
    return axios.create({
        baseURL: BASE_URL,
        timeout: 50000,
        headers
    });
} 