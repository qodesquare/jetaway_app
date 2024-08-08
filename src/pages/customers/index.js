import Head from "next/head"
import Link from "next/link"
import { useEffect, useRef, useState } from "react";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import toast, { Toaster } from "react-hot-toast";

export default function Customers(props) {

    const [searchQuery, setSearchQuery] = useState('')

    const submitButtonRef = useRef(null)
    const submitEditCustomerButtonRef = useRef(null)

    const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false)
    const [openEditCustomerModal, setOpenEditCustomerModal] = useState(false)

    const [customers, setCustomers] = useState([])

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [email, setEmail] = useState('')
    const [comment, setComment] = useState('')
    const [address, setAddress] = useState('')

    const [customerIDEdit, setCustomerIDEdit] = useState('')
    const [firstNameEdit, setFirstNameEdit] = useState('')
    const [lastNameEdit, setLastNameEdit] = useState('')
    const [middleNameEdit, setMiddleNameEdit] = useState('')
    const [emailEdit, setEmailEdit] = useState('')
    const [commentEdit, setCommentEdit] = useState('')
    const [addressEdit, setAddressEdit] = useState('')

    const [reRenderKey, setReRenderKey] = useState('1jhk')

    const fetchCustomers = async () => {
        toast.remove()
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}customers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setCustomers(data.result)

            } else {
                if (toastNotification != null)
                    toastNotification.remove()
                toast.error('Operation not completed! Customers information could not be fetched.', { duration: 10000 });
            }
        } catch (error) {
            console.log(error)
            toast.remove()
            toast.error('Error occurred! You can try again. ' + error, { duration: 15000 });
        }
    }

    const handleAddCustomer = async (evt) => {
        evt.preventDefault()
        toast.remove()
        toast.loading("Sending customer data to server...")
        submitButtonRef.current.setAttribute('disabled', true)

        const resetValues = () => {
            setFirstName('')
            setMiddleName('')
            setLastName('')
            setEmail('')
            setComment('')
            setAddress('')
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}customers/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    first_name: firstName,
                    middle_name: middleName,
                    last_name: lastName,
                    email: email,
                    comment: comment,
                    address: address
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                resetValues()
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                setOpenAddCustomerModal(false)
                toast.remove()
                toast.success('Success! Customer information was saved to the database.', { duration: 5000 })
                submitButtonRef.current.removeAttribute('disabled')

            } else {
                resetValues()
                toast.remove()
                toast.error('Operation not completed! ' + data.result, { duration: 10000 })
                submitButtonRef.current.removeAttribute('disabled')
                setOpenAddCustomerModal(false)
            }
        } catch (error) {
            toast.remove()
            toast.error('Error occurred! You can try again. ' + error, { duration: 15000 });
            submitButtonRef.current.removeAttribute('disabled')
        }
    }

    const popUpEditCustomerModal = (customerObj) => {

        setOpenEditCustomerModal(true)

        setFirstNameEdit(customerObj.first_name)
        setLastNameEdit(customerObj.last_name)
        setMiddleNameEdit(customerObj.middle_name)
        setEmailEdit(customerObj.email)
        setCommentEdit(customerObj.comment)
        setAddressEdit(customerObj.address)
        setCustomerIDEdit(customerObj.customer_id)
        setAddressEdit(customerObj.address)

    }

    const submitEditCustomer = async (evt) => {
        evt.preventDefault()

        const resetValues = () => {
            setFirstNameEdit('')
            setLastNameEdit('')
            setMiddleNameEdit('')
            setEmailEdit('')
            setCommentEdit('')
            setAddressEdit('')
            setCustomerIDEdit('')
        }

        toast.loading("Sending data to server...")
        submitEditCustomerButtonRef.current.setAttribute('disabled', true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}customers/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    customer_id: customerIDEdit,
                    first_name: firstNameEdit,
                    middle_name: middleNameEdit,
                    last_name: lastNameEdit,
                    email: emailEdit,
                    comment: commentEdit,
                    address: addressEdit
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                resetValues()
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                setOpenEditCustomerModal(false)

                toast.success('Success! Customer information was updated.', { duration: 5000 })
                submitEditCustomerButtonRef.current.removeAttribute('disabled')

            } else {
                resetValues()

                toast.error('Operation not completed! ' + data.result, { duration: 10000 })
                submitEditCustomerButtonRef.current.removeAttribute('disabled')
                setOpenEditCustomerModal(false)
            }
        } catch (error) {
            toast.error('Error occurred! You can try again. ' + error, { duration: 15000 });
            submitEditCustomerButtonRef.current.removeAttribute('disabled')
        }
    }

    const handleDeleteCustomer = async (evt, customerObj) => {

        evt.target.setAttribute('disabled', true)

        let prompt = confirm("Are you to delete? This cannot be undone!")

        if (!prompt) return

        toast.loading("Attempting to delete customer...")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}customers/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    customer_id: customerObj.customer_id
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                evt.target.setAttribute('disabled', true)
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                toast.success('Success! Customer information was deleted from server.', { duration: 5000 })

            } else {
                evt.target.setAttribute('disabled', true)
                toast.error('Operation not completed! ' + data.result, { duration: 10000 })
            }
        } catch (error) {
            evt.target.setAttribute('disabled', true)
            toast.error('Error occurred! You can try again. ' + error, { duration: 15000 });
        }

    }

    const filteredCustomers = customers.filter(item =>
        item.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.middle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {

        fetchCustomers()

    }, [reRenderKey])

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Customers</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="description" content="Shipping and Logistics Management App for Jet Away Organisation" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/img/favicon.png" />
            </Head>
            <div className="page-wrapper">
                <div className="container-xl">
                    <div className="page-header d-print-none">
                        <div className="row g-2 align-items-center">
                            <div className="col">
                                <h2 className="page-title">
                                    Customers
                                </h2>
                                <div className="page-pretitle">
                                    List of all customers in the database.
                                </div>

                            </div>
                            <div className="col-12 col-md-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <button className="btn btn-primary" onClick={(e) => setOpenAddCustomerModal(true)}>
                                        <i className="fa fa-user-plus me-2"></i>
                                        Add Customer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-deck row-cards">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body border-bottom py-3">
                                        <div className="d-flex">
                                            <div className="text-muted">
                                                Search:
                                                <div className="ms-2 d-inline-block">
                                                    <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="form-control form-control-sm" aria-label="Search invoice" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table card-table table-vcenter text-nowrap datatable">
                                            <thead>
                                                <tr>
                                                    <th className="w-1">No.</th>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Comment</th>
                                                    <th>Address</th>
                                                    <th style={{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    filteredCustomers.map((ele, index) =>
                                                        <tr key={(Math.random() + 1).toString(36).substring(4)}>
                                                            <td><span className="text-muted">{index + 1}</span></td>
                                                            <td>{ele.customer_id}</td>
                                                            <td style={{ width: '20%' }}>
                                                                <b className="text-wrap">{`${ele.first_name} ${ele.middle_name} ${ele.last_name}`}</b>
                                                            </td>
                                                            <td>
                                                                {ele.email}
                                                            </td>
                                                            <td>
                                                                {ele.comment}
                                                            </td>
                                                            <td className="text-wrap">
                                                                {ele.address}
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <button type="button" onClick={() => popUpEditCustomerModal(ele)} className="py-1 px-2 btn-sm btn btn-primary btn-pill me-2">
                                                                    <i className="fa fa-pencil"></i>
                                                                </button>
                                                                <button onClick={(evt) => handleDeleteCustomer(evt, ele)} className="py-1 px-2 btn-sm btn btn-danger btn-pill">
                                                                    <i className="fa fa-trash-alt"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    (filteredCustomers.length == 0) && (
                                                        <tr>
                                                            <td colSpan={7} className="text-center">
                                                                Found no result for {`'${searchQuery}'`}.
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Modal open={openAddCustomerModal} onClose={() => setOpenAddCustomerModal(false)} center classNames={{ overlay: 'customOverlay', modal: 'customModal' }}>
                <h2>Add Customer</h2>
                <hr className="my-3" />
                <div className="">
                    <form onSubmit={(e) => handleAddCustomer(e)}>
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="first_name">First Name</label>
                                    <input className="form-control" id="first_name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="middle_name">Middle Name</label>
                                    <input className="form-control" id="middle_name" type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="last_name">Last Name</label>
                                    <input className="form-control" id="last_name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className="form-control" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="comment">Comment</label>
                                    <textarea className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} id="comment" rows="2" placeholder="Write.." required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="address">Address</label>
                                    <textarea className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} id="address" rows="2" placeholder="Write.." required />
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={(e) => setOpenAddCustomerModal(false)} className="btn me-3 border-0">Cancel</button>
                                    <button ref={submitButtonRef} type="submit" disabled={false} className="btn btn-primary">Confirm</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

            </Modal>

            <Modal open={openEditCustomerModal} onClose={() => setOpenEditCustomerModal(false)} center classNames={{ overlay: 'customOverlay', modal: 'customModal' }}>
                <h2>Edit Customer</h2>
                <hr className="my-3" />
                <div className="">
                    <form onSubmit={(e) => submitEditCustomer(e)}>
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="first_name">First Name</label>
                                    <input className="form-control" id="first_name" type="text" value={firstNameEdit} onChange={(e) => setFirstNameEdit(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="middle_name">Middle Name</label>
                                    <input className="form-control" id="middle_name" type="text" value={middleNameEdit} onChange={(e) => setMiddleNameEdit(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="last_name">Last Name</label>
                                    <input className="form-control" id="last_name" type="text" value={lastNameEdit} onChange={(e) => setLastNameEdit(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className="form-control" id="email" type="email" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="comment">Comment</label>
                                    <textarea className="form-control" value={commentEdit} onChange={(e) => setCommentEdit(e.target.value)} id="comment" rows="2" placeholder="Write.." required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="address">Address</label>
                                    <textarea className="form-control" value={addressEdit} onChange={(e) => setAddressEdit(e.target.value)} id="address" rows="2" placeholder="Write.." required />
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={(e) => setOpenEditCustomerModal(false)} className="btn me-3 border-0">Cancel</button>
                                    <button ref={submitEditCustomerButtonRef} type="submit" disabled={false} className="btn btn-primary">Confirm</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

            </Modal>

            <Toaster />

        </>
    )

}