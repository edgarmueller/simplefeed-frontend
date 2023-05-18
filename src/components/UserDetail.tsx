import { Avatar, Box, Card, CardBody, CardHeader, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Profile } from "../domain.interface";

export const UserDetail = ({ user, username }: any) => {
  const [userProfile, setUserProfile] = useState<Profile | null>(user|| null);

  useEffect(() => {
    setUserProfile(user);
  }, [username, user]);

  console.log({ profile: userProfile })
  return (
    <Card>
      <CardHeader>
        <Heading>
          {userProfile?.firstName} {userProfile?.lastName} <br />
				</Heading>
      </CardHeader>
      <CardBody>
				<Avatar
					src={userProfile?.imageUrl}
					borderRadius='lg'
				/>
        <Stack>
          <Box>
            <Text pt="2" fontSize="sm">
          		Posts: {userProfile?.nrOfPosts} <br />
            </Text>
						<Text pt="2" fontSize="sm">
							Likes: {userProfile?.nrOfLikes}
						</Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
