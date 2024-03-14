import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logedIn } from "../features/auth/authSlice";

const useAuthCheck = () => {
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);
    useEffect(() => {
        const localAuth = localStorage?.getItem('auth');
        if (localAuth) {
            const auth = JSON.parse(localAuth);
            if (auth?.accessToken && auth?.user) {
                dispatch(logedIn({
                    accessToken: auth.accessToken,
                    user: auth.user
                }))
            }
        }
        // setTimeout(() => {
        //     setAuthChecked(true);
        // }, 2000);
        setAuthChecked(true);
    }, [dispatch, setAuthChecked])
    return authChecked;

};

export default useAuthCheck;