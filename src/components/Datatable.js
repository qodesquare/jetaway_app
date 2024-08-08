export default function Datatable({data}) {

    return (
        <>
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
                        (shipmentStats.shipmentsTracksStats != undefined) &&
                        (shipmentStats.shipmentsTracksStats).map((ele, index) =>
                            <tr key={ele.shipment_id}>
                                <td style={{ width: '5%' }} className="text-center">
                                    {
                                        (ele.status == 'completed') && <div className="badge badge-success"></div>
                                    }

                                    {
                                        (ele.status == 'ongoing') && <div className="badge badge-info"></div>
                                    }

                                    {
                                        (ele.status == 'not started') && <div className="badge badge-success"></div>
                                    }

                                </td>
                                <td>{ele.shipment_id}</td>
                                <td>{ele.info}</td>
                                <td>{ele.origin}</td>
                                <td>{ele.destination}</td>
                                <td className="text-center">
                                    {ele.number_of_tracks}
                                </td>
                            </tr>)
                    }

                    {
                        (shipmentStats.shipmentsTracksStats == undefined) && (
                            <tr>
                                <td colSpan={6} className="text-center">
                                    Could not get data from source! Nothing to display...
                                </td>
                            </tr>
                        )
                    }

                </tbody>
            </table>
        </>
    )
}