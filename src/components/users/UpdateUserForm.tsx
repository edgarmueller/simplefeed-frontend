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
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
  useMultiStyleConfig
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { updateUserInfo } from "../../api/user";
import { useUser } from "../../lib/auth/hooks/useUser";


const formatError = (error: string) => {
  return error.replace("user.", "");
};

export const FileInput = (props: InputProps) => {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Input
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
  );
};

export const UpdateUserForm = () => {
  const { user, setUser, hasError } = useUser();
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

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent page reload
    event.preventDefault();
    const { email, password, firstName, lastName, image } =
      userInfo;
    try {
      const me = await updateUserInfo(user!.id, { email, firstName, lastName, image, password });
      setSubmitted(true);
      setErrors([]);
      console.log({ me })
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
            type="email"
            placeholder="Email address"
            onChange={handleUserInfoUpdated("email")}
            minW="100%"
            value={userInfo.email}
          />
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            placeholder="First name"
            onChange={handleUserInfoUpdated("firstName")}
            minW="100%"
            value={userInfo.firstName}
          />
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            placeholder="Last name"
            onChange={handleUserInfoUpdated("lastName")}
            minW="100%"
            value={userInfo.lastName}
          />
          <FormLabel>Avatar</FormLabel>
          <Box alignItems="center" justifyItems={"center"}>
            <Avatar mb={2} src={userInfo.image ? URL.createObjectURL(userInfo.image) : user.imageUrl} borderRadius="lg" size="xl" />
            <FileInput
              placeholder="Avatar"
              onChange={handleUserAvatarUpdated}
              minW="100%"
            />
          </Box>
        </FormControl>
        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}
				<FormControl
					onSubmit={handlePasswordSubmit}
					isInvalid={errors.length > 0}
				>
					<FormLabel>Password</FormLabel>
          <FormHelperText>If left empty, password will not be updated</FormHelperText>
					<Input
						type="password"
						placeholder="Password"
						onChange={handleUserInfoUpdated('password')}
						minW="100%"
					/>
					<FormLabel>Confirm Password</FormLabel>
          <FormHelperText>Confirm password, if filled</FormHelperText>
					<Input
						type="password"
						placeholder="Confirm Password"
						onChange={handleUserInfoUpdated('confirmPassword')}
						minW="100%"
					/>
				</FormControl>
        <Button
          type="submit"
          disabled={!canSubmit}
          onClick={handleSubmit}
          marginTop={4}
        >
          Update Profile
        </Button>
      </Box>
    </Flex>
  );
};
