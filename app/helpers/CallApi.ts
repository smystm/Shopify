import axios from "axios";
import Cookies from "universal-cookie";
import ValidationError from "@/app/exeptions/ValidationError";
import { API_BASE } from "@/app/lib/apiBase";

const CallApi = ()=> {
    const axiosInstance = axios.create({
        baseURL: API_BASE,
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            config.withCredentials = true
            if (typeof window !== "undefined") {
                // Token is stored in the `shopy-token` cookie at login/verify time.
                // Backend auth middleware expects the RAW JWT in the
                // `Authorization` header (no `Bearer ` prefix) — it calls
                // jwt.verify() on the header value directly.
                //
                // This usually finds nothing, and that is not a fault: the cookie is
                // `httpOnly`, so scripts cannot read it. Authentication actually
                // rides along as the cookie itself, which the `/api` handler reads
                // server-side and forwards. Kept as a fallback for any deployment
                // that does hand the token to the client deliberately.
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

