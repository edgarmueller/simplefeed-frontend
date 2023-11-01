import React, { useEffect, useState } from "react";

export interface SignInProps {
  login: (
    email: string,
    password: string
  ) => Promise<void>;
	children: (api: Api) => React.ReactNode;
}

type Api = {
	canSubmit: boolean | undefined;
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
  const [canSubmit, setCanSubmit] = useState<boolean>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const { email, password } = signInInfo;
    setCanSubmit(email !== "" && password !== "");
  }, [signInInfo]);

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent page reload
    event.preventDefault();
    const { email, password } = signInInfo;
    try {
      await login(email, password);
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message.split(",").map(formatError));
      }
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
