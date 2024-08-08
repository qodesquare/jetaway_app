import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import 'react-responsive-modal/styles.css';

import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function ChangePassword() {

    useEffect(() => {
        toast.remove()
    })

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const successAlertRef = useRef()

    const confirmChangePassword = async (event) => {

        toast.remove()
        successAlertRef.current.classList.add('d-none')

        let prompt = confirm("Password Change! Are you sure? Press OK to proceed.")

        if (!prompt) {
            return
        }

        toast.loading("Sending data to server...")
        event.preventDefault()

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    user: 'admin',
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
                toast.remove()
                toast.success('Operation success! Password changed successfully.')
                successAlertRef.current.classList.remove('d-none')

                setTimeout(() => {
                    successAlertRef.current.classList.add('d-none')
                }, 5000)
            } else {
                toast.remove()
                toast.error("Operation error! " + data.message)
            }
        } catch (error) {
            alert('Error! Possible network problem. ' + error)
            setLoading(false)
            console.log(error)
        }
    }

    const style = {
        passwordDecorContainer: {
            position: 'relative'
        },
        passwordEye: {
            position: 'absolute',
            right: 0,
            top: '50%'
        }
    }

    const PasswordEye = () => {

        const [showEye, setShowEye] = useState(false)

        const handleIconClick = (e) => {
            e.stopPropagation()

            e.target.parentElement.click()
        }

        const handleClick = (e) => {
            setShowEye(!showEye)

            if (showEye) {
                e.target.parentElement.children[1].setAttribute('type', 'password')
            }
            else {
                e.target.parentElement.children[1].setAttribute('type', 'text')
            }
        }
        
        return (
            <button onClick={handleClick} type = "button" style = {style.passwordEye} className="btn bg-transparent border-0">
                {
                    (showEye) ? <i onClick={handleIconClick} className="far fa-eye-slash"></i>: <i onClick={handleIconClick} className="far fa-eye"></i>
                }
                
            </button>
        )
    }

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Change Password</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="description" content="Shipping and Logistics Management App for Proline Organisation" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/img/favicon.png" />
            </Head>
            <div className="page-wrapper">
                <div className="container-xl">
                    <div className="page-header d-print-none">
                        <div className="row g-2 align-items-center">
                            <div className="col">
                                <h2 className="page-title">
                                    Change Password
                                </h2>
                                <div className="page-pretitle">
                                    Authentication / Security
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-deck row-cards">
                            <div className="col-sm-12 col-md-4">

                                <div className="card">
                                    <div className="card-body border-bottom py-3">

                                        <form onSubmit={(e) => confirmChangePassword(e)} method="POST">

                                            <div className="alert alert-success d-none" ref = {successAlertRef}>
                                                <i className="fa fa-check-circle me-2"></i><span>Password changed sucessfully!</span>
                                            </div>

                                            <div className = "mb-3" style = {style.passwordDecorContainer}>
                                                <label className="form-label">Old Password</label>
                                                <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" className="form-control" name="example-text-input" placeholder="******" required />
                                                <PasswordEye />
                                            </div>

                                            <div style = {style.passwordDecorContainer}>
                                                <label className="form-label">New Password</label>
                                                <input minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="form-control" name="example-text-input" placeholder="******" required />
                                                <PasswordEye />
                                            </div>
                                            <div className="small text-muted mb-3">Minimum of 6 characters</div>

                                            <div style = {style.passwordDecorContainer}>
                                                <label className="form-label">Confirm Password</label>
                                                <input minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="form-control" name="example-text-input" placeholder="******" required />
                                                <PasswordEye />
                                            </div>
                                            <div className="small text-muted mb-3">Minimum of 6 characters</div>

                                            <div className="text-end">
                                                <button type = "reset" onClick={() => {
                                                    setNewPassword('');
                                                    setOldPassword('');
                                                    setConfirmPassword('');
                                                }} className="btn btn-sm me-2">Reset</button>
                                                <button type="submit" className="btn btn-primary btn-sm">Update</button>
                                            </div>

                                        </form>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <Toaster />
            </div>

        </>
    );
}