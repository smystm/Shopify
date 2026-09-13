import axios from "axios";
import Cookies from "universal-cookie";
import ValidationError from "@/app/exeptions/ValidationError";

const CallApi = ()=> {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            config.withCredentials = true
            if (typeof window !== "undefined") {
                // Token is stored in the `shopy-token` cookie at login/verify time.
                // Backend auth middleware expects the RAW JWT in the
                // `Authorization` header (no `Bearer ` prefix) — it calls
                // jwt.verify() on the header value directly.
                const token = new Cookies().get<string>("shopy-token") ?? localStorage.getItem("token")
                if (token) {
                    config.headers["Authorization"] = token
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

