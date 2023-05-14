import jwtDecode from "jwt-decode";
import { Link, Navigate } from "react-router-dom";
import { User } from "../domain.interface";
import { login as loginApi } from "../lib/auth/api/auth";
import { SignInLogic } from "../lib/auth/components/SignInLogic";
import { useAuth } from "../lib/auth/hooks/useAuth";
import "./SignIn.css";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Logo } from "./Logo";

export const SignIn = () => {
  const { user, login: loginApp } = useAuth();
  const login = async (email: string, password: string) => {
    const user = await loginApi(email, password);
    loginApp(jwtDecode<User>(user.token));
  };
  if (user) {
    return <Navigate replace to="/home" />;
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
                <FormControl>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Email address"
                    onChange={handleEmailUpdated}
                  />
                  <FormLabel>Password</FormLabel>
                </FormControl>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    onChange={handlePasswordUpdated}
                  />
                </FormControl>
                {errors.map((error) => (
                  <FormErrorMessage key={error}>{error}</FormErrorMessage>
                ))}
                <FormControl>
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    Sign in
                  </Button>
                  {isSubmitted && <FormLabel>Login successful!</FormLabel>}
                </FormControl>
              </form>
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
