import { Box, Button, Field, Flex, Input, Link, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { Link as RouterLink, Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { SignUpLogic } from "./SignUpLogic";
import { register } from "../../api/auth";
import { Logo } from "../common/Logo";

type TextFieldProps = {
  id: string;
  label: string;
  type?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TextField = ({ id, label, type = "text", onChange }: TextFieldProps) => (
  <Field.Root>
    <Field.Label htmlFor={id}>{label}</Field.Label>
    <Input id={id} type={type} placeholder={label} onChange={onChange} />
  </Field.Root>
);

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
            <form onSubmit={handleSubmit}>
              <Stack gap={3} mt={4}>
                <TextField id="input-email" label="Email address" type="email" onChange={handleEmailUpdated} />
                <TextField id="input-username" label="Username" onChange={handleSignUpInfoUpdated("username")} />
                <TextField id="input-first-name" label="First name" onChange={handleSignUpInfoUpdated("firstName")} />
                <TextField id="input-last-name" label="Last name" onChange={handleSignUpInfoUpdated("lastName")} />
                <TextField id="input-avatar-url" label="Avatar URL" onChange={handleSignUpInfoUpdated("imageUrl")} />
                <TextField id="input-password" label="Password" type="password" onChange={handlePasswordUpdated} />
                <TextField
                  id="input-confirm-password"
                  label="Confirm password"
                  type="password"
                  onChange={handlePasswordConfirmUpdated}
                />
                {errors.map((error) => (
                  <Text key={error} color="fg.error" fontSize="sm">
                    {error}
                  </Text>
                ))}
                <Flex justifyContent="flex-end">
                  <Button id="btn-sign-up" type="submit" disabled={!canSubmit}>
                    Sign up
                  </Button>
                </Flex>
              </Stack>
            </form>
            {isSubmitted ? (
              <Text py={4}>
                Sign up successful!{" "}
                <Link asChild colorPalette="blue" fontWeight="semibold">
                  <RouterLink to="/sign-in">Sign in here</RouterLink>
                </Link>
              </Text>
            ) : (
              <Text py={4}>
                Already have an account?{" "}
                <Link asChild colorPalette="blue" fontWeight="semibold">
                  <RouterLink to="/sign-in">Sign in here!</RouterLink>
                </Link>
              </Text>
            )}
          </Box>
        </Flex>
      )}
    </SignUpLogic>
  );
};
