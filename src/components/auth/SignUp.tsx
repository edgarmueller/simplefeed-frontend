import { Link, Navigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { SignUpLogic } from "./SignUpLogic";
import { register } from "../../api/auth";
import { Logo } from "../common/Logo";

export const SignUp = () => {
  const { token } = useAuth();
  if (token) return <Navigate to="/" />;
  return (
    <SignUpLogic register={register}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handleSignUpInfoUpdated,
        handlePasswordUpdated,
        handlePasswordConfirmUpdated,
      }) => (
        <Flex alignItems="center" justifyContent="center" minHeight="100vh">
          <Box maxW="md" w="100%">
            <Logo />
            <FormControl onSubmit={handleSubmit} isInvalid={errors.length > 0}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Email address"
                onChange={handleEmailUpdated}
                minW="100%"
              />
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                placeholder="Username"
                onChange={handleSignUpInfoUpdated("username")}
                minW="100%"
              />
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="First name"
                onChange={handleSignUpInfoUpdated("firstName")}
                minW="100%"
              />
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Last name"
                onChange={handleSignUpInfoUpdated("lastName")}
                minW="100%"
              />
              <FormLabel>Avatar</FormLabel>
              <Input
                type="text"
                placeholder="Last name"
                onChange={handleSignUpInfoUpdated("imageUrl")}
                minW="100%"
              />
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password"
                onChange={handlePasswordUpdated}
                minW="100%"
              />
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm Password"
                onChange={handlePasswordConfirmUpdated}
                minW="100%"
              />
            </FormControl>
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
            <Flex justifyContent="flex-end" marginTop={4}>
              <Button
                type="submit"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Flex>
            {isSubmitted && (
              <Text>
                Sign up successful!&nbsp;
                <RouterLink to="/sign-in">
                  <Button variant="link">
                    Login here
                  </Button>
                </RouterLink>
              </Text>
            )}
            <Box>
              <Link to="/sign-in">
                Already have an account? Sign in here!
              </Link>
            </Box>
          </Box>
        </Flex>
      )}
    </SignUpLogic>
  );
};
