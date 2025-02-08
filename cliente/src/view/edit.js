import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function EditComponent() {
    const { FilmeId } = useParams();
    return (
        <div>
            <div className="form-row justify-content-center">
                <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">Name</label>
                    <input type="text" className="form-control"
                        placeholder="Name" />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">Email</label>
                    <input type="email" className="form-control"
                        placeholder="Email" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="inputState">Role</label>
                    <select id="inputState" className="form-control">
                        <option value="1">Admin</option>
                        <option value="2">Project Manager</option>
                        <option value="3">Programer</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">Phone</label>
                    <input type="number" className="form-control"
                        placeholder="Phone" />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="inputAddress">Address</label>
                <input type="text" className="form-control"
                    id="inputAddress" placeholder="1234 Main St" />
            </div>
            <button type="submit" className="btn btnprimary">Update</button>
        </div>
    );
}