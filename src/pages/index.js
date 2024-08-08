import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import Link from "next/link";

import toast, { Toaster } from 'react-hot-toast'

export default function Home() {

  const [paging, setPaging] = useState(8)

  const [shipmentStats, setShipmentStats] = useState({})
  const [shipmentTrackStats, setShipmentTrackStats] = useState({})

  const [searchQuery, setSearchQuery] = useState('')

  const fetchShipmentStats = async () => {
    try {
      toast.remove()
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}shipments/shipmentStats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEADER_TOKEN}`
        },
        mode: 'cors'
      });

      if (!response.ok) {
        toast.error("Network response was not ok! " + error)
        throw new Error('Network response was not ok!')
      }

      const data = await response.json();

      if (data.success) {
        setShipmentStats(data.result)
        setShipmentTrackStats(data.result.shipmentsTracksStats)

      } else {
        toast.error("NO result found! ")
        console.log("Error occurred! Try again.")
      }
    } catch (error) {
      alert("Possible network error! ", error)
    }
  }

  const filteredShipmentsStats = (shipmentStats.shipmentsTracksStats == undefined) ? [] : shipmentStats.shipmentsTracksStats.filter(item =>
    item.shipment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchShipmentStats()

  }, [])

  return (
    <>
      <div className="page-wrapper">
        <div className="container-xl">
          <div className="page-header d-print-none">
            <div className="row g-2 align-items-center">
              <div className="col">
                <div className="page-pretitle">
                  Welcome, Admin!
                </div>
                <h2 className="page-title">
                  Dashboard
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="container-xl">
            <div className="col-12 mb-3">
              <div className="row row-cards">
                <div className="col-sm-12 col-md-4">
                  <div className="card card-sm">
                    <div className="ribbon ribbon-top ribbon-bookmark bg-info">
                      <i className="fa fa-inbox" style={{ fontSize: '14px' }}></i>
                    </div>
                    <div className="card-body">
                      <h2 className="card-tite fw-bold">
                        {shipmentStats.allShipments}
                      </h2>
                      <div className="text-muted">Shipments</div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4">
                  <div className="card card-sm">
                    <div className="ribbon ribbon-top ribbon-bookmark bg-info">
                      <i className="fab fa-dropbox" style={{ fontSize: '14px' }}></i>
                    </div>
                    <div className="card-body">
                      <h2 className="card-tite fw-bold">
                        {shipmentStats.completedShipments}
                      </h2>
                      <div className="text-muted">Completed</div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-4">
                  <div className="card card-sm">
                    <div className="ribbon ribbon-top ribbon-bookmark bg-info">
                      <i className="fa fa-map-signs" style={{ fontSize: '14px' }}></i>
                    </div>
                    <div className="card-body">
                      <h2 className="card-tite fw-bold">
                        {shipmentStats.ongoingShipments}
                      </h2>
                      <div className="text-muted">Ongoing</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title">List of Shipments</h3>
                  <Link href='/shipments' className="btn btn-sm btn-primary">See More <i className="fa fa-caret-right ms-2"></i></Link>
                </div>
                <div className="card-body border-bottom py-3">
                  <div className="d-flex">
                    <div className="text-muted">
                      Search:
                      <div className="ms-2 d-inline-block">
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="form-control form-control-sm" aria-label="Search Query" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter">
                    <thead>
                      <tr>
                        <th className="text-center" style={{ width: '5%' }}>Status</th>
                        <th>Shipment ID</th>
                        <th style={{ width: '30%' }}>Description</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th className="text-center">Tracks</th>
                      </tr>
                    </thead>
                    <tbody>

                      {
                        filteredShipmentsStats.map((ele, index) =>
                          <tr key={ele.shipment_id}>
                            <td style={{ width: '5%' }} className="text-center">
                              {
                                (ele.status == 'completed') && <div className="badge bg-success"></div>
                              }

                              {
                                (ele.status == 'ongoing') && <div className="badge bg-info"></div>
                              }

                              {
                                (ele.status == 'not started') && <div className="badge bg-success"></div>
                              }

                            </td>
                            <td><Link href={`/shipments/${ele.shipment_id}`} className="fw-bold">{ele.shipment_id}</Link></td>
                            <td className="fw-bold">{ele.info}</td>
                            <td>{ele.origin}</td>
                            <td>{ele.destination}</td>
                            <td className="text-center">
                              {ele.number_of_tracks}
                            </td>
                          </tr>
                        )
                      }

                      {
                        ((shipmentTrackStats.length != 0) && filteredShipmentsStats.length == 0) && (
                          <tr>
                            <td colSpan={6} className="text-center">
                              Search string: <span className="badge bg-light text-muted"><b>{`'${searchQuery}'`}</b></span> did not match any item!
                            </td>
                          </tr>
                        )
                      }

                      {
                        (shipmentTrackStats.length == 0) && (
                          <tr>
                            <td colSpan={6} className="text-center">No result to display!</td>
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

      <Toaster />
    </>
  );
}