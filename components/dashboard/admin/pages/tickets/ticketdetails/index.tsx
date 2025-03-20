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

export default function TicketDetailsComponent({ ticketId }: TicketDetailsComponentProps) {
  const token: string | null = useSelector((state: RootState) => state.auth?.token);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [alertState, setAlertState] = useState<AlertState>({ showAlert: false, message: "", variant: "default" });
  const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalState>({ showConfirmModal: false });
  const [responseMessage, setResponseMessage] = useState("");
  const [responseStatus, setResponseStatus] = useState<"in_progress" | "resolved" | "closed">("in_progress");
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for submitting response
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (token && ticketId) {
          const response = await fetchTicketDetails(token, ticketId);
          setTicket(response.data);
        } else {
          console.error("Token or Ticket ID is missing.", token, ticketId);
        }
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchDetails();
  }, [ticketId, token]); // Triggered when ticketId or token changes

  const handleCloseTicket = async () => {
    setConfirmModalState({ showConfirmModal: true });
  };

  const confirmCloseTicket = async () => {
    setTicket((prevTicket) => (prevTicket ? { ...prevTicket, status: "Closed" } : null));
    setConfirmModalState({ showConfirmModal: false });
    setAlertState({ showAlert: true, message: "The ticket has been closed successfully.", variant: "default" });
    setTimeout(() => {
      setAlertState({ showAlert: false, message: "", variant: "default" });
      router.push("/admin/tickets");
    }, 2000);
  };

  const handleReplyTicket = async () => {
    setIsSubmitting(true);
    try {
      if (token && ticketId) {
        const response = await ReplyTicket(token, ticketId, {
          ticket_response: responseMessage,
          status: responseStatus,
        });
        console.log("ReplyTicket API Response:", response);
        setTicket(response.data); 
        setAlertState({ showAlert: true, message: "Response added successfully.", variant: "default" });
        setResponseMessage(""); 
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
        if (token && ticketId) {
          const response = await fetchTicketDetails(token, ticketId);
          setTicket(response.data);
        }
      };
      fetchDetails();
    }
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg shadow-md">
      {/* Alert Notification */}
      {alertState.showAlert && (
        <Alert
          variant={alertState.variant}
          onClose={() => setAlertState({ ...alertState, showAlert: false })}
        >
          <AlertTitle>{alertState.variant === "danger" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alertState.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket #{ticket.ticket_id}</h2>
        {/* <Button onClick={handleCloseTicket} variant="danger">
          Close Ticket
        </Button> */}
      </div>

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
            disabled={isSubmitting} // Disable select while submitting
          >
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Button
            onClick={handleReplyTicket}
            className="mt-4"
            variant="default"
            disabled={isSubmitting} // Disable button while submitting
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

