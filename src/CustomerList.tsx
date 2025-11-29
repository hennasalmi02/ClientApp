import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import "./list.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  selfHref: string;
};

function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    email: "",
    phone: "",
  });
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const baseUrl =
    "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api";

  const loadCustomers = () => {
    fetch(`${baseUrl}/customers`)
      .then((response) => response.json())
      .then((data) => {
        const mapped: Customer[] = data._embedded.customers.map((c: any) => {
          const selfHref: string = c._links.self.href;
          const idStr = selfHref.split("/").pop() ?? "";
          const id = Number(idStr);

          return {
            id,
            firstname: c.firstname,
            lastname: c.lastname,
            streetaddress: c.streetaddress,
            postcode: c.postcode,
            city: c.city,
            email: c.email,
            phone: c.phone,
            selfHref,
          };
        });
        setCustomers(mapped);
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = (event: React.FormEvent) => {
    event.preventDefault();

    fetch(`${baseUrl}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add customer");
        }
        setNewCustomer({
          firstname: "",
          lastname: "",
          streetaddress: "",
          postcode: "",
          city: "",
          email: "",
          phone: "",
        });
        loadCustomers();
      })
      .catch((error) => {
        console.error("Error adding customer:", error);
      });
  };

  const deleteCustomer = (id: number) => {
    if (
      !window.confirm(
        "Delete this customer? This will also delete their trainings."
      )
    ) {
      return;
    }

    fetch(`${baseUrl}/customers/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }
        loadCustomers();
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const updateCustomer = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editCustomer) return;

    const { id, selfHref, ...customerData } = editCustomer;

    fetch(`${baseUrl}/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update customer");
        }
        setEditCustomer(null);
        loadCustomers();
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  const columns: GridColDef[] = [
    { field: "firstname", headerName: "First name", width: 150 },
    { field: "lastname", headerName: "Last name", width: 150 },
    { field: "streetaddress", headerName: "Street address", width: 250 },
    { field: "postcode", headerName: "Postcode", width: 120 },
    { field: "city", headerName: "City", width: 150 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "actions",
      headerName: "",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              setEditCustomer(params.row);
              setOpenEditDialog(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteCustomer(params.row.id)}>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container customer-page">
      <h2 className="section-title">Customers</h2>
      <div className="data-grid-wrapper">
        <DataGrid rows={customers} columns={columns} />
      </div>

      <button className="primary-button" onClick={() => setOpenAdd(true)}>
        Add new customer
      </button>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add customer</DialogTitle>
        <DialogContent>
          <div className="form-section">
            <div>
              <label>First name:</label>
              <input
                type="text"
                value={newCustomer.firstname}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstname: e.target.value })
                }
              />
            </div>
            <div>
              <label>Last name:</label>
              <input
                type="text"
                value={newCustomer.lastname}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, lastname: e.target.value })
                }
              />
            </div>
            <div>
              <label>Street address:</label>
              <input
                type="text"
                value={newCustomer.streetaddress}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    streetaddress: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label>Postcode:</label>
              <input
                type="text"
                value={newCustomer.postcode}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, postcode: e.target.value })
                }
              />
            </div>
            <div>
              <label>City:</label>
              <input
                type="text"
                value={newCustomer.city}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, city: e.target.value })
                }
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              addCustomer(e);
              setOpenAdd(false);
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit customer</DialogTitle>
        <DialogContent>
          {editCustomer && (
            <div className="form-section">
              <div>
                <label>First name:</label>
                <input
                  type="text"
                  value={editCustomer.firstname}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      firstname: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Last name:</label>
                <input
                  type="text"
                  value={editCustomer.lastname}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      lastname: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Street address:</label>
                <input
                  type="text"
                  value={editCustomer.streetaddress}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      streetaddress: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Postcode:</label>
                <input
                  type="text"
                  value={editCustomer.postcode}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      postcode: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>City:</label>
                <input
                  type="text"
                  value={editCustomer.city}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      city: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={editCustomer.email}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  value={editCustomer.phone}
                  onChange={(e) =>
                    setEditCustomer({
                      ...editCustomer,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              updateCustomer(e);
              setOpenEditDialog(false);
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditCustomer(null);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomerList;