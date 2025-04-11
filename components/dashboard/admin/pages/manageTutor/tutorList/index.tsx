"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { AddTutorModal } from "../addTutorModal/index";
import { getTutors } from "@/lib/api/admin/managetutor/fetchtutors";
import { RootState } from "@/lib/store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Tutor {
  tutor_codec: string;
  name: string;
  email: string;
  qualification: string | null;
  dp_url: string | null;
}

export function TutorList() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTutorModalOpen, setIsAddTutorModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        if (token) {
          const tutors = await getTutors(token);
          setTutors(tutors);
        }
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
        setAlert({ type: "error", message: "Failed to fetch tutors. Please try again later." });
      }
    };

    fetchTutors();
  }, [token]);

  const handleRowClick = (tutor: Tutor) => {
    router.push(`/admin/tutor/${tutor.tutor_codec}`);
  };

  const handleAddTutor = (newTutor: Tutor) => {
    setTutors([...tutors, newTutor]);
    setIsAddTutorModalOpen(false);
  };

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Manage Tutors</h2>
          <Button onClick={() => setIsAddTutorModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Tutor
          </Button>
        </div>

        {alert && (
          <Alert variant={alert.type === "success" ? "default" : "danger"} className="mb-4 absolute top-16 bg-white right-4">
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tutors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Name</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[25%]">Qualification</TableHead>
                    <TableHead className="w-[25%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTutors.map((tutor) => (
                    <TableRow
                      key={tutor.tutor_codec}
                      onClick={() => handleRowClick(tutor)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell className="w-[25%]">{tutor.name}</TableCell>
                      <TableCell className="w-[25%]">{tutor.email}</TableCell>
                      <TableCell className="w-[25%]">{tutor.qualification || "Unavailable"}</TableCell>
                      <TableCell className="w-[25%]">
                        <Button variant="default" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <AddTutorModal
        isOpen={isAddTutorModalOpen}
        onClose={() => setIsAddTutorModalOpen(false)}
        onAddTutor={(tutorData) => {
          const newTutor: Tutor = {
            ...tutorData,
            qualification: tutorData.qualification || null,
            dp_url: tutorData.dp_url || null,
          };
          handleAddTutor(newTutor);
        }}
      />
    </div>
  );
}

