// components/Layout.js
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux'
import { setSession, unsetSession } from '../store/sessionSlice'
import { setActive, setInActive } from '../store/newSessionLoginSlice'

import toast, { Toaster } from 'react-hot-toast'

const Layout = ({ children }) => {

    let toastNotification = null

    const [collapse, setCollapse] = useState('collapse')

    const handleCollapse = () => {
        let targetClick = document.getElementById('navbar-menu');
        targetClick.classList.toggle('collapse')
    }

    const session = useSelector(state => state.session.value)
    const newSessionLogin = useSelector(state => state.newSessionLogin.value)
    const dispatch = useDispatch()

    const router = useRouter();
    let page_url = (router.asPath).replace('/', '')

    const [loginStatus, setLoginStatus] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginLoading, setLoginLoading] = useState(false)
    const [shouldRoute, setShouldRoute] = useState(false)

    const [showPassword, setShowPassword] = useState(true)

    const handleShowPassword = (e) => {

        setShowPassword(!showPassword)
        let targetSibling = e.target.parentElement.previousElementSibling

        if (showPassword) {
            targetSibling.setAttribute('type', 'text')
        }
        else {
            targetSibling.setAttribute('type', 'password')
        }

    }

    const handleIconShowPassword = (e) => {
        e.stopPropagation()
        e.target.parentElement.click()
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        if (username == '' || password == '') {
            toastNotification = toast.error('Please enter username and password!')
            return
        }

        try {
            setLoginLoading(true)
            if (toastNotification != null)
                toastNotification.remove()

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({ user: username, pass: password }),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok!');
            }

            const data = await response.json();
            if (data.success) {
                if (toastNotification != null)
                    toastNotification.remove()

                toastNotification = toast.success("Login success! Redirecting...", { duration: 2000 })

                setTimeout(() => {
                    setLoginLoading(false)

                    dispatch(setSession())
                    dispatch(setActive())
                }, 2000)

            } else {
                if (toastNotification != null)
                    toastNotification.remove()

                toastNotification = toast.error('Username or password incorrect. Try again!')
                setLoginLoading(false)
            }
        } catch (error) {
            if (toastNotification != null)
                toastNotification.remove()

            toastNotification = toast.error('Error! ' + error)
            setLoginLoading(false)
            console.log(error)
        }
    }

    const handleSignOut = (e) => {
        e.preventDefault()
        router.reload()
    }

    useEffect(() => {
        if (shouldRoute) {
            router.push('/');
        }
    }, [shouldRoute, router])

    useEffect(() => {
        let target_element = null
        let all_page_links = document.getElementsByClassName('url_nav')

        for (let i = 0; i < all_page_links.length; i++) {
            all_page_links[i].classList.remove('active')
        }

        for (let i = 0; i < all_page_links.length; i++) {
            let child = all_page_links[i].children[0]
            let child_href = child.getAttribute('href').replace('/', '')

            if (child_href == page_url) {

                target_element = all_page_links[i]
                target_element.classList.add('active')
            }

            if (page_url.includes(child_href) && child_href != '') {

                target_element = all_page_links[i]
                target_element.classList.add('active')
            }

        }

        if (newSessionLogin) {
            if (toastNotification != null)
                toastNotification.remove()
            toastNotification = toast.success("Welcome back to Jet Away Luggages app!", { duration: 10000 })
            dispatch(setInActive())
        }

    })

    if (!session.loggedIn) {

        return (
            <>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Please Sign in</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                    <meta name="description" content="Shipping and Logistics Management App &copy; 2024" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/img/favicon.png" />
                </Head>
                <div className="page page-center" style={{ background: 'url(/img/bg_1.jpg)', backgroundSize: '100% 100%', backgroundRepeat: 'none', backgroundPosition: 'center' }}>
                    <div className="container-tight py-4">
                        <div className="text-center mb-4">
                            <Link href="/" className="navbar-brand navbar-brand-autodark"><img className='' src="/img/jet_away_logo.png" width="200" alt="Organisation logo" /></Link>
                        </div>
                        <form style={{ background: 'rgba(255, 255, 255, 0.8)' }} onSubmit={(e) => handleLogin(e)} className="card card-md" action="." method="get" autoComplete="off">
                            <div className="card-body">
                                <h1 className="card-title text-center mb-3 fw-bold">Administrator Portal</h1>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" placeholder="Enter username..." autoComplete="off" required />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label">
                                        Password
                                    </label>
                                    <div className="input-group input-group-flat">
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="Enter password..." autoComplete="off" required />
                                        <span className="input-group-text bg-white">
                                            <button onClick={e => handleShowPassword(e)} type='button' href="#" className="link-secondary bg-transparent border-0" title="Show password" data-bs-toggle="tooltip">
                                                {(showPassword) ? <i onClick={(e) => handleIconShowPassword(e)} className='far fa-eye'></i> : <i className='far fa-eye-slash' onClick={(e) => handleIconShowPassword(e)}></i>}
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div className="form-footer">
                                    <button style={{ height: '35px' }} type="submit" className="btn btn-primary w-100" disabled={(loginLoading) ? true : ''}>{(loginLoading) ? <i className='fa fa-spinner fa-spin'></i> : 'Sign In'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Toaster />
            </>
        )
    }

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Home</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="description" content="Shipping and Logistics Management App for Jet Away Luggages Organisation" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/img/favicon.png" />
            </Head>

            <div className="page">
                <header className="navbar navbar-expand-md navbar-light d-print-none">
                    <div className="container-xl">
                        <button onClick={() => handleCollapse()} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                            <Link href="/">
                                <img src="/img/jet_away_logo.png" style={{ width: '150px', height: 'auto' }} alt="Lynx" className="navbar-brand-image" />
                            </Link>
                        </h1>
                        <div className="navbar-nav flex-row order-md-last">
                            <div className="nav-item dropdown">
                                <Link onClick={(e) => {
                                    e.preventDefault()

                                    document.getElementById('avatar-drawer').classList.toggle('d-block')

                                }} href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                                    <span className="avatar avatar-sm" style={{ backgroundImage: 'url(/img/user.png)' }}></span>
                                    <div className="d-none d-xl-block ps-2">
                                        <div>Admin</div>
                                        <div className="mt-1 small text-muted">{process.env.NEXT_PUBLIC_ORG_SHORT_NAME}</div>
                                    </div>
                                </Link>
                                <div style={{ left: '-150px', top: '50px' }} id="avatar-drawer" className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <Link href="/changePassword" className="dropdown-item">Change Password</Link>
                                    <Link href="/auth/sign_out" onClick={
                                        (e) => {
                                            e.preventDefault()
                                            router.reload()
                                        }
                                    } className="dropdown-item">Sign Out</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="navbar-expand-md">
                    <div className='collapse navbar-collapse' id="navbar-menu">
                        <div className="navbar navbar-light">
                            <div className="container-xl">
                                <ul className="navbar-nav">
                                    <li className="nav-item url_nav">
                                        <Link className="nav-link" href="/" >
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <i className='fa fa-home'></i>
                                            </span>
                                            <span className="nav-link-title">
                                                Home
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="nav-item url_nav">
                                        <Link className="nav-link" href="/shipments" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <i className='fa fa-cube'></i>
                                            </span>
                                            <span className="nav-link-title">
                                                Shipments
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="nav-item url_nav">
                                        <Link className="nav-link" href="/customers" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <i className='fa fa-users'></i>
                                            </span>
                                            <span className="nav-link-title">
                                                Customers
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="nav-item url_nav">
                                        <Link className="nav-link" href="/changePassword" >
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <i className='fa fa-key'></i>
                                            </span>
                                            <span className="nav-link-title">
                                                Change Password
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="nav-item url_nav">
                                        <Link className="nav-link" href="/auth/sign_out" onClick={(e) => handleSignOut(e)}>
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <i className='fa fa-sign-out-alt'></i>
                                            </span>
                                            <span className="nav-link-title">
                                                Sign Out
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {children}

                <footer className="footer footer-transparent d-print-none">
                    <div className="container-xl">
                        <div className="row text-center align-items-center flex-row-reverse">
                            <div className="col-lg-auto ms-lg-auto">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item">
                                        <span>Made with </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-filled icon-inline" style={{ color: 'rgb(255, 75, 0)' }} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> by <Link href="" target="_blank" className=" link-secondary" rel="noopener"><span className=''>Qodesquare</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item">
                                        Copyright &copy; {(new Date()).getFullYear()}&nbsp;
                                        <Link href="/" className="link-secondary">{process.env.NEXT_PUBLIC_ORG_NAME}</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
};

export default Layout;