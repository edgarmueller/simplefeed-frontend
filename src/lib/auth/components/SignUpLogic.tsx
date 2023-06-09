import { uniq } from "lodash";
import React, { useEffect, useState } from "react";

export interface SignUpProps {
  isPasswordConfirmEnabled?: boolean;
  register: (
    email: string,
    password: string,
		userProfile: {
			username: string,
			firstName: string,
			lastName: string,
			imageUrl: string,
		}
  ) => Promise<void>;
	children: (api: Api) => React.ReactNode;
}

type Api = {
	canSubmit: boolean | undefined;
	handleSubmit: (event: React.FormEvent) => Promise<void>;
	errors: string[];
	isSubmitted: boolean;
	handleSignUpInfoUpdated: (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleEmailUpdated: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handlePasswordUpdated: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handlePasswordConfirmUpdated: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatError = (error: string) => {
  return error.replace("user.", "");
};

export function SignUpLogic({
  isPasswordConfirmEnabled = true,
	register,
	children
}: SignUpProps) {
  const [signUpInfo, setSignUpInfo] = useState({
    email: "",
		username: "",
		firstName: "",
		lastName: "",
		imageUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [canSubmit, setCanSubmit] = useState<boolean>();
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const { email, password, confirmPassword } = signUpInfo;
    setCanSubmit(
      email !== "" &&
        password !== "" &&
        (isPasswordConfirmEnabled ? password === confirmPassword : true)
    );
  }, [signUpInfo, isPasswordConfirmEnabled]);

  const handleSubmit = async (event: React.FormEvent) => {
    // Prevent page reload
    event.preventDefault();
    const { email, password, username, firstName, lastName, imageUrl } = signUpInfo;
    try {
      await register(email, password, { username, firstName, lastName, imageUrl });
      setSubmitted(true);
      setErrors([]);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message.split(",").map(formatError));
      }
    }
  };

	const handleSignUpInfoUpdated = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpInfo({
			...signUpInfo,
			[fieldName]: event.target.value
		})
	}
	const handleEmailUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpInfo({
			...signUpInfo,
			email: event.target.value
		})
	}
	const handlePasswordUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSignUpInfo({
			...signUpInfo,
			password: event.target.value
		})
	}
	const handlePasswordConfirmUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
		const errorMsg = "Passwords do not match";
		setSignUpInfo({
			...signUpInfo,
			confirmPassword: event.target.value
		})
		if (event.target.value !== signUpInfo.password) {
			setErrors(errors => uniq(([
				...errors,
				errorMsg
			])))
		} else {
			setErrors(errors => errors.filter(msg => msg !== errorMsg))
		}
	}

	const getApi = () => ({
		canSubmit,
		handleSubmit,
		errors,
		isSubmitted,
		handleSignUpInfoUpdated,
		handleEmailUpdated,
		handlePasswordUpdated,
		handlePasswordConfirmUpdated,
	})

	return <>{children(getApi())}</>
}
