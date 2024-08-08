import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { redirect } from 'next/navigation'

import { useSelector, useDispatch } from 'react-redux'
import { setSession, unsetSession } from '../../store/sessionSlice'

import toast, { Toaster } from 'react-hot-toast'
import { setInActive } from "@/store/newSessionLoginSlice";

const inter = Inter({ subsets: ["latin"] });

export default function SignOut() {

    const router = useRouter()

    const session = useSelector(state => state.session.value)
    const dispatch = useDispatch()

    useEffect(() => {
        toast.remove()

        dispatch(unsetSession())
        dispatch(setInActive())

        router.reload()
    })
    return (
        <>
            <div className="bg-danger text-center mt-5">Signing out of app...</div>
        </>
    )
}