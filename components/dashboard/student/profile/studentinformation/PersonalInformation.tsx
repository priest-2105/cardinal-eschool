'use client';

import { Button } from "@/components/dashboard/student/ui/button";
import { Card } from "@/components/dashboard/student/ui/card";
import { Input } from "@/components/dashboard/student/ui/input";
import { Label } from "@/components/dashboard/student/ui/label";
import PhoneInputField from "../../ui/phoneInputFeild";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/dashboard/student/ui/select";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchStudentProfile, updateStudentProfile, updateStudentProfilePicture } from "@/lib/api/student/api";
import { setUser } from "@/store/userSlice";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/student/ui/alert";
import Image from 'next/image';

export default function PersonalInformation() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    profile_picture: "",
    home_address: "",
    edu_level: "",
    country_of_residence: "",
    state_of_residence: "",
    employment_status: "",
  });
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState("/assets/img/dashboard/student/Ellipse 2034.png");
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(null);
  const [isPictureEditing, setIsPictureEditing] = useState(false);
  const [isPictureUploading, setIsPictureUploading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (token) {
          const response = await fetchStudentProfile(token);
          setProfile(response.data);
          setPhoneNumber(response.data.phone_number);
          setProfilePicture(response.data.profile_picture);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    getProfile();
  }, [token]);

  const handleUpdate = async () => {
    setIsEditing(true);
    try {
      if (token) {
        const response = await updateStudentProfile(token, {
          firstname: profile.firstname,
          lastname: profile.lastname,
          phone_number: phoneNumber,
          address: profile.home_address,
          edu_level: profile.edu_level,
          country: profile.country_of_residence,
          state: profile.state_of_residence,
          employment_status: profile.employment_status,
        });
        setAlert({ type: "success", message: "Profile updated successfully" });
        setIsEditable(false);
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.error("Profile update failed", error);
      setAlert({ type: "error", message: (error as Error).message });
    } finally {
      setIsEditing(false);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setTempProfilePicture(previewUrl);
      setIsPictureEditing(true);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (tempProfilePicture && token) {
      setIsPictureUploading(true);
      try {
        const fileInput = document.getElementById("profile-picture-upload") as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (file) {
          const response = await updateStudentProfilePicture(token, file);
          setProfilePicture(response.data.dp_url);
          setAlert({ type: 'success', message: 'Profile picture updated successfully' });

          // Trigger custom event to update header image
          const event = new CustomEvent("profilePictureUpdated", { detail: { dp_url: response.data.dp_url } });
          window.dispatchEvent(event);
        }
      } catch (error) {
        console.error("Profile picture update failed", error);
        setAlert({ type: 'error', message: (error as Error).message });
      } finally {
        setTempProfilePicture(null);
        setIsPictureUploading(false);
        setIsPictureEditing(false);
      }
    }
  };

  const handleCancelProfilePicture = () => {
    setTempProfilePicture(null);
    setIsPictureEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="sm:flex max-sm:block items-center gap-8">
          <div className="relative w-fit">
            <Image
              src={profile.profile_picture || profilePicture}
              alt="Profile"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full"
            />
            <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 rounded-full bg-white cursor-pointer">
              <PencilIcon className="h-4 w-4" />
            </label>
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal details and information
            </p>
          </div>
        </div>

        {isPictureEditing && (
          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={handleCancelProfilePicture}>Cancel</Button>
            <Button variant="default" onClick={handleSaveProfilePicture} disabled={isPictureUploading}>
              {isPictureUploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        )}

        {alert && (
          <Alert variant={alert.type === 'success' ? 'default' : 'danger'} className="absolute top-12 z-50 bg-white right-4">
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="sm:grid sm:grid-cols-2 gap-6 max-sm:block">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              value={profile.firstname}
              onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
              readOnly={!isEditable}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              value={profile.lastname}
              onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
              readOnly={!isEditable}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu_level">Grade</Label>
            <Select
              value={profile.edu_level}
              onValueChange={(value) => setProfile({ ...profile, edu_level: value })}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one"> Grade One</SelectItem>
                <SelectItem value="two"> Grade Two</SelectItem>
                <SelectItem value="three"> Grade Three</SelectItem>
                <SelectItem value="four"> Grade Four</SelectItem>
                <SelectItem value="five"> Grade Five</SelectItem>
                <SelectItem value="six"> Grade Six</SelectItem>
                <SelectItem value="seven"> Grade Seven</SelectItem>
                <SelectItem value="eight"> Grade Eight</SelectItem>
                <SelectItem value="nine"> Grade Nine</SelectItem>
                <SelectItem value="ten"> Grade Ten</SelectItem>
                <SelectItem value="eleven"> Grade Eleven</SelectItem>
                <SelectItem value="twelve"> Grade Twelve</SelectItem>
                <SelectItem value="other"> other</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment_status">Employment Status</Label>
            <Select
              value={profile.employment_status}
              onValueChange={(value) => setProfile({ ...profile, employment_status: value })}
              disabled={!isEditable}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employed">Employed</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <PhoneInputField
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              country="us"
              readOnly={!isEditable}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="home_address">Home Address</Label>
            <Input
              id="home_address"
              value={profile.home_address}
              onChange={(e) => setProfile({ ...profile, home_address: e.target.value })}
              readOnly={!isEditable}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country_of_residence">Country of Residence</Label>
            <Input
              id="country_of_residence"
              value={profile.country_of_residence}
              onChange={(e) => setProfile({ ...profile, country_of_residence: e.target.value })}
              readOnly={!isEditable}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state_of_residence">State of Residence</Label>
            <Input
              id="state_of_residence"
              value={profile.state_of_residence}
              onChange={(e) => setProfile({ ...profile, state_of_residence: e.target.value })}
              readOnly={!isEditable}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {isEditable ? (
            <>
              <Button variant="outline" onClick={() => setIsEditable(false)}>Cancel</Button>
              <Button variant="default" onClick={handleUpdate} disabled={isEditing}>
                {isEditing ? 'Updating...' : 'Update Your Profile'}
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => setIsEditable(true)}>Edit</Button>
          )}
        </div>
      </div>
    </Card>
  )
}

function PencilIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}
