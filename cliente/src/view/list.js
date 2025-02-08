import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
export default function ListComponent() {
    const [dataFilme, setdataFilme] = useState([]);
    useEffect(() => {
        const url = "http://localhost:3000/list";
        axios.get(url)
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data;
                    setdataFilme(data);
                } else {
                    alert("Error Web Service!");
                }
            })
            .catch(error => {
                alert(error)
            });
    }, []);
    return (
        <table className="table table-hover table-striped">
            <thead className="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Role</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                    <th scope="col">Phone</th>
                    <th colSpan="2">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>1</th>
                    <td>Admin</td>
                    <td>Pedro Soares</td>
                    <td>psoares@estgv.ipv.pt</td>
                    <td>Viseu</td>
                    <td>232480533</td>
                    <td>
                        <button className="btn btn-outline-info "> Edit </button>
                    </td>
                    <td>
                        <button className="btn btn-outline-danger "> Delete </button>
                    </td>
                </tr>
                <LoadFillData />
            </tbody>
        </table>
    );

    function LoadFillData() {
        return dataFilme.map((data, index) => {
            return (
                <tr key={index}>
                    <th>{data.id}</th>
                    <td>{data.role.role}</td>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    <td>{data.address}</td>
                    <td>{data.phone}</td>
                    <td>
                        <Link className="btn btn-outline-info "
                            to={"/edit/" + data.id} >Edit</Link>
                    </td>
                    <td>
                        <button className="btn btn-outline-danger">
                            Delete </button>
                    </td>
                </tr>
            )
        });
    }
}