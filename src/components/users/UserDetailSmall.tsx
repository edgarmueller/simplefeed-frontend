import { Avatar, Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { User } from "../../domain.interface";

export interface UserDetailSmallProps {
  user?: User;
  asLink?: boolean;
  bold?: boolean;
}

export const UserDetailSmall = ({ user, asLink, bold }: UserDetailSmallProps) => {
  if (!user) return null;
  return (
    <Stack direction="row" align="center">
      <Avatar
        name={`${user?.firstName} ${user?.lastName}`}
        src={user?.imageUrl}
        borderRadius="lg"
      />
      {asLink ? (
        <Link as={RouterLink} to={`/users/${user?.username}`}>
          {user?.firstName} {user?.lastName} (
          {user?.username})
        </Link>
      ) : (
        <Text fontWeight={bold ? "bold" : "normal"}>
          {user?.firstName} {user?.lastName}
        </Text>
      )}
    </Stack>
  );
};
