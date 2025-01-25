import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function SignUpModal({ show, onHide }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSignUp(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_URL}/auth/signup`, formData);
      console.log("New user", data);
      onHide();
    } catch (error) {
      console.log("Error Signing Up the details", error.response.data.message);
      setError(error.response.data.message);
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
          {" "}
          Register User
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSignUp}>
          <div className="row">
            <label htmlFor="username" className="col25">
              Username:
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="col75"
            ></input>
          </div>

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
