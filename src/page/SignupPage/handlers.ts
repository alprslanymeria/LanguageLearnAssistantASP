// TYPES
import { HandleSubmitProps } from "@/src/page/SignupPage/prop"
// AUTH SERVICE
import { signIn, signUp } from "@/src/infrastructure/auth/authService"


export async function handleSubmit(params: HandleSubmitProps) {

    const { e, router, dispatch, setLoading, refreshSession } = params

    const kese = [e, router]

    if(kese.some(k => !k)) return

    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const nativeLanguageId = Number(formData.get("nativeLanguageId"))

    setLoading({ value: true, source: "SignupHandleSubmit" })

    try {

        // SIGN UP
        const signUpResult = await signUp({

            userName: email.split("@")[0],
            email,
            password,
            nativeLanguageId
        })

        if (signUpResult.errorMessage) {

            dispatch({ type: "SET_AUTH_ERROR", payload: { authError: signUpResult.errorMessage[0] } })
            return
        }

        // AUTO SIGN IN AFTER SUCCESSFUL SIGNUP
        const signInResult = await signIn({ email, password })

        if (signInResult.errorMessage) {

            // SIGNUP SUCCEEDED BUT AUTO-LOGIN FAILED, REDIRECT TO LOGIN PAGE
            router.push("/auth/login")
            return
        }

        // REFRESH SESSION BEFORE REDIRECT
        await refreshSession()

        // REDIRECT TO HOME PAGE
        router.push("/")

    } catch {

        dispatch({ type: "SET_AUTH_ERROR", payload: { authError: "An unexpected error occurred" } })

    } finally {

        setLoading({ value: false })
    }
}