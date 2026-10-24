import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { SignInLogic } from "./SignInLogic";
import { login as loginApi } from "../../api/auth";
import { Logo } from "../common/Logo";

export const SignIn = () => {
  const { token, login: loginApp } = useAuth();
  const login = async (email: string, password: string) => {
    await loginApi(email, password);
    loginApp();
  };
  if (token) {
    return <Navigate replace to="/feed" />;
  }
  return (
    <SignInLogic login={login}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handlePasswordUpdated,
      }) => {
        return (
          <Flex alignItems="center" justifyContent="center" minHeight="100vh">
            <Box maxW="md" w="100%">
              <Logo />
              <form onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.length > 0}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Email address"
                  onChange={handleEmailUpdated}
                  minW="100%"
                />
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={handlePasswordUpdated}
                  minW="100%"
                />
                {errors.map((error) => (
                  <FormErrorMessage key={error}>{error}</FormErrorMessage>
                ))}
                <Flex justifyContent="flex-end" marginTop={4}>
                  <Button type="submit" disabled={!canSubmit}>
                    Sign in
                  </Button>
                </Flex>
                {isSubmitted && <FormLabel>Login successful!</FormLabel>}
              </FormControl>
              </form>
              <Box p={4}>
                <Text>
                  Don't have an account?{" "}
                  <RouterLink to="/sign-up">
                    <Button variant="link">Sign up here!</Button>
                  </RouterLink>
                </Text>
              </Box>
            </Box>
          </Flex>
        );
      }}
    </SignInLogic>
  );
};
