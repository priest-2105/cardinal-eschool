"use client"

import { useState, useEffect } from "react";
import { useRouter  } from "next/navigation";
import { fetchTicketDetails } from "@/lib/api/admin/ticket/tickedetails";
import { Button } from "@/components/dashboard/admin/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/admin/ui/card";
import { Label } from "@/components/dashboard/admin/ui/label";
import Popup from "@/components/dashboard/admin/ui/Popup";
import { ConfirmationModal } from "../confirmationModal/index";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Ticket {
    ticket_id: string;
    subject: string;
    status: string;
    department: string;
    body: string;
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

interface PopupState {
  showPopup: boolean;
  popupMessage: string;
}

interface ConfirmationModalState {
  showConfirmModal: boolean;
}

export default function TicketDetailsComponent({ ticketId }: TicketDetailsComponentProps) {
  const token: string | null = useSelector((state: RootState) => state.auth?.token);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [popupState, setPopupState] = useState<PopupState>({ showPopup: false, popupMessage: "" });
  const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalState>({ showConfirmModal: false });
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
  }, [ticketId, token]);

  const handleCloseTicket = async () => {
    setConfirmModalState({ showConfirmModal: true });
  };

  const confirmCloseTicket = async () => {
    setTicket((prevTicket) => (prevTicket ? { ...prevTicket, status: "Closed" } : null));
    setConfirmModalState({ showConfirmModal: false });
    setPopupState({ showPopup: true, popupMessage: "The ticket has been closed successfully." });
    setTimeout(() => {
      setPopupState({ showPopup: false, popupMessage: "" });
      router.push("/admin/tickets");
    }, 2000);
  };

  if (!ticket) {
    return <p>Loading ticket details...</p>;
  }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket #{ticket.ticket_id}</h2>
        <Button onClick={handleCloseTicket} variant="danger">
          Close Ticket
        </Button>
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

      {popupState.showPopup && <Popup message={popupState.popupMessage} onClose={() => setPopupState({ ...popupState, showPopup: false })} />}

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

