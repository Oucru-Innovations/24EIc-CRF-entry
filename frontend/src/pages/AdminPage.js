import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  getPossibleReasons,
  getEvents,
  createPossibleReason,
  createEvent,
  updatePossibleReason,
  updateEvent,
  deletePossibleReason,
  deleteEvent,
} from '../services/api';

function AdminPage() {
  const [reasons, setReasons] = useState([]);
  const [events, setEvents] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const [isReasonDialogOpen, setIsReasonDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  useEffect(() => {
    fetchReasons();
    fetchEvents();
  }, []);

  const fetchReasons = async () => {
    try {
      const response = await getPossibleReasons();
      setReasons(response);
    } catch (error) {
      console.error('Error fetching reasons:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddReason = () => {
    setDialogData({ id: null, reason: '' });
    setIsReasonDialogOpen(true);
  };

  const handleEditReason = (reason) => {
    setDialogData(reason);
    setIsReasonDialogOpen(true);
  };

  const handleDeleteReason = async (id) => {
    try {
      await deletePossibleReason(id);
      fetchReasons();
    } catch (error) {
      console.error('Error deleting reason:', error);
    }
  };

  const handleAddEvent = () => {
    setDialogData({ id: null, event: '' });
    setIsEventDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setDialogData(event);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveReason = async () => {
    try {
      if (dialogData.id) {
        await updatePossibleReason(dialogData.id, dialogData);
      } else {
        await createPossibleReason(dialogData);
      }
      fetchReasons();
      setIsReasonDialogOpen(false);
    } catch (error) {
      console.error('Error saving reason:', error);
    }
  };

  const handleSaveEvent = async () => {
    try {
      if (dialogData.id) {
        await updateEvent(dialogData.id, dialogData);
      } else {
        await createEvent(dialogData);
      }
      fetchEvents();
      setIsEventDialogOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        Admin Page
      </Typography>
      <Grid container spacing={4}>
        {/* Reasons Table */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Reasons
          </Typography>
          <DataGrid
            rows={reasons}
            columns={[
              { field: 'id', headerName: 'ID', width: 90 },
              { field: 'reason', headerName: 'Reason', width: 300, editable: false },
              {
                field: 'actions',
                headerName: 'Actions',
                width: 200,
                renderCell: (params) => (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditReason(params.row)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteReason(params.row.id)}
                    >
                      Delete
                    </Button>
                  </>
                ),
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
          />
          <Button variant="contained" color="primary" onClick={handleAddReason} style={{ marginTop: 16 }}>
            Add Reason
          </Button>
        </Grid>

        {/* Events Table */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Events
          </Typography>
          <DataGrid
            rows={events}
            columns={[
              { field: 'id', headerName: 'ID', width: 90 },
              { field: 'event', headerName: 'Event', width: 300, editable: false },
              {
                field: 'actions',
                headerName: 'Actions',
                width: 200,
                renderCell: (params) => (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditEvent(params.row)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteEvent(params.row.id)}
                    >
                      Delete
                    </Button>
                  </>
                ),
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
          />
          <Button variant="contained" color="primary" onClick={handleAddEvent} style={{ marginTop: 16 }}>
            Add Event
          </Button>
        </Grid>
      </Grid>

      {/* Reason Dialog */}
      <Dialog open={isReasonDialogOpen} onClose={() => setIsReasonDialogOpen(false)}>
        <DialogTitle>{dialogData?.id ? 'Edit Reason' : 'Add Reason'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason"
            value={dialogData?.reason || ''}
            onChange={(e) => setDialogData({ ...dialogData, reason: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReasonDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveReason} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onClose={() => setIsEventDialogOpen(false)}>
        <DialogTitle>{dialogData?.id ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Event"
            value={dialogData?.event || ''}
            onChange={(e) => setDialogData({ ...dialogData, event: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEventDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveEvent} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPage;
