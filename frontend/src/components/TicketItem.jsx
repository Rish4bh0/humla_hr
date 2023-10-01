import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

function TicketItem({ ticket }) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Access the users array from the Redux state
  const users = useSelector((state) => state.auth.users);

  // Find the user object with the same ID as the ticket's assignedTo ID
  const assignedUser = users.find((user) => user._id === ticket.assignedTo);

  // Extract the name of the assigned user (if found)
  const assignedToName = assignedUser ? assignedUser.name : "Unassigned";

  return (
    <div className="ticket">
      <div>{new Date(ticket.createdAt).toLocaleString("en-US", options)}</div>
      <div>{ticket.product}</div>
      <div>{assignedToName}</div> {/* Display the user's name */}
      <div className={`priority priority-${ticket.priority}`}>{ticket.priority}</div>
      <div>{ticket.issueType}</div>
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      <div className="icon-buttons">
        <IconButton component={Link} to={`/ticket/${ticket._id}`} className="btn btn-reverse btn-sm">
          <VisibilityIcon />
        </IconButton>
        <IconButton component={Link} to={`/ticket/${ticket._id}/update`} className="btn btn-reverse btn-sm">
          <EditIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default TicketItem;
