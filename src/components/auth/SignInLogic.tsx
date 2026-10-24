import React, { useState } from "react";
import { getErrorMessages } from "../../lib/errors";

export interface SignInProps {
  login: (
    email: string,
    password: string
  ) => Promise<void>;
	children: (api: Api) => React.ReactNode;
}

type Api = {
	canSubmit: boolean;
	handleSubmit: (event: React.FormEvent) => Promise<void>;
	errors: string[];
	isSubmitted: boolean;
	handleEmailUpdated: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handlePasswordUpdated: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatError = (error: string) => {
  return error.replace("user.", "");
};

export function SignInLogic({
	children,
  login
}: SignInProps) {
  const [signInInfo, setSignUpInfo] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = signInInfo.email !== "" && signInInfo.password !== "";

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent page reload
    event.preventDefault();
    const { email, password } = signInInfo;
    try {
      await login(email, password);
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      setErrors(getErrorMessages(error).map(formatError));
    }
  };

	const handleEmailUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpInfo({
			...signInInfo,
			email: event.target.value
		})
	}
	const handlePasswordUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpInfo({
			...signInInfo,
			password: event.target.value
		})
	}
	const getApi = () => ({
		canSubmit,
		handleSubmit,
		errors,
		isSubmitted,
		handleEmailUpdated,
		handlePasswordUpdated,
	})

	return <>{children(getApi())}</>
}
