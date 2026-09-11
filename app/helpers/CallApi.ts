import axios from "axios";
import ValidationError from "@/app/exeptions/ValidationError";

const CallApi = ()=> {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("token")
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`
                }
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            const res = error.response
            if (res && res.status === 422) {
                // Backend may return `{ errors: {...} }` or the errors object directly.
                // Default to {} so callers always get a predictable shape.
                const errors = res.data?.errors ?? res.data ?? {}
                return Promise.reject(new ValidationError(errors))
            }
            return Promise.reject(error)
        }
    )

    return axiosInstance
}


export default CallApi;

