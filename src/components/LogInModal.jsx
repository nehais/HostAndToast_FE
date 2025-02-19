import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth.context";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function LogInModal({ show, onHide }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { authenticateUser, connectSocket } = useContext(AuthContext);

  function cleanHide() {
    setFormData({
      email: "",
      password: "",
    });
    setError("");
    onHide();
  }

  function handleChange(e) {
    setError("");
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      //Validate the Login details
      const { data } = await axios.post(`${API_URL}/auth/login`, formData);
      console.log("Login successful", data);
      localStorage.setItem("authToken", data.authToken); //Store the token in session
      await authenticateUser();
      await connectSocket();
      cleanHide();
    } catch (error) {
      console.log("Error loggin the details", error.response.data.message);
      setError(error.response.data.message);
    }
  }

  return (
    <Modal
      show={show}
      onHide={cleanHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Log In User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleLogin}>
          <div className="row">
            <label htmlFor="email" className="col25">
              Email:
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="col75"
            ></input>
          </div>

          <div className="row">
            <label htmlFor="password" className="col25">
              Password:
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="col75"
            ></input>
          </div>

          <div className="signup-buttons">
            <Button variant="danger" className="button-shadow" onClick={() => cleanHide()}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="button-shadow">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>{error && <p className="errors">{error}</p>}</Modal.Footer>
    </Modal>
  );
}
