'use client'

import { Button } from "@/components/dashboard/admin/ui/button"
import { Card } from "@/components/dashboard/admin/ui/card"
import { Input } from "@/components/dashboard/admin/ui/input"
import { Label } from "@/components/dashboard/admin/ui/label"
import PhoneInputField from "../../ui/phoneInputFeild"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store"
import { fetchAdminProfile, updateAdminProfile } from "@/lib/api/admin/api"
import { setUser } from "@/store/userSlice"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import Image from 'next/image';

export default function PersonalInformation() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isEditable, setIsEditable] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone_number: '',
    home_address: '',
    country_of_residence: '',
    state_of_residence: '',
    position: 'Admin'
  })
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (token) {
          const response = await fetchAdminProfile(token);
          setProfile(response.data);
          setPhoneNumber(response.data.phone_number);
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
        const response = await updateAdminProfile(token, {
          firstname: profile.firstname,
          lastname: profile.lastname,
          phone_number: phoneNumber,
          address: profile.home_address,
          country: profile.country_of_residence,
          state: profile.state_of_residence,
          position: profile.position
        });
        setAlert({ type: 'success', message: 'Profile updated successfully' });
        setIsEditable(false);
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.error("Profile update failed", error);
      setAlert({ type: 'error', message: (error as Error).message });
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="sm:flex max-sm:block items-center gap-8">
          <div className="relative w-fit">
            <Image 
              src="/assets/img/dashboard/admin/Ellipse 2034.png" 
              alt="Profile" 
              width={96}  // set the desired width
              height={96} // set the desired height
              className="rounded-full"
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full bg-white"
              onClick={() => setIsEditable(true)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal details and information
            </p>
          </div>
        </div>

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
            <Label htmlFor="email">Email Address</Label>
            <Input readOnly id="email" type="email" value={profile.email} />
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
