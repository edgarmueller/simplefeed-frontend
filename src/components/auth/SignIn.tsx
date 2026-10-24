import { Box, Button, Field, Flex, Input, Link, Stack, Text } from "@chakra-ui/react";
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
        handleEmailUpdated,
        handlePasswordUpdated,
      }) => (
        <Flex alignItems="center" justifyContent="center" minHeight="100vh">
          <Box maxW="md" w="100%">
            <Logo />
            <form onSubmit={handleSubmit}>
              <Stack gap={3} mt={4}>
                <Field.Root>
                  <Field.Label>Email address</Field.Label>
                  <Input type="email" placeholder="Email address" onChange={handleEmailUpdated} />
                </Field.Root>
                <Field.Root invalid={errors.length > 0}>
                  <Field.Label>Password</Field.Label>
                  <Input type="password" placeholder="Password" onChange={handlePasswordUpdated} />
                  {errors.map((error) => (
                    <Field.ErrorText key={error}>{error}</Field.ErrorText>
                  ))}
                </Field.Root>
                <Flex justifyContent="flex-end">
                  <Button type="submit" disabled={!canSubmit}>
                    Sign in
                  </Button>
                </Flex>
              </Stack>
            </form>
            <Text py={4}>
              Don't have an account?{" "}
              <Link asChild colorPalette="blue" fontWeight="semibold">
                <RouterLink to="/sign-up">Sign up here!</RouterLink>
              </Link>
            </Text>
          </Box>
        </Flex>
      )}
    </SignInLogic>
  );
};
