import React from "react";
import { Modal, Button } from "react-bootstrap";

const GenModal = ({ messageObj, handleClose, handleAction }) => {
  function closeAndAction() {
    handleClose();
    handleAction();
  }

  return (
    <Modal show={messageObj.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{messageObj.header}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{messageObj.message}</p>
      </Modal.Body>

      <Modal.Footer>
        {messageObj.confirmation && (
          <>
            <Button
              variant="secondary"
              className="button-shadow"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="button-shadow"
              onClick={closeAndAction}
            >
              Yes
            </Button>
          </>
        )}
        {!messageObj.confirmation && (
          <Button
            variant="danger"
            className="button-shadow"
            onClick={handleClose}
          >
            Close
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GenModal;
