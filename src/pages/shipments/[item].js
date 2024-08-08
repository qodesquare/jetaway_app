import { Inter } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Head from "next/head";

import toast, { Toaster } from "react-hot-toast";
import { Router, useRouter } from "next/router";

import { Tooltip } from 'react-tooltip'

var unescape = require('lodash.unescape');

const inter = Inter({ subsets: ["latin"] });

export default function ShipmentItem(props) {

    let pid = props.pid.item

    const router = useRouter()

    const editShipmentButtonRef = useRef();
    const addTrackButtonRef = useRef();

    const [open, setOpen] = useState(false);
    const [openAddTrackModal, setOpenAddTrackModal] = useState(false)
    const [openEditTrackModal, setOpenEditTrackModal] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')

    const [info, setInfo] = useState('')
    const [customer, setCustomer] = useState('')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [entryDate, setEntryDate] = useState('0000-00-00')
    const [deliveryDate, setDeliveryDate] = useState('0000-00-00')
    const [entryTime, setEntryTime] = useState('--:--')
    const [owner, setOwner] = useState('')
    const [status, setStatus] = useState('')

    const [activeTrackID, setActiveTrackID] = useState('')
    const [trackTitle, setTrackTitle] = useState('')
    const [trackDescription, setTrackDescription] = useState('')
    const [trackDate, setTrackDate] = useState('0000-00-00')
    const [trackTime, setTrackTime] = useState('--:--:--')
    const [trackCompleted, setTrackCompleted] = useState(0)

    const [shipmentTracks, setShipmentTracks] = useState([])

    const [customers, setCustomers] = useState([])

    const [reRenderKey, setReRenderKey] = useState('ewre3')

    const confirmEditButtonRef = useRef()

    const fetchShipment = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/${pid}`, {
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
                setInfo(data.result.info)
                setCustomer(data.result.customer)
                setOrigin(data.result.origin)
                setDestination(data.result.destination)
                setEntryDate(data.result.entry_date)
                setDeliveryDate(data.result.delivery_date)
                setEntryTime(data.result.entry_time)
                setOwner(data.result.customer_id)
                setStatus(data.result.status)

            } else {

                toast.error('Operation not completed! Shipment information could not be fetched.' + data.result, { duration: 10000 });
            }
        } catch (error) {
            console.log(error)
            toast.error('Error occurred! You can try again..', { duration: 15000 });
        }
    }

    const performEditShipment = async (e) => {

        e.preventDefault()

        editShipmentButtonRef.current.setAttribute('disabled', true)

        const editToast = toast.loading("Shipment information is updating...")
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    shipment_id: pid,
                    info: info,
                    origin: origin,
                    destination: destination,
                    entry_date: entryDate,
                    entry_time: entryTime,
                    delivery_date: deliveryDate,
                    owner: owner,
                    status: status
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            if (data.success) {
                editShipmentButtonRef.current.removeAttribute('disabled')
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                setOpen(false)
                toast.dismiss(editToast)
                toast.success('Success! Shipment information updated.', { duration: 5000 })

            } else {
                editShipmentButtonRef.current.removeAttribute('disabled')

                toast.error('Operation not completed! Shipment information could not be updated.', { duration: 5000 });
            }
        } catch (error) {
            editShipmentButtonRef.current.removeAttribute('disabled')

            toast.error('Error occurred! You can try again.' + error, { duration: 15000 });
        }
    }

    const changeShipmentStatus = async () => {

        const toastID = toast.loading("Updating shipment information...")
    }

    const fetchShipmentTracks = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/tracks/${pid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Fetch Tracks: Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setShipmentTracks(data.result)

            } else {

                toast.error('Operation not completed! Shipment tracks could not be retrieved1.', { duration: 10000 });
            }
        } catch (error) {
            alert(error)
            console.log(error)
        }
    }

    const resetValues = () => {
        setTrackTitle('')
        setTrackDescription('')
        setTrackDate('0000-00-00')
        setTrackTime('--:--:--')
    }

    const addNewShipmentTrack = async (e) => {

        e.preventDefault()

        addTrackButtonRef.current.setAttribute('disabled', true)

        const toastID = toast.loading("Saving track information to database...")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    shipment_id: pid,
                    title: trackTitle,
                    description: trackDescription,
                    date: trackDate,
                    time: trackTime
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                resetValues()
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                setOpenAddTrackModal(false)
                toast.dismiss(toastID)
                toast.success('Success! Track information was saved to the database.', { duration: 5000 })
                addTrackButtonRef.current.removeAttribute('disabled')

            } else {

                toast.error('Operation not completed! Track was not saved.', { duration: 5000 })
                addTrackButtonRef.current.removeAttribute('disabled')
            }
        } catch (error) {

            toast.error('Error occurred! You can try again.', { duration: 15000 });
        }
    }

    const editTrackAction = (event, obj) => {

        setActiveTrackID(obj.track_id)
        setTrackTitle(obj.title)
        setTrackDescription(obj.description)
        setTrackDate(obj.date)
        setTrackTime(obj.time)
        setTrackCompleted(obj.completed)

        setOpenEditTrackModal(true)

    }

    const editTrack = async (event) => {
        event.preventDefault()

        confirmEditButtonRef.current.setAttribute('disabled', true)

        const toastID = toast.loading("Processing request in the background...")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/tracks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    track_id: activeTrackID,
                    title: trackTitle,
                    description: trackDescription,
                    date: trackDate,
                    time: trackTime,
                    completed: trackCompleted
                })
            });

            if (!response.ok) {
                throw new Error('Fetch Tracks: Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setOpenEditTrackModal(false)
                resetValues()
                confirmEditButtonRef.current.removeAttribute('disabled')
                toast.dismiss(toastID)
                toast.success('Success! Tracks details edited.', { duration: 5000 })
                setReRenderKey((Math.random() + 1).toString(36).substring(5))

            } else {
                confirmEditButtonRef.current.removeAttribute('disabled')

                toast.error('Operation not completed! Track information could not be updated.', { duration: 5000 });
            }
        } catch (error) {
            confirmEditButtonRef.current.removeAttribute('disabled')

            toast.error('Fetch Tracks: Error occurred! You can try again..' + error, { duration: 15000 });
        }
    }

    const deleteTrack = async (event, item) => {

        event.target.setAttribute('disabled', true)
        const track_id = item.track_id

        let action = confirm("Are you sure to delete?")

        let toastID = null

        if (!action) {

            toastID = toast('Operation cancelled. Track not deleted.', { duration: 5000, icon: '👏' })
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/tracks/` + track_id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Fetch Tracks: Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                setReRenderKey((Math.random() + 1).toString(36).substring(5))
                toast.dismiss(toastID)
                toast.success('Success! Tracks details deleted.', { duration: 5000 })

            } else {
                event.target.removeAttribute('disabled')

                toast.error('Operation not completed! Track information could not be deleted.', { duration: 5000 });
            }
        } catch (error) {
            event.target.removeAttribute('disabled')

            toast.error('Fetch Tracks: Error occurred! You can try again..' + error, { duration: 15000 });
        }
    }

    const fetchCustomers = async () => {
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}customers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok!');
            }

            const data = await response.json();
            if (data.success) {
                setCustomers(data.result)

            } else {
                toast.error("NO result found!")
            }
        } catch (error) {
            toast.error("Possible network error", error)
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10)

    let numberOfTracks = shipmentTracks.length
    let numOfPages = Math.ceil(numberOfTracks / itemsPerPage)

    let startIdx = (currentPage - 1) * itemsPerPage;
    let endIdx = Math.min(startIdx + itemsPerPage, numberOfTracks);

    const filteredTracks = shipmentTracks.filter(item =>
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(startIdx, endIdx);

    const handleChangePage = (newPage) => {
        if (newPage > 0 && newPage <= numOfPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        fetchShipment()
        fetchShipmentTracks()

        fetchCustomers()

    }, [reRenderKey])

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Shipment: {pid}</title>
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
                                <div className="d-flex justify-content-start align-items-center">
                                    <div>
                                        <button tooltip='Go Back' onClick={() => router.push('/shipments')} className="bg-transparent border-0 me-3"><i className="fa fa-angle-left fa-2x"></i></button>
                                    </div>
                                    <div>
                                        <div className="d-flex">
                                            <h2 className="page-title">
                                                Shipment
                                            </h2>

                                            {
                                                (shipmentTracks.length == 0 && (status == 'completed')) &&
                                                <>
                                                    <span id="completion_notif" data-tooltip-place="right" className="status-indicator d-inline-block status-green status-indicator-animated">
                                                        <span className="status-indicator-circle"></span>
                                                        <span className="status-indicator-circle"></span>
                                                        <span className="status-indicator-circle"></span>
                                                    </span>
                                                    <Tooltip style={{ zIndex: 9999999 }} anchorSelect="#completion_notif" clickable>
                                                        <h3 className="mb-2">Shipment is marked <kbd>completed</kbd> but has no tracks!</h3>
                                                        <div className="mb-2">You should edit the shipment and change the status to <kbd>Not started</kbd></div>

                                                    </Tooltip>
                                                </>
                                            }

                                        </div>
                                        <div className="page-pretitle">
                                            {pid}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="col-12 col-md-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <button onClick={() => setOpen(true)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-report">
                                        <i className="fa fa-edit me-2"></i>
                                        Edit
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
                                    <div className="table-responsive">
                                        <table className="table card-table table-vcenter text-nowrap datatable">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '25%' }}>Description</th>
                                                    <th style={{ width: '20%' }}>Owner</th>
                                                    <th>Entry Date</th>
                                                    <th>Entry Time</th>
                                                    <th>Delivery Date</th>
                                                    <th style={{ textAlign: 'center', width: '5%' }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <td className="text-wrap">
                                                        <p>{info}</p>
                                                        <div>
                                                            <small>
                                                                <small style={{ textOverflow: 'ellipsis', width: '100px' }} title={'Origin: ' + origin} className="badge bg-info">{origin}</small> <i className="fa fa-arrow-right mx-2"></i> <small title={'Destination: ' + destination} className="badge bg-info" style={{ textOverflow: 'ellipsis', width: '100px' }}>{destination}</small>
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td className="text-wrap">
                                                        {(customer == null) ? <b>No Customer!</b> : customer}
                                                        {
                                                            (customer == null) &&
                                                            <div>
                                                                <small className="text-muted">
                                                                    Please, use the EDIT button to assign a customer.
                                                                </small>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td className="text-wrap">
                                                        {entryDate}
                                                    </td>
                                                    <td className="text-wrap">
                                                        {entryTime}
                                                    </td>
                                                    <td className="text-wrap">
                                                        {deliveryDate}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {
                                                            (status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_ONGOING) && <span className="badge bg-info me-1"></span>
                                                        }

                                                        {
                                                            (status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_NOT_STARTED) && <span className="badge bg-muted me-1"></span>
                                                        }

                                                        {
                                                            (status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_COMPLETED) && <span className="badge bg-success me-1"></span>
                                                        }
                                                        {(status).substring(0, 1).toUpperCase()}{(status).substring(1)}

                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="w-100 d-flex justify-content-between align-items-center">

                                            <h4 className="card-title"><span className="fw-bold">Shipment Progress</span>
                                                <small> {`(${shipmentTracks.length} Tracks)`}</small></h4>

                                            <button onClick={() => setOpenAddTrackModal(true)} className="btn-sm btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-report">
                                                <i className="fa fa-plus me-2"></i>
                                                Add Track
                                            </button>
                                        </div>

                                    </div>
                                    <div className="card-body border-bottom py-3">
                                        <div className="row">
                                            <div className="mb-3 text-muted col-sm-12 col-md-6">
                                                Show
                                                <div className="mx-2 d-inline-block">

                                                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} id="select" className="form-select form-select-sm">
                                                        <option value="5">5</option>
                                                        <option value="10">10</option>
                                                        <option value="15">15</option>
                                                    </select>
                                                </div>
                                                entries
                                            </div>
                                            <div className="col-sm-12 col-md-6 text-muted text-end">
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
                                                    <th style={{ width: '10%', textAlign: 'center' }}>Status</th>
                                                    <th>Info</th>
                                                    <th style={{ textAlign: 'right' }}>Schedule</th>
                                                    <th style={{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    filteredTracks.map((ele, index) =>

                                                        <tr key={(Math.random() * 1000)}>
                                                            <td style={{ textAlign: 'center' }}>
                                                                {
                                                                    (ele.completed == 1) && <span className="badge bg-success me-1"></span>
                                                                }

                                                                {
                                                                    (ele.completed == 0) && <span className="badge me-1" style={{ background: 'rgb(200, 200, 200)' }}></span>
                                                                }
                                                            </td>
                                                            <td className="text-wrap">
                                                                <b>{ele.title}</b>
                                                                <div>
                                                                    <small>{unescape(ele.description)}</small>
                                                                </div>
                                                            </td>
                                                            <td align="right">
                                                                <b>{ele.date}</b>
                                                                <div><small>{ele.time}</small></div>
                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <button onClick={(e) => editTrackAction(e, ele)} className="py-1 px-2 btn-sm btn btn-primary btn-pill me-2">
                                                                    <i className="fa fa-pencil"></i>
                                                                </button>
                                                                <button onClick={(event) => deleteTrack(event, ele)} className="py-1 px-2 btn-sm btn btn-danger btn-pill">
                                                                    <i className="fa fa-trash-alt"></i>
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    )
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer d-flex align-items-center">
                                        <p className="m-0 text-muted">Showing <span>{((currentPage - 1) * itemsPerPage + 1)}</span> to <span>{endIdx}</span> of <span>{shipmentTracks.length}</span> entries</p>
                                        <ul className="pagination m-0 ms-auto">
                                            <li className={`page-item border me-1 ${(currentPage === 1) ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} aria-disabled={currentPage === 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="15 6 9 12 15 18" /></svg>
                                                    prev
                                                </button>
                                            </li>
                                            {[...Array(numOfPages)].map((_, index) => (
                                                <li onClick={() => handleChangePage(index + 1)} key={index} className={`page-item me-1 ${(index + 1 === currentPage) ? 'active' : ''}`}>
                                                    <button className="page-link border">{index + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item border ${(currentPage === numOfPages) ? 'disabled' : ''}`}>
                                                <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === numOfPages} aria-disabled={currentPage === numOfPages} className="page-link">
                                                    next
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="9 6 15 12 9 18" /></svg>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Modal open={open} onClose={() => setOpen(false)} center classNames={{ overlay: 'customOverlay', modal: 'customModal' }}>
                    <h2>Edit Shipment</h2>
                    <hr className="my-3" />
                    <div className="">
                        <form onSubmit={(e) => performEditShipment(e)}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea value={info} onChange={e => setInfo(e.target.value)} className="form-control" id="destination" name="example-textarea-input" rows="2" placeholder="Write.." required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="origin">Origin</label>
                                        <input value={origin} onChange={e => setOrigin(e.target.value)} type="text" id="origin" className="form-control" name="example-password-input" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="destination">Destination</label>
                                        <input value={destination} onChange={e => setDestination(e.target.value)} type="text" id="destination" className="form-control" name="example-password-input" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_date">Entry Date</label>
                                        <input value={entryDate} onChange={e => setEntryDate(e.target.value)} type="date" id="entry_date" className="form-control" name="example-password-input" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_time">Entry Time</label>
                                        <input value={entryTime} onChange={e => setEntryTime(e.target.value)} type="time" id="entry_time" className="form-control" name="example-password-input" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="delivery_date">Delivery Date (Estimated)</label>
                                        <input value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} type="date" id="delivery_date" className="form-control" name="example-password-input" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="owner">Owner</label>
                                        <select id="owner" className="form-select" value={owner} onChange={(e) => setOwner(e.target.value)} required>
                                            <option value={''}>Please select a customer</option>
                                            {
                                                customers.map((ele, index) =>
                                                    <option key={index} value={ele.customer_id} selected={(ele.customer_id == owner) ? true : false} >
                                                        {`${ele.first_name} ${ele.middle_name} ${ele.last_name}`}
                                                    </option>)
                                            }
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <div>
                                            <label className="form-label" htmlFor="delivery_date">Status</label>
                                            <label className="form-check form-check-inline">
                                                <input value={'not started'} onChange={(e) => setStatus(e.target.value)} className="form-check-input" type="radio" name="shipmentStatus" defaultChecked={status == 'not started'} />
                                                <span className="form-check-label">Not started</span>
                                            </label>
                                            <label className="form-check form-check-inline">
                                                <input value={'ongoing'} onChange={(e) => setStatus(e.target.value)} className="form-check-input" type="radio" name="shipmentStatus" defaultChecked={status == 'ongoing'} />
                                                <span className="form-check-label">Ongoing</span>
                                            </label>
                                            <label className="form-check form-check-inline">
                                                <input value={'completed'} onChange={(e) => setStatus(e.target.value)} className="form-check-input" type="radio" name="shipmentStatus" defaultChecked={status == 'completed'} />
                                                <span className="form-check-label">Completed</span>
                                            </label>
                                        </div>
                                    </div>

                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={(e) => { setOpen(false) }} className="btn me-3 border-0">Cancel</button>
                                    <button ref={editShipmentButtonRef} type="submit" className="btn btn-primary">Confirm</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal open={openAddTrackModal} onClose={() => setOpenAddTrackModal(false)} center classNames={{ overlay: 'customOverlay', modal: 'customModal' }}>
                    <h2>Add Track</h2>
                    <hr className="my-3" />
                    <div className="">
                        <form onSubmit={(e) => addNewShipmentTrack(e)}>
                            <div className="row">
                                <div className="col-12">

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="title">Title</label>
                                        <input value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} type="text" id="title" className="form-control" name="example-password-input" placeholder="Title" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea value={trackDescription} onChange={e => setTrackDescription(e.target.value)} className="form-control" id="destination" name="example-textarea-input" rows="2" placeholder="Write.." required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_date">Date</label>
                                        <input value={trackDate} onChange={e => setTrackDate(e.target.value)} type="date" id="entry_date" className="form-control" name="example-password-input" placeholder="Input placeholder" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_time">Time</label>
                                        <input value={trackTime} onChange={e => setTrackTime(e.target.value)} type="time" id="entry_time" className="form-control" name="example-password-input" placeholder="Input placeholder" required />
                                    </div>

                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={(e) => { setOpenAddTrackModal(false) }} className="btn me-3 border-0">Cancel</button>
                                    <button ref={addTrackButtonRef} type="submit" className="btn btn-primary">Confirm</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal open={openEditTrackModal} onClose={() => setOpenEditTrackModal(false)} center classNames={{ overlay: 'customOverlay', modal: 'customModal' }}>
                    <h2>Edit Track</h2>
                    <hr className="my-3" />
                    <div className="">
                        <form onSubmit={(e) => editTrack(e)}>
                            <div className="row">
                                <div className="col-12">

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="title">Title</label>
                                        <input value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} type="text" id="title" className="form-control" name="example-password-input" placeholder="Title" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea value={unescape(trackDescription)} onChange={(e) => setTrackDescription(e.target.value)} className="form-control" id="destination" name="example-textarea-input" rows="2" placeholder="Write..." />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_date">Date</label>
                                        <input value={trackDate} onChange={(e) => setTrackDate(e.target.value)} type="date" id="entry_date" className="form-control" name="example-password-input" placeholder="Input placeholder" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_time">Time</label>
                                        <input value={trackTime} onChange={(e) => setTrackTime(e.target.value)} type="time" id="entry_time" className="form-control" name="example-password-input" placeholder="Input placeholder" />
                                    </div>

                                    <div className="mb-3">
                                        <input id="trackCompleted" className="form-check-input me-2" type="checkbox" checked={trackCompleted} onChange={(e) => setTrackCompleted(e.target.checked)} /> <label htmlFor='trackCompleted'>Track has been concluded</label>
                                    </div>

                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="button" onClick={(e) => { setOpenEditTrackModal(false) }} className="btn me-3 border-0">Cancel</button>
                                    <button ref={confirmEditButtonRef} type="submit" className="btn btn-primary">Confirm</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </Modal>

                <Toaster />
            </div>

        </>
    );
}

export async function getServerSideProps({ req, query, resolvedUrl }) {
    return {
        props: { pid: query }, // will be passed to the page component as props
    }
}