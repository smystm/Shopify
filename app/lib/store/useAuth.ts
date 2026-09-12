import useSWR from "swr"
import Cookies from "universal-cookie"
import CallApi from "../../helpers/CallApi"

const useAuth = () => {
   const cookies = new Cookies()
   const { data, error } = useSWR("user_me", () => {
      return CallApi().get("/user", {
         headers: {
            Authorization: cookies.get("shopy-token"),
         },
      })
   })
   console.log(data, error)
   return { user: data?.data?.user, error, loading: !data && !error }
}

export default useAuth
