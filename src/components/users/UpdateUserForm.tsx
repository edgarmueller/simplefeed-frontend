import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
  useMultiStyleConfig
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { closeAccount, updateUserInfo } from "../../api/user";
import { useUser } from "../../hooks/useUser";
import { logout } from "../../api/auth";
import { useUserStore } from "../../stores/useUserStore";

const OutlinedBox = ({ children }: any) => {
  return (
    <Box alignItems="center" justifyItems={"center"} border={"1px"} borderColor={"gray.200"} borderRadius={"lg"} p={2} mt={2}>
    {children}
    </Box>
  )
}

const formatError = (error: string) => {
  return error.replace("user.", "");
};

export const FileInput = (props: InputProps) => {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Box>
      <Input
        id="files"
        type="file"
        sx={{
          "::file-selector-button": {
            border: "none",
            outline: "none",
            mr: 2,
            ml: -6,
            ...styles,
          },
        }}
        {...props}
      />
    </Box>
  );
};

export const UpdateUserForm = () => {
  const { user, setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    image: undefined as unknown as File,
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    setUserInfo(info => ({
      ...info,
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    }))
  }, [user])

  const [canSubmit, setCanSubmit] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const handleUserInfoUpdated =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInfo({
        ...userInfo,
        [fieldName]: event.target.value,
      });
   
    };
  const handleUserAvatarUpdated =
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInfo({
        ...userInfo,
        image: event.target.files![0],
      });
    };

  const handleClose = async (event: React.FormEvent) => {
    event.preventDefault();
    await closeAccount();
    await logout();
  }

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent page reload
    event.preventDefault();
    const { email, password, firstName, lastName, image } =
      userInfo;
    try {
      const me = await updateUserInfo(user!.id, { email, firstName, lastName, image, password });
      setSubmitted(true);
      setErrors([]);
      setUser({
        ...user,
        ...me
      }); 
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message.split(",").map(formatError));
      }
    }
  };

	const handlePasswordSubmit = async (event: React.FormEvent) => {
    try {
      //await updatePassword(user.id, password);
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message.split(",").map(formatError));
      }
    }
	}

  if (!user) {
    return null;
  }

  return (
    <Flex>
      <Box w="100%">
        {isSubmitted && (
          <Alert status='success'>
            <AlertIcon />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              User information update successful!
            </AlertDescription>
          </Alert>
        )}
        <FormControl onSubmit={handleSubmit} isInvalid={errors.length > 0}>
          <FormLabel>Email address</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            onChange={handleUserInfoUpdated("email")}
            minW="100%"
            value={userInfo.email}
          />
          <FormLabel>First Name</FormLabel>
          <Input
            id="first_name"
            type="text"
            placeholder="First name"
            onChange={handleUserInfoUpdated("firstName")}
            minW="100%"
            value={userInfo.firstName}
          />
          <FormLabel>Last Name</FormLabel>
          <Input
            id="last_name"
            type="text"
            placeholder="Last name"
            onChange={handleUserInfoUpdated("lastName")}
            minW="100%"
            value={userInfo.lastName}
          />
          <OutlinedBox>
            <FormLabel>Avatar</FormLabel>
            <Avatar mb={2} src={userInfo.image ? URL.createObjectURL(userInfo.image) : user.imageUrl} borderRadius="lg" size="xl" />
            <FileInput
              placeholder="Avatar"
              onChange={handleUserAvatarUpdated}
              minW="100%"
            />
          </OutlinedBox>
          <FormErrorMessage>
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </FormErrorMessage>
        </FormControl>
        <OutlinedBox>
          <FormControl
            onSubmit={handlePasswordSubmit}
            isInvalid={errors.length > 0}
          >
            <FormLabel>Password</FormLabel>
            <FormHelperText>If left empty, password will not be updated</FormHelperText>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              onChange={handleUserInfoUpdated('password')}
              minW="100%"
            />
            <FormLabel>Confirm Password</FormLabel>
            <FormHelperText>Confirm password, if filled</FormHelperText>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm Password"
              onChange={handleUserInfoUpdated('confirmPassword')}
              minW="100%"
            />
          </FormControl>
        </OutlinedBox>
        <Button
          type="submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
          marginTop={4}
        >
          Update Profile
        </Button>
        <Button
          type="submit"
          onClick={handleClose}
          marginTop={4}
          marginLeft={4}
          variant={'outline'}
          colorScheme="red"
        >
          Close Account
        </Button>
      </Box>
    </Flex>
  );
};
