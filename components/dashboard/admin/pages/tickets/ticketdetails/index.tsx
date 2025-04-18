"use client"

import { useState, useEffect } from "react";
import { useRouter  } from "next/navigation";
import { fetchTicketDetails } from "@/lib/api/admin/ticket/tickedetails";
import { Button } from "@/components/dashboard/admin/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/admin/ui/card";
import { Label } from "@/components/dashboard/admin/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert";
import { ConfirmationModal } from "../confirmationModal/index";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ReplyTicket } from "@/lib/api/admin/api";
import { DeleteTicket } from "@/lib/api/admin/ticket/deleteticket";

interface Ticket {
    ticket_id: string;
    subject: string;
    status: string;
    department: string;
    body: string;
    ticket_response: string;
    created_at: string;
    updated_at: string;
    owner: {
        name: string;
        email: string;
    };
}

interface TicketDetailsComponentProps {
  ticketId: string;
}

interface AlertState {
  showAlert: boolean;
  message: string;
  variant: "default" | "danger" | "warning";
}

interface ConfirmationModalState {
  showConfirmModal: boolean;
}

interface DeleteModalState {
  showDeleteModal: boolean;
}

export default function TicketDetailsComponent({ ticketId }: TicketDetailsComponentProps) {
  const decodedTicketId = decodeURIComponent(ticketId); 
  const token: string | null = useSelector((state: RootState) => state.auth?.token ?? null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [alertState, setAlertState] = useState<AlertState>({ showAlert: false, message: "", variant: "default" });
  const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalState>({ showConfirmModal: false });
  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({ showDeleteModal: false });
  const [responseMessage, setResponseMessage] = useState(""); 
  const [responseStatus, setResponseStatus] = useState<"in_progress" | "resolved" | "closed">("in_progress");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (token && decodedTicketId) {
          const response = await fetchTicketDetails(token, decodedTicketId);
          setTicket(response.data);
          setResponseMessage(response.data.ticket_response || "");  
        } else {
          // console.error("Token or Ticket ID is missing.", token, decodedTicketId);
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchDetails();
  }, [decodedTicketId, token]);  

  const confirmCloseTicket = async () => {
    setTicket((prevTicket) => (prevTicket ? { ...prevTicket, status: "Closed" } : null));
    setConfirmModalState({ showConfirmModal: false });
    setAlertState({ showAlert: true, message: "The ticket has been closed successfully.", variant: "default" });
    setTimeout(() => {
      setAlertState({ showAlert: false, message: "", variant: "default" });
      router.push("/admin/ticketlist");
    }, 2000);
  };

  const handleReplyTicket = async () => {
    setIsSubmitting(true); 
    try {
      if (token && decodedTicketId) {
        const response = await ReplyTicket(token, decodedTicketId, {
          ticket_response: responseMessage,
          status: responseStatus,
        });
        // console.log("ReplyTicket API Response:", response);  
        setTicket(response.data); 
        setAlertState({ showAlert: true, message: "Response added successfully.", variant: "default" });
        setResponseMessage(response.data.ticket_response || ""); 
        setResponseStatus("in_progress"); 
      } else {
        console.error("Token or Ticket ID is missing.");
      }
    } catch (error) {
      console.error("Error responding to ticket:", error);
      setAlertState({ showAlert: true, message: "Failed to add response.", variant: "danger" });
    } finally {
      setIsSubmitting(false); 
      const fetchDetails = async () => {
        if (token && decodedTicketId) {
          const response = await fetchTicketDetails(token, decodedTicketId);
          setTicket(response.data);
        }
      };
      fetchDetails();
    }
  };

  const handleDeleteTicket = async () => {
    setIsSubmitting(true);
    try {
      if (token && decodedTicketId) {
        const response = await DeleteTicket(token, decodedTicketId);
        console.log("DeleteTicket API Response:", response); 
        setAlertState({ showAlert: true, message: "Ticket deleted successfully.", variant: "default" });
        setTimeout(() => {
          router.push("/admin/ticketlist"); 
        }, 2000);
      } else {
        console.error("Token or Ticket ID is missing.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setAlertState({ showAlert: true, message: "Failed to delete ticket.", variant: "danger" });
    } finally {
      setIsSubmitting(false); 
      setDeleteModalState({ showDeleteModal: false }); 
    }
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div>
      {/* Alert Notification */}
      {alertState.showAlert && (
        <Alert
          variant={alertState.variant}
          onClose={() => setAlertState({ ...alertState, showAlert: false })}
          className="fixed top-12 bg-white right-4 z-50"
        >
          <AlertTitle>{alertState.variant === "danger" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alertState.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket #{ticket.ticket_id}</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setDeleteModalState({ showDeleteModal: true })}
            variant="danger"
            disabled={isSubmitting}
          >
            Delete Ticket
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.showDeleteModal}
        onClose={() => setDeleteModalState({ showDeleteModal: false })}
        onConfirm={handleDeleteTicket}
        title="Delete Ticket"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">User Name</Label>
              <p>{ticket.owner.name}</p>
            </div>
            <div>
              <Label className="font-semibold">User Email</Label>
              <p>{ticket.owner.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Created At</Label>
              <p>{new Date(ticket.created_at).toLocaleString()}</p>
            </div>
            <div>
              <Label className="font-semibold">Last Updated</Label>
              <p>{new Date(ticket.updated_at).toLocaleString()}</p>
            </div>
            <div>
              <Label className="font-semibold">Status</Label>
              <p>{ticket.status}</p>
            </div>
            <div>
              <Label className="font-semibold">Department</Label>
              <p>{ticket.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{ticket.body}</p>
        </CardContent>
      </Card>


      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{ticket?.ticket_response}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Respond to Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 outline-none border rounded-md"
            placeholder="Enter your response here..."
            value={responseMessage} 
            onChange={(e) => setResponseMessage(e.target.value)}
            disabled={isSubmitting} 
          />
          <select
            className="w-full p-2 mt-2 border rounded-md"
            value={responseStatus}
            onChange={(e) => setResponseStatus(e.target.value as "in_progress" | "resolved" | "closed")}
            disabled={isSubmitting}
          >
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Button
            onClick={handleReplyTicket}
            className="mt-4"
            variant="default"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Response"}
          </Button>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={confirmModalState.showConfirmModal}
        onClose={() => setConfirmModalState({ showConfirmModal: false })}
        onConfirm={confirmCloseTicket}
        title="Close Ticket"
        description="Are you sure you want to close this ticket? This action cannot be undone."
      />
    </div>
  );
}

