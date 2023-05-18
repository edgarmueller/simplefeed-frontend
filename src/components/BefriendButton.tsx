import { Button } from "@chakra-ui/react"
import { makeFriendRequest } from "../api/friend-requests"

export const BefriendButton = ({ username }: { username: string }) => {
		return (
			<>
			<Button onClick={() => makeFriendRequest(username)}>Befriend</Button>
			</>
		)
}