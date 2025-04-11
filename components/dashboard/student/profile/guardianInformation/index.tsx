"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchGuardianProfile, updateGuardianProfile } from "@/lib/api/student/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import { Button } from "@/components/dashboard/student/ui/button";
import { Input } from "@/components/dashboard/student/ui/input";
import { Label } from "@/components/dashboard/student/ui/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/dashboard/student/ui/select";

export default function GuardianInformation() {
  const token = useSelector((state: RootState) => state.auth?.token);

  const [profile, setProfile] = useState({
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    guardian_gender: "",
    guardian_country: "",
    guardian_state: "",
    guardian_address: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"default" | "danger">("default");

  useEffect(() => {
    const loadGuardianProfile = async () => {
      if (!token) return;

      try {
        const response = await fetchGuardianProfile(token);
        setProfile({
          guardian_name: response.data.name,
          guardian_email: response.data.email,
          guardian_phone: response.data.guardian_phone_no,
          guardian_gender: response.data.gender,
          guardian_country: response.data.country,
          guardian_state: response.data.state,
          guardian_address: response.data.address,
        });
      } catch (error) {
        console.error("Failed to fetch guardian profile:", error);
        setAlertMessage("Failed to load guardian profile. Please try again.");
        setAlertVariant("danger");
      }
    };

    loadGuardianProfile();
  }, [token]);

  const handleUpdate = async () => {
    if (!token) return;

    setIsUpdating(true);
    setAlertMessage(null);

    try {
      const response = await updateGuardianProfile(token, profile);
      setAlertMessage(response.message || "Guardian profile updated successfully!");
      setAlertVariant("default");
      setIsEditable(false);
    } catch (error) {
      console.error("Failed to update guardian profile:", error);
      setAlertMessage("Failed to update guardian profile. Please try again.");
      setAlertVariant("danger");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg">     
      {alertMessage && (
        <Alert variant={alertVariant} className="fixed top-16 bg-white right-4" onClose={() => setAlertMessage(null)}>
          <AlertTitle>{alertVariant === "default" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <h2 className="text-2xl font-bold  mb-4">Guardian Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="guardian_name">Name</Label>
          <Input
            id="guardian_name"
            value={profile.guardian_name}
            onChange={(e) => setProfile({ ...profile, guardian_name: e.target.value })}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <Label htmlFor="guardian_email">Email</Label>
          <Input
            id="guardian_email"
            type="email"
            value={profile.guardian_email}
            onChange={(e) => setProfile({ ...profile, guardian_email: e.target.value })}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <Label htmlFor="guardian_phone">Phone</Label>
          <PhoneInput
            country={"us"}
            value={profile.guardian_phone}
            onChange={(phone) => setProfile({ ...profile, guardian_phone: phone })}
            inputClass={!isEditable ? "read-only-input" : ""}
            disabled={!isEditable}
          />
        </div>
        <div>
          <Label htmlFor="guardian_gender">Gender</Label>
          <Select
            value={profile.guardian_gender}
            onValueChange={(value) => setProfile({ ...profile, guardian_gender: value })}
            disabled={!isEditable}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="guardian_country">Country</Label>
          <Input
            id="guardian_country"
            value={profile.guardian_country}
            onChange={(e) => setProfile({ ...profile, guardian_country: e.target.value })}
            readOnly={!isEditable}
          />
        </div>
        <div>
          <Label htmlFor="guardian_state">State</Label>
          <Input
            id="guardian_state"
            value={profile.guardian_state}
            onChange={(e) => setProfile({ ...profile, guardian_state: e.target.value })}
            readOnly={!isEditable}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="guardian_address">Address</Label>
          <Input
            id="guardian_address"
            value={profile.guardian_address}
            onChange={(e) => setProfile({ ...profile, guardian_address: e.target.value })}
            readOnly={!isEditable}
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        {isEditable ? (
          <>
            <Button variant="outline" className="mr-4" onClick={() => setIsEditable(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </>
        ) : (
          <Button variant="default" onClick={() => setIsEditable(true)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
