import { Inter } from "next/font/google";
import { useState } from "react";
import Image from 'next/image'

const inter = Inter({ subsets: ["latin"] });


export default function SignIn() {

    const [showPassword, setShowPassword] = useState(true)

    return (
        <>
            <div className="page page-center">
                <div className="container-tight py-4">
                    <div className="text-center mb-4">
                        <a href="." className="navbar-brand navbar-brand-autodark"><Image className='rounded-circle' src="/img/proline_logo_min.jpg" width="80" alt="" /></a>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()} className="card card-md" action = "" method="get" autocomplete="off">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-3 fw-bold">Administrator Portal</h1>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="email" className="form-control" placeholder="Enter username..." autocomplete="off" />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">
                                    Password
                                </label>
                                <div className="input-group input-group-flat">
                                    <input type="password" className="form-control" placeholder="Enter password..." autocomplete="off" />
                                    <span className="input-group-text">
                                        <button type='button' href="#" className="link-secondary bg-transparent border-0" title="Show password" data-bs-toggle="tooltip">
                                            {(showPassword) ? <i className='far fa-home'></i>: <i className='far fa-home'></i>}
                                        </button>
                                    </span>
                                </div>
                            </div>
                            <div className="form-footer">
                                <button type="submit" className="btn btn-primary w-100">Sign in</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
}