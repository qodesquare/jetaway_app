import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Shipments() {

    const [paging, setPaging] = useState(8)

    const [loadingDataState, setLoadingDataState] = useState(true)

    const resetValues = () => {
        setInfo('')
        setOrigin('')
        setDestination('')
        setEntryDate('0000-00-00')
        setDeliveryDate('0000-00-00')
        setEntryTime('--:--')
        setOwner('')
    }

    const [open, setOpen] = useState(false);
    const router = useRouter

    const [shipments, setShipments] = useState([])
    const [customers, setCustomers] = useState([])

    const [searchQuery, setSearchQuery] = useState('')

    const [info, setInfo] = useState('')
    const [origin, setOrigin] = useState('')
    const [destination, setDestination] = useState('')
    const [entryDate, setEntryDate] = useState('0000-00-00')
    const [entryTime, setEntryTime] = useState('--:--')
    const [deliveryDate, setDeliveryDate] = useState('0000-00-00')
    const [owner, setOwner] = useState('')

    const [addShipmentProcessing, setAddShipmentProcessing] = useState(false)
    const [key, setKey] = useState((Math.random() + 1).toString(36).substring(5))

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/`, {
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
                setShipments(data.result)
                setLoadingDataState(false)
            }
            else {
                toast.remove()
                toast.error("Shipments information not found! ", error)
                setLoadingDataState(false)
            }
        } catch (error) {
            toast.remove()
            toast.error("Possible network error", error)
            setLoadingDataState(false)
            console.log(error)
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
                toast.remove()
                toast.error("Customers information not found! " + data.result)
            }
        } catch (error) {
            toast.remove()
            toast.error("Possible network problem! ", error)
            console.log(error)
        }
    }

    const addShipment = async (e) => {

        e.preventDefault()

        setAddShipmentProcessing(true)
        toast.loading('Sending message to server...');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    description: info,
                    origin: origin,
                    destination: destination,
                    entry_date: entryDate,
                    entry_time: entryTime,
                    delivery_date: deliveryDate,
                    owner: owner
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                toast.remove()
                toast.success('Success! Shipment added to database.', { duration: 5000 })

                resetValues()
                setAddShipmentProcessing(false)
                setOpen(false)

                setEntryDate('0000-00-00')
                setEntryTime('00:00')
                setKey((Math.random() + 1).toString(36).substring(5))

                console.log(data.emailStatus)

            } else {
                setAddShipmentProcessing(false)
                toast.remove()
                toast.error('Operation not completed! Shipment not added to database.', { duration: 5000 });
            }
        } catch (error) {
            setAddShipmentProcessing(false)
            toast.remove()
            toast.error('Error occurred! You can try again.', { duration: 15000 });
        }
    }

    const iconClickedEvent = (event, shipment_id) => {

        event.stopPropagation()

        let target_parent = event.target.parentElement

        target_parent.click()

    }

    const deleteShipment = async (target, shipment_id) => {

        target.setAttribute('disabled', true)

        let prompt = confirm(`Are you sure to delete shipment: ${shipment_id}? This will also delete all associated tracks. This action CANNOT be undone; please proceed with care!`)

        if (!prompt) {
            target.removeAttribute('disabled')
            return
        }

        toast.loading("Completing server request...")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
                },
                body: JSON.stringify({
                    shipment_id: shipment_id
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.success) {
                toast.remove()
                toast.success('Success! Shipment deleted from database.', { duration: 10000 })
                setKey((Math.random() + 1).toString(36).substring(5))

            } else {
                toast.remove()
                toast.error('Operation not completed! Shipment not deleted from database.', { duration: 10000 });
            }
        } catch (error) {
            toast.remove()
            toast.error("Error! Possible network problem." + error)
            alert('Error! Possible network problem.')
        }
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10)

    let numberOfTracks = shipments.length
    let numOfPages = Math.ceil(numberOfTracks / itemsPerPage)

    let startIdx = (currentPage - 1) * itemsPerPage;
    let endIdx = Math.min(startIdx + itemsPerPage, numberOfTracks);

    const filteredShipments = shipments.filter(item =>
        item.shipment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.info.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(startIdx, endIdx);

    const handleChangePage = (newPage) => {
        if (newPage > 0 && newPage <= numOfPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {

        fetchData()
        fetchCustomers()

    }, [key])

    return (
        <>
            <Head>
                <title>{process.env.NEXT_PUBLIC_ORG_NAME} :: Shipments</title>
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
                                    Shipments
                                </h2>
                                <div className="page-pretitle">
                                    List of all shipments in the database.
                                </div>

                            </div>
                            <div className="col-12 col-md-auto ms-auto d-print-none">
                                <div className="btn-list">
                                    <button onClick={() => setOpen(true)} className="btn btn-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        Add Shipment
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
                                                    <th className="w-1">No.</th>
                                                    <th>Shipment ID</th>
                                                    <th>Description</th>
                                                    <th>Entry Date</th>
                                                    <th>Delivery Date</th>
                                                    <th>Status</th>
                                                    <th style={{ textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    filteredShipments.map((ele, index) =>

                                                        <tr key={(Math.random() + 1).toString(36).substring(4)}>
                                                            <td><span className="text-muted">{index + 1}</span></td>
                                                            <td>{ele.shipment_id}</td>
                                                            <td className="text-wrap">
                                                                <b>{ele.info}</b>
                                                                <div>
                                                                    <small>
                                                                        <small style={{ textOverflow: 'ellipsis', width: '100px' }} title={'Origin: ' + ele.origin} className="badge bg-info">{ele.origin}</small> <i className="fa fa-arrow-right mx-2"></i> <small title={'Destination: ' + ele.destination} className="badge bg-info" style={{ textOverflow: 'ellipsis', width: '100px' }}>{ele.destination}</small>
                                                                    </small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {ele.entry_date}
                                                            </td>
                                                            <td>
                                                                {ele.delivery_date}
                                                            </td>
                                                            <td>
                                                                {
                                                                    (ele.status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_ONGOING) && <span className="badge bg-info me-1"></span>
                                                                }

                                                                {
                                                                    (ele.status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_NOT_STARTED) && <span className="badge bg-muted me-1"></span>
                                                                }

                                                                {
                                                                    (ele.status == process.env.NEXT_PUBLIC_SHIPMENT_STATUS_COMPLETED) && <span className="badge bg-success me-1"></span>
                                                                }
                                                                {(ele.status).substring(0, 1).toUpperCase()}{(ele.status).substring(1)}

                                                            </td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <Link href={'/shipments/' + ele.shipment_id} className="py-1 px-2 btn-sm btn btn-primary btn-pill me-2">
                                                                    <i className="fa fa-eye"></i>
                                                                </Link>
                                                                <button onClick={(e) => deleteShipment(e.target, ele.shipment_id)} href="#" className="py-1 px-2 btn-sm btn btn-danger btn-pill">
                                                                    <i onClick={(event) => iconClickedEvent(event, ele.shipment_id)} className="fa fa-trash-alt"></i>
                                                                </button>
                                                            </td>
                                                        </tr>

                                                    )
                                                }

                                                {
                                                    (loadingDataState) && (
                                                        <tr>
                                                            <td className="text-center" colSpan={7}>Loading data...</td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    (!loadingDataState && shipments.length != 0 && filteredShipments.length == 0) && (
                                                        <tr>
                                                            <td colSpan={7} className="text-center">
                                                                Search string: <span className="badge bg-light text-muted"><b>{`'${searchQuery}'`}</b></span> did not match any item!
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                {
                                                    (!loadingDataState && shipments.length == 0) && (
                                                        <tr>
                                                            <td colSpan={7} className="text-center">No data to display!</td>
                                                        </tr>
                                                    )
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer d-flex align-items-center">
                                        <p className="m-0 text-muted">Showing <span>{((currentPage - 1) * itemsPerPage + 1)}</span> to <span>{endIdx}</span> of <span>{shipments.length}</span> entries</p>
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
                    <h2>Add Shipment</h2>
                    <hr className="my-3" />
                    <div className="">
                        <form onSubmit={(e) => addShipment(e)}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="description">Description</label>
                                        <textarea value={info} onChange={e => setInfo(e.target.value)} className="form-control" id="destination" name="example-textarea-input" rows="2" placeholder="Write.." required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="origin">Origin</label>
                                        <input value={origin} onChange={e => setOrigin(e.target.value)} type="text" id="origin" className="form-control" name="example-password-input" placeholder="Input placeholder" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="destination">Destination</label>
                                        <input value={destination} onChange={e => setDestination(e.target.value)} type="text" id="destination" className="form-control" name="example-password-input" placeholder="Input placeholder" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_date">Entry Date</label>
                                        <input value={entryDate} onChange={e => setEntryDate(e.target.value)} type="date" id="entry_date" className="form-control" name="example-password-input" placeholder="Input placeholder" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="entry_time">Entry Time</label>
                                        <input value={entryTime} onChange={e => setEntryTime(e.target.value)} type="time" id="entry_time" className="form-control" name="example-password-input" placeholder="Input placeholder" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="delivery_date">Delivery Date (Estimated)</label>
                                        <input value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} type="date" id="delivery_date" className="form-control" name="example-password-input" placeholder="Input placeholder" />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="owner">Owner</label>
                                        <select id="owner" className="form-select" value={owner} onChange={(e) => setOwner(e.target.value)} required>
                                            <option value={''}>Please select a customer</option>
                                            {
                                                customers.map((ele, index) => <option key={index} value={ele.customer_id}>
                                                    {`${ele.first_name} ${ele.middle_name} ${ele.last_name}`}
                                                </option>)
                                            }
                                        </select>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="button" onClick={(e) => setOpen(false)} className="btn me-3 border-0">Cancel</button>
                                        <button type="submit" disabled={addShipmentProcessing ? true : false} className="btn btn-primary">Confirm</button>
                                    </div>
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