import { useEffect, useState } from "react";
import { Box, Card, CardHeader, CardBody, Image, Heading, Text, Stack } from "@chakra-ui/react";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchProfile } from "../api/profile";
import { Profile } from "../domain.interface";
import { useAuth } from "../lib/auth/hooks/useAuth";

export const UserDetail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      if (!user?.username) return;
      setIsLoading(true);
      try {
        const profile = await fetchProfile(user?.username);
        setProfile(profile);
        setIsLoading(false);
      } catch (error) {
        // TODO: handle error
        setIsLoading(false);
      }
    };
    fetchProfileInfo();
  }, [user?.username]);

  if (isLoading) {
    return <ClipLoader />;
  }

  return (
    <Card>
      <CardHeader>
        <Heading>
          {profile?.firstName} {profile?.lastName} <br />
				</Heading>
      </CardHeader>
      <CardBody>
				<Image
					src={profile?.imageUrl}
					borderRadius='lg'
				/>
        <Stack>
          <Box>
            <Text pt="2" fontSize="sm">
          		Posts: {profile?.nrOfPosts} <br />
            </Text>
						<Text pt="2" fontSize="sm">
							Likes: {profile?.nrOfLikes}
						</Text>
          </Box>
        </Stack>
      </CardBody>
      <div className="user_details">
        {/*<Avatar name={user?.username} size="100" round={true} src={profile?.imageUrl} />*/}
      </div>
    </Card>
  );
};
