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
import { Link, Navigate } from "react-router-dom";
import { login as loginApi } from "../lib/auth/api/auth";
import { SignInLogic } from "../lib/auth/components/SignInLogic";
import { useAuth } from "../lib/auth/hooks/useAuth";
import { Logo } from "./Logo";

export const SignIn = () => {
  const { token: user, login: loginApp } = useAuth();
  const login = async (email: string, password: string) => {
    const { accessToken } = await loginApi(email, password);
    loginApp(accessToken);
  };
  if (user) {
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
        console.log({ errors }, errors.length > 0)
        return (
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
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    Sign in
                  </Button>
                </Flex>
                {isSubmitted && <FormLabel>Login successful!</FormLabel>}
              </FormControl>
              <Box p={4}>
                <Text>
                  Don't have an account?{" "}
                  <Link to="/sign-up">Sign up here!</Link>
                </Text>
              </Box>
            </Box>
          </Flex>
        );
      }}
    </SignInLogic>
  );
};
