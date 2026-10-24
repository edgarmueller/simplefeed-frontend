import { Alert, Box, Button, Field, Input, Stack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react";
import { logout } from "../../api/auth";
import { closeAccount, updateUserInfo } from "../../api/user";
import { getErrorMessages } from "../../lib/errors";
import { User } from "../../model/domain.interface";
import { useUserStore } from "../../stores/useUserStore";
import { FileInput } from "../ui/file-input";
import { notifyError } from "../ui/toaster";
import { UserAvatar } from "../ui/user-avatar";

const OutlinedBox = ({ children }: { children: ReactNode }) => (
  <Box borderWidth="1px" borderColor="border" borderRadius="lg" p={3}>
    <Stack gap={3}>{children}</Stack>
  </Box>
);

const formatError = (error: string) => error.replace("user.", "");

export const UpdateUserForm = () => {
  const { user, setUser } = useUserStore();
  const closeAccountMutation = useMutation({
    mutationFn: closeAccount,
    onSuccess: () => logout(),
  });
  const [userInfo, setUserInfo] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    image: undefined as File | undefined,
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    setUserInfo((info) => ({
      ...info,
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    }));
  }, [user]);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState(false);
  const passwordsMatch = userInfo.password === userInfo.confirmPassword;

  const handleUserInfoUpdated =
    (fieldName: keyof typeof userInfo) => (event: ChangeEvent<HTMLInputElement>) => {
      setUserInfo({ ...userInfo, [fieldName]: event.target.value });
    };
  const handleUserAvatarUpdated = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, image: event.target.files?.[0] });
  };

  const updateUserMutation = useMutation({
    mutationFn: () => {
      const { email, password, firstName, lastName, image } = userInfo;
      return updateUserInfo(user!.id, { email, firstName, lastName, image, password });
    },
    onSuccess: (me: User) => {
      setSubmitted(true);
      setErrors([]);
      setUser({ ...user, ...me });
    },
    onError: (error: Error) => {
      notifyError("Updating your profile", error);
      setErrors(getErrorMessages(error).map(formatError));
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateUserMutation.mutate();
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {isSubmitted && (
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Success!</Alert.Title>
              <Alert.Description>User information update successful!</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
        <Field.Root>
          <Field.Label>Email address</Field.Label>
          <Input id="email" type="email" value={userInfo.email} onChange={handleUserInfoUpdated("email")} />
        </Field.Root>
        <Field.Root>
          <Field.Label>First name</Field.Label>
          <Input id="first_name" value={userInfo.firstName} onChange={handleUserInfoUpdated("firstName")} />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last name</Field.Label>
          <Input id="last_name" value={userInfo.lastName} onChange={handleUserInfoUpdated("lastName")} />
        </Field.Root>
        <OutlinedBox>
          <Field.Root>
            <Field.Label>Avatar</Field.Label>
            <UserAvatar
              size="2xl"
              shape="rounded"
              name={`${user.firstName} ${user.lastName}`}
              src={userInfo.image ? URL.createObjectURL(userInfo.image) : user.imageUrl}
            />
            <FileInput mt={2} accept="image/*" onChange={handleUserAvatarUpdated} />
          </Field.Root>
        </OutlinedBox>
        <OutlinedBox>
          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input id="password" type="password" placeholder="Password" onChange={handleUserInfoUpdated("password")} />
            <Field.HelperText>If left empty, the password stays the same</Field.HelperText>
          </Field.Root>
          <Field.Root invalid={!passwordsMatch}>
            <Field.Label>Confirm password</Field.Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm password"
              onChange={handleUserInfoUpdated("confirmPassword")}
            />
            <Field.ErrorText>Passwords do not match</Field.ErrorText>
          </Field.Root>
        </OutlinedBox>
        {errors.map((error) => (
          <Alert.Root key={error} status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        ))}
        <Stack direction="row" gap={4}>
          <Button type="submit" disabled={!passwordsMatch} loading={updateUserMutation.isPending}>
            Update profile
          </Button>
          <Button variant="outline" colorPalette="red" onClick={() => closeAccountMutation.mutate()}>
            Close account
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
