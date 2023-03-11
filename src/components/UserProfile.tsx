import { redirect, useLoaderData } from "react-router-dom";
import { fetchProfile } from "../api/profile";
import { Profile } from "../domain.interface";

export async function loader({ params }: any): Promise<Profile | Response> {
	try {
  	return await fetchProfile(params.username);
	} catch (error) {
    return redirect("/sign-in");
  }
}

export const UserProfile = () => {
	const profile = useLoaderData() as Profile;

	return <>
		user profile for {profile.username}
	</>
}