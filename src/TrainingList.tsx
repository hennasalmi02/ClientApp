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

type Training = {
  id: number;
  date: string;
  duration: number;
  activity: string;
  customerName: string;
  customerEmail: string;
};

function TrainingList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [newTraining, setNewTraining] = useState({
    date: "",
    activity: "",
    duration: "",
    customerLink: "",
  });
  const [editTraining, setEditTraining] = useState<{
    id: number;
    date: string;
    activity: string;
    duration: string;
  } | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const baseUrl =
    "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api";

  const loadTrainings = () => {
    fetch(`${baseUrl}/gettrainings`)
      .then((response) => response.json())
      .then((data) => {
        const mappedTrainings: Training[] = data.map((t: any) => ({
          id: t.id,
          date: t.date,
          duration: t.duration,
          activity: t.activity,
          customerName: `${t.customer.firstname} ${t.customer.lastname}`,
          customerEmail: t.customer.email,
        }));
        setTrainings(mappedTrainings);
      })
      .catch((error) => {
        console.error("Error fetching training data:", error);
      });
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const deleteTraining = (id: number) => {
    if (!window.confirm("Delete this training?")) {
      return;
    }

    fetch(`${baseUrl}/trainings/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete training");
        }
        loadTrainings();
      })
      .catch((error) => {
        console.error("Error deleting training:", error);
      });
  };

  const addTraining = (event: any) => {
    event.preventDefault();

    const trainingToSend = {
      date: new Date(newTraining.date).toISOString(),
      activity: newTraining.activity,
      duration: Number(newTraining.duration),
      customer: newTraining.customerLink,
    };

    fetch(`${baseUrl}/trainings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add training");
        }
        setNewTraining({
          date: "",
          activity: "",
          duration: "",
          customerLink: "",
        });
        loadTrainings();
      })
      .catch((error) => {
        console.error("Error adding training:", error);
      });
  };

  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) {
      return "";
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const updateTraining = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editTraining) return;

    const trainingToSend = {
      date: new Date(editTraining.date).toISOString(),
      activity: editTraining.activity,
      duration: Number(editTraining.duration),
    };

    fetch(`${baseUrl}/trainings/${editTraining.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update training");
        }
        setEditTraining(null);
        loadTrainings();
      })
      .catch((error) => {
        console.error("Error updating training:", error);
      });
  };

  const columns: GridColDef[] = [
    { field: "activity", headerName: "Activity", width: 200 },
    { field: "date", headerName: "Date", width: 230 },
    { field: "duration", headerName: "Duration (min)", width: 150 },
    { field: "customerName", headerName: "Customer", width: 220 },
    { field: "customerEmail", headerName: "Customer email", width: 260 },
    {
      field: "actions",
      headerName: "",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => {
              setEditTraining({
                id: params.row.id,
                date: formatDateForInput(params.row.date),
                activity: params.row.activity,
                duration: String(params.row.duration),
              });
              setOpenEditDialog(true);
            }}
          >
            Edit
          </button>
          <button type="button" onClick={() => deleteTraining(params.row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container training-page">
      <h2 className="section-title">Trainings</h2>
      <div className="data-grid-wrapper">
        <DataGrid rows={trainings} columns={columns} />
      </div>

      <button className="primary-button" onClick={() => setOpenAdd(true)}>
        Add new training
      </button>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <div className="form-section">
            <div>
              <label htmlFor="new-training-date">Date and time:</label>
              <input
                id="new-training-date"
                type="datetime-local"
                value={newTraining.date}
                onChange={(e) =>
                  setNewTraining({ ...newTraining, date: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="new-training-activity">Activity:</label>
              <input
                id="new-training-activity"
                type="text"
                value={newTraining.activity}
                onChange={(e) =>
                  setNewTraining({ ...newTraining, activity: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="new-training-duration">Duration (minutes):</label>
              <input
                id="new-training-duration"
                type="number"
                value={newTraining.duration}
                onChange={(e) =>
                  setNewTraining({ ...newTraining, duration: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="new-training-customer">Customer link:</label>
              <input
                id="new-training-customer"
                type="text"
                value={newTraining.customerLink}
                onChange={(e) =>
                  setNewTraining({
                    ...newTraining,
                    customerLink: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              addTraining(e);
              setOpenAdd(false);
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit training</DialogTitle>
        <DialogContent>
          {editTraining && (
            <div className="form-section">
              <div>
                <label htmlFor="edit-training-date">Date and time:</label>
                <input
                  id="edit-training-date"
                  type="datetime-local"
                  value={editTraining.date}
                  onChange={(e) =>
                    setEditTraining({
                      ...editTraining,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-training-activity">Activity:</label>
                <input
                  id="edit-training-activity"
                  type="text"
                  value={editTraining.activity}
                  onChange={(e) =>
                    setEditTraining({
                      ...editTraining,
                      activity: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="edit-training-duration">Duration (minutes):</label>
                <input
                  id="edit-training-duration"
                  type="number"
                  value={editTraining.duration}
                  onChange={(e) =>
                    setEditTraining({
                      ...editTraining,
                      duration: e.target.value,
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
              updateTraining(e);
              setOpenEditDialog(false);
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setOpenEditDialog(false);
              setEditTraining(null);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TrainingList;