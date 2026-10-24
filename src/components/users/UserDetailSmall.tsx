import { Link, Stack, Text } from "@chakra-ui/react";
import { UserAvatar } from "../ui/user-avatar";
import { Link as RouterLink } from "react-router";
import { User } from "../../model/domain.interface";

export interface UserDetailSmallProps {
  user?: User;
  asLink?: boolean;
  bold?: boolean;
}

export const UserDetailSmall = ({ user, asLink, bold }: UserDetailSmallProps) => {
  if (!user) return null;
  return (
    <Stack direction="row" align="center">
      <UserAvatar
        name={`${user.firstName} ${user.lastName}`}
        src={user.imageUrl}
        shape="rounded"
      />
      {asLink ? (
        <Link asChild>
          <RouterLink to={`/users/${user.username}`}>
            {user.firstName} {user.lastName} ({user.username})
          </RouterLink>
        </Link>
      ) : (
        <Text fontWeight={bold ? "bold" : "normal"}>
          {user.firstName} {user.lastName}
        </Text>
      )}
    </Stack>
  );
};
