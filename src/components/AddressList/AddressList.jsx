import React from "react";
// import "./AddressList.css";

const AddressList = ({
  addresses,
  activeAddressId,
  onEdit,
  onDelete,
  onSetActive,
}) => {
  return (
    <div className="addresses-section">
      <h2>All Addresses</h2>
      {addresses.length > 0 ? (
        <ul className="address-list">
          {addresses.map((address) => {
            const isActive = address._id === activeAddressId;
            return (
              <li key={address._id} className="address-item">
                <span className="address-info">
                  {address.formattedAddress ||
                    `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`}
                </span>
                <div className="address-actions">
                  <button
                    onClick={() => onEdit(address._id)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(address._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  {isActive ? (
                    <span className="active-label">Active</span>
                  ) : (
                    <button
                      onClick={() => onSetActive(address._id)}
                      className="set-active-button"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No addresses found.</p>
      )}
    </div>
  );
};

export default AddressList;
