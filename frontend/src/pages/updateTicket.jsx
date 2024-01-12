import { React,  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAsync, getTicket, reset } from '../features/tickets/ticketSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAllUsers } from '../features/auth/authSlice';
import { getAllIssueTypes } from '../features/issues/issueSlice';
import { getAllOrganization } from '../features/organization/organizationSlice';
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";
import {
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import BackButton from '../components/BackButton';
import MediaUpload from './ImageUpload';

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const userRole = useSelector(state => state.auth.user.role); 
  const organizations = useSelector(state => state.organizations.organizations);
  const dispatch = useDispatch();

  // State for form data including media
  const [formData, setFormData] = useState({
    customerName: '',
    description: '',
    product: '',
    priority: '',
    assignedTo: '',
    organization: '',
    issueType: '',
    customerEmail: '',
    customerContact: '',
  });

  // State to store selected media files
 // const [media, setMedia] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.tickets
  );
 

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR"];
  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      
      navigate(`/ticket/${ticket._id}`);
      toast.success("Ticket updated!");
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, navigate, message, reset]);


  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        customerName: ticket.customerName,
        description: ticket.description,
        product: ticket.product,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        issueType: ticket.issueType,
        customerEmail: ticket.customerEmail,
        organization: ticket.organization,
        customerContact: ticket.customerContact,
        title : ticket.title
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

   const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData({ ...formData, [name]: value });

   
  };

  useEffect(() => {
    // Check if organization is selected
    if (formData.organization) {
      // Filter users based on roles whenever the organization or users data changes
      const allowedRoles = ["ADMIN", "SUPERVISOR", "ORGAGENT"];
      const filteredUsersByRole = users.filter(
        (user) => user.organization === formData.organization && allowedRoles.includes(user.role)
      );

      // Update the filteredUsers state
      setFilteredUsers(filteredUsersByRole);
    } else {
      // If no organization is selected, set filteredUsers to the entire list of users
      setFilteredUsers(users);
    }
  }, [formData.organization, users]);
/*
  // Function to handle media file selection
  const handleMedia = (e) => {
    const selectedMedia = e.target.files;
    const mediaArray = [];

    for (let i = 0; i < selectedMedia.length; i++) {
      const file = selectedMedia[i];
      setFileToBase(file, (base64Media) => {
        mediaArray.push(base64Media);

        if (i === selectedMedia.length - 1) {
          setMedia(mediaArray);
        }
      });
    }
  };

  // Function to convert file to base64
  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Media = reader.result;
      callback(base64Media);
    };
  };
*/
  const handleSubmit = (e, status) => {
    e.preventDefault();
    
    // Dispatch the updateTicketAsync action with media data
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
        //  media, // Include the selected media files
          product: formData.product,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        organization: formData.organization,
        issueType: formData.issueType,
        customerEmail: formData.customerEmail,
        customerContact: formData.customerContact,
        title: formData.title,
        status: status === "new" ? "new" : status

        },
      })
    );
  };

 

 // Check if the user has one of the allowed roles
 if (!["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"].includes(userRole)) {
  // Handle unauthorized access, e.g., redirect or show an error message
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

if (isLoading) return <Spinner />;

  return (
    <>
    <BackButton url="/" />
    <section className="flex items-center justify-center ">
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
        Update Ticket
        </Typography>
        <Typography variant="body2">
          Please fill out the form below
        </Typography>
        <Typography variant="body2">
        Ticket ID: {ticket._id}
        </Typography>
       
      </div>
    </section>
   
      <form onSubmit={handleSubmit} className="p-6">
        <Grid container spacing={3}>
        <Grid item xs={12}>
            <TextField
              label=" Ticket title"
              name="title"
              value={formData.title}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Customer Email"
              name="customerEmail"
              value={formData.customerEmail}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Customer Contact"
              name="customerContact"
              value={formData.customerContact}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="organization">Organization</InputLabel>
              <Select
                name="organization"
                id="organization"
                value={formData.organization}
                onChange={handleChange}
              >
                <MenuItem value="">Select One</MenuItem>
                {organizations && organizations.length > 0 ? (
                organizations.map((organization) => (
                  <MenuItem key={organization._id} value={organization._id}>
                    {organization.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No organization available
                </MenuItem>
              )}
              </Select>
            </FormControl>
          </Grid>

          {userRole && allowedRoles.includes(userRole) && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="assignedTo">Assign To</InputLabel>
                <Select
                  name="assignedTo"
                  id="assignedTo"
                  value={formData.assignedTo}
            onChange={handleChange}
                >
                  <MenuItem value="">Select One</MenuItem>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No users available for the selected organization
                    </MenuItem>
                  )}
                </Select>
                
              </FormControl>
            </Grid>
          )}

<Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="product">Product Name</InputLabel>
              <Select
                name="product"
                id="product"
                value={formData.product}
                onChange={handleChange}
              >
                <MenuItem value="Ecommerce">Ecommerce</MenuItem>
                <MenuItem value="Employee management system">
                  Employee management system
                </MenuItem>
                <MenuItem value="HR management system">
                  HR management system
                </MenuItem>
                <MenuItem value="CMS">CMS</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {userRole && allowedRoles.includes(userRole) && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="priority">Priority</InputLabel>
                <Select
                  name="priority"
                  id="priority"
                  value={formData.priority}
              onChange={handleChange}
                >
                  <MenuItem value="">Select One</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
 
 <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="issueType">Issue Type</InputLabel>
              <Select
                name="issueType"
                id="issueType"
                value={formData.issueType}
                onChange={handleChange}
              >
                <MenuItem value="">Select One</MenuItem>
                {issues && issues.length > 0 ? (
                  issues.map((issue) => (
                    <MenuItem key={issue._id} value={issue._id}>
                      {issue.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No issue available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description of the issue"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
{/*
          <Grid item xs={12}>
            <div className="form-outline mb-4">
              <label
                htmlFor="formupload"
                className="bg-yellow-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-yellow-700"
              >
                Update Media (Images and Videos)
                <input
                    onChange={handleMedia}
                  type="file"
                  id="formupload"
                  name="media"
                  className="hidden"
                  accept="image/*, video/*"
                  multiple
                />
              </label>
            </div>
            {media.length > 0 && (
          <div className="selected-media">
            <Typography variant="body2" gutterBottom>
                  Selected Media:
                </Typography>
                <div className="media-items-container">
            {media.map((mediaItem, index) => (
              <div key={index} className="media-item">
                {mediaItem.startsWith('data:image') ? (
                  <img
                    src={mediaItem}
                    alt={`Selected Image ${index + 1}`}
                    className="img-preview max-w-full max-h-32"
                  />
                ) : (
                  <video
                    controls
                    src={mediaItem}
                    alt={`Selected Video ${index + 1}`}
                    className="video-preview max-w-full max-h-32"
                  />
                )}
              </div>
            ))}
            </div>
          </div>
        )}
          </Grid>
          */}
          </Grid>
          <MediaUpload ticketID={ticket._id} />
        <div className="form-group mt-6 space-x-6">
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            type="submit"
          >
            Update Ticket
          </Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<SendIcon />}
            onClick={(e) => handleSubmit(e, "new")}
          >
            Submit as New
          </Button>
        </div>
       
      </form>
     
    </>
  );
};

export default UpdateProductPage;



// UpdateProductPage.js
{/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicketAsync, getTicket } from '../features/tickets/ticketSlice';
import { useParams } from 'react-router-dom';

const UpdateProductPage = () => {
  const { ticketId } = useParams();
  const { ticket } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customerName: '', // Initialize with an empty string
    description: '',  // Initialize with an empty string
  });

  useEffect(() => {
    // Fetch the ticket data from the store and update the form data
    if (ticket && ticket._id === ticketId) {
      setFormData({
        customerName: ticket.customerName,
        description: ticket.description,
      });
    } else {
      // If the ticket data is not available in the store, fetch it
      dispatch(getTicket(ticketId));
    }
  }, [ticketId, ticket, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dispatch the updateTicketAsync action
    dispatch(
      updateTicketAsync({
        ticketId,
        updatedTicketData: {
          customerName: formData.customerName,
          description: formData.description,
        },
      })
    );
  };

  return (
    <div>
      <h2>Update Ticket</h2>
      <h2>{ticket._id}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerName">Customer Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Ticket</button>
      </form>
    </div>
  );
};

export default UpdateProductPage;*/}


