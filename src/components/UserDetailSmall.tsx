import {
  Avatar,
  Link,
  Stack,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { User } from "../domain.interface";

export const UserDetailSmall = ({
  user,
  asLink,
  bold
}: any) => {
  const [userProfile, setUserProfile] = useState<User | null>(user || null);

  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  return (
    <Stack direction="row" align="center">
      <Avatar src={userProfile?.imageUrl} borderRadius="lg" />
      {
        asLink ?
          <Link as={RouterLink} to={`/users/${userProfile?.username}`}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Link> :
          <Text fontWeight={bold ? "bold" : "normal"}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
      }
    </Stack>
  );
};
