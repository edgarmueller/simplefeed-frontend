import { useEffect, useState } from "react"
import Avatar from "react-avatar"
import ClipLoader from "react-spinners/ClipLoader";
import { fetchProfile } from "../api/profile"
import { Profile } from "../domain.interface"
import { useAuth } from "../lib/auth/hooks/useAuth"

export const UserDetail = () => {
	const [isLoading, setIsLoading] = useState(false)

	const [profile, setProfile] = useState<Profile | null>(null)
	const { user } = useAuth()

	useEffect(() => {
		const fetchProfileInfo = async () => {
			if (!user?.username) return
			setIsLoading(true)
			try {
				const profile = await fetchProfile(user?.username)
				setProfile(profile)
				setIsLoading(false)
			} catch (error) {
				// TODO: handle error
				setIsLoading(false)
			}
		}
		fetchProfileInfo()
	}, [user?.username]);
	
	if (isLoading) {
		return <ClipLoader />
	}

	return (
		<>
			<div className="user_details">
				<Avatar name={user?.username} size="50" round={true} src={profile?.imageUrl} />
				{profile?.firstName} {profile?.lastName}
				<br />
				Likes: {profile?.nrOfLikes}
			</div>
		</>
	)
}