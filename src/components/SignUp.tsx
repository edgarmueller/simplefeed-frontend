import { register } from "../lib/auth/api/auth";
import { SignUpLogic } from "../lib/auth/components/SignUpLogic";

export const SignUp = () => {
  return (
    <SignUpLogic register={register}>
      {({
        canSubmit,
        handleSubmit,
        errors,
        isSubmitted,
        handleEmailUpdated,
        handleUsernameUpdated,
        handlePasswordUpdated,
        handlePasswordConfirmUpdated,
      }) => (
        <div className="wrapper">
          <div className="login_box">
            <div className="login_header">
              <h1>Swirlfeed</h1>
              Login or sign up below
            </div>
            <form id="login-form" onSubmit={handleSubmit}>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                onChange={handleEmailUpdated}
                required
              />
              <br />
              <input
                id="username"
                type="text"
                placeholder="Username "
                onChange={handleUsernameUpdated}
                required
              />
              <br />
              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={handlePasswordUpdated}
              />
              <br />
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                onChange={handlePasswordConfirmUpdated}
              />
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
              {isSubmitted && <p>Sign up successful!</p>}
              <br/>
              <button type="submit" disabled={!canSubmit}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </SignUpLogic>
  );
};
