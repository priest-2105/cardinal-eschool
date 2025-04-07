"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAnnouncementDetails, EditAnnouncement, deleteAnnouncement } from "@/lib/api/admin/api";
import { Alert } from "@/components/dashboard/admin/ui/alert";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft,  Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { formatDate } from "@/utils/dateformat";

interface Announcement {
  id: string;
  title: string;
  content: string;
  message: string; 
  recipients: "students" | "tutors" | "both";
  target_role: "students" | "tutors" | "both"; 
  status: "active" | "inactive" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export function AnnouncementDetails({ announcementId }: { announcementId: string }) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth?.token);
  const [announcement, setAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedRecipients, setEditedRecipients] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        if (!token) {
          throw new Error("Token is required to fetch announcement details.");
        }
        const data = await getAnnouncementDetails(token, Number(announcementId));
        setAnnouncement(data);
        setEditedTitle(data.title);
        setEditedContent(data.message);
        setEditedRecipients(data.target_role);
      } catch (error) {
        setAlertMessage({ type: "danger", message: error.message });
      }
    };
    fetchAnnouncement();
  }, [announcementId, token]);

  const handleBack = () => {
    router.push("/admin/announcements")
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTitle(announcement?.title)
    setEditedContent(announcement?.content)
    setEditedRecipients(announcement?.recipients)
  }

  const handleSave = async () => {
    try {
      const updatedData = await EditAnnouncement(
        { title: editedTitle, message: editedContent, target_role: editedRecipients },
        token,
        Number(announcementId)
      );
      setAnnouncement(updatedData);
      setIsEditing(false);
      setAlertMessage({ type: "success", message: "Announcement updated successfully" });
    } catch (error) {
      setAlertMessage({ type: "danger", message: error.message });
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteAnnouncement(token, Number(announcementId));
      setAlertMessage({ type: "success", message: "Announcement deleted successfully" });
      router.push("/admin/announcements");
    } catch (error) {
      setAlertMessage({ type: "danger", message: error.message });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      case "draft":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Draft</Badge>
      default:
        return null
    }
  }

  if (!announcement) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl p-6">
      {alertMessage && <div className="bg-white top-8 right-4"><Alert variant={alertMessage.type} onClose={() => setAlertMessage(null)}>{alertMessage.message}</Alert></div>}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Announcements
        </Button>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button onClick={handleDelete} variant="danger">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{isEditing ? "Edit Announcement" : "Announcement Details"}</CardTitle>
            {!isEditing && getStatusBadge(announcement?.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input id="title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} required />
              ) : (
                <p className="text-lg font-medium">{announcement?.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              {isEditing ? (
                <Select
                  value={editedRecipients}
                  onValueChange={(value: "students" | "tutors" | "both") => setEditedRecipients(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="tutor">Tutors</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p>{announcement?.target_role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              {isEditing ? (
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              ) : (
                <p className="whitespace-pre-wrap">{announcement?.message}</p>
              )}
            </div>

            <div className="text-sm text-gray-500">
              <p><b>Created:</b> {formatDate(announcement?.created_at)}</p>
              <p><b>Last updated:</b>{formatDate(announcement?.updated_at)}</p>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

