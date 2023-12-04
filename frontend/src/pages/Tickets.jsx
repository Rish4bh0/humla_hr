import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getTickets, reset, getAllTickets } from "../features/tickets/ticketSlice";
import TicketItem from "../components/TicketItem";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";


function Tickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.user.role); // Retrieve the user's role from Redux state
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // You can adjust this number as needed
  const newTickets = Array.isArray(tickets) ? tickets.filter((ticket) => ticket.status === "new") : [];
  const openTickets = Array.isArray(tickets) ? tickets.filter((ticket) => ticket.status === "open") : [];
  const reviewTickets = Array.isArray(tickets) ? tickets.filter((ticket) => ticket.status === "review") : [];
  const closedTickets = Array.isArray(tickets) ? tickets.filter((ticket) => ticket.status === "close") : [];

  const filteredTickets =
    activeTab === "new" ? newTickets : activeTab === "open" ? openTickets : activeTab === "review" ? reviewTickets : closedTickets;

  // Paginate the filtered tickets
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);


  useEffect(() => {
    dispatch(getAllTickets());
    dispatch(getTickets());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(getAllIssueTypes())
    dispatch(getAllOrganization())
  }, [dispatch]);

 
  

  if (isLoading) return <Spinner />;

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

 // Check if the user has one of the allowed roles
 if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
  // Handle unauthorized access, e.g., redirect or show an error message
  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}
  return (
    <>
      <BackButton url="/" />
      <div className="tab-buttons">
        <button
          className={`btn btn-reverse btn-back ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          New Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "open" ? "active" : ""}`}
          onClick={() => setActiveTab("open")}
        >
          Open Tickets
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "review" ? "active" : ""}`}
          onClick={() => setActiveTab("review")}
        >
          Tickets on review
        </button>
        <button
          className={`btn btn-reverse btn-back ${activeTab === "closed" ? "active" : ""}`}
          onClick={() => setActiveTab("closed")}
        >
          Closed Tickets
        </button>
      </div>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Issue Type</div>
          <div>Status</div>
          <div>Organization</div>
          <div>Actions</div>
        </div>
        {paginatedTickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
      <div className="tab-buttons">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn btn-reverse btn-back ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
}

export default Tickets;
