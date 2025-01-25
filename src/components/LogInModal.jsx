import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function LogInModal({ show, onHide }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleLogin(e) {
    e.preventDefault();

    try {
      //const { data } = await axios.post(`${API_URL}/auth/login`, formData);
      //console.log("New user", data);
      //localStorage.setItem("authToken", data.authToken);
      await authenticateUser();
      onHide();
      nav("/profile");
    } catch (error) {
      console.log("Error Signing Up the details", error);
      setError(error);
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Log In User
        </Modal.Title>
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
            <Button variant="danger" onClick={() => onHide()}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>{error && <p className="errors">{error}</p>}</Modal.Footer>
    </Modal>
  );
}
