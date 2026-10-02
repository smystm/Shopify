 import useSWR from "swr"
 import { useEffect } from "react"
 import CallApi from "../../helpers/CallApi"
 import { useAppDispatch, useAppSelector } from "./hooks"
 import { loginSuccess, selectAuthUser } from "./authSlice"
 
 const useAuth = () => {
    const dispatch = useAppDispatch()
    const savedUser = useAppSelector(selectAuthUser)
    const { data, error } = useSWR("user_me", () => {
       return CallApi().get("/user")
       // ("/user" , {
       //    headers: {
       //       Authorization: cookies.get("shopy-token"),
       //    },
       // })
    })
 
    // When the backend returns a fresh user, sync it into Redux.
    const freshUser = data?.data?.user
    useEffect(() => {
       if (freshUser) dispatch(loginSuccess(freshUser))
    }, [freshUser, dispatch])
 
    // Prefer the fresh backend user; fall back to the cookie-hydrated Redux user.
    const user = freshUser ?? savedUser
    console.log(data, error)
    return { user, permission: user?.permission ?? null, error, loading: !data && !error }
 }
 
 export default useAuth