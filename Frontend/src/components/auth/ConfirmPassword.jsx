import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom"; //A convenient wrapper for reading and writing search parameters via the URLSearchParams interface.// i use it to extract the token and the id from inside the URL
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";
import { useNavigate } from "react-router-dom";

export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    passwordOne: "",
    passwordTwo: "",
  });
  const [isVerifying, setIsVerifying] = useState(false); // is verifying part in page
  const [isValid, setIsValid] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  //isValid, !isValid

  useEffect(() => {
    isValidToken();
  }, []);

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification("error", error);
    }

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.passwordOne.trim())
      return updateNotification("error", "Password is missing!");

    if (password.passwordOne.trim().length < 8)
      //we use if statement for the length of the pass and if its not we use this error
      return updateNotification(
        "error",
        "Password must be with 8 characters at least!"
      );

    if (password.passwordOne !== password.passwordTwo)
      //we compare the first pass with the sec pass and if its not the same we send this error message
      return updateNotification("error", "Password did not the same!");

    const { error, message } = await resetPassword({
      newPassword: password.passwordOne,
      userId: id,
      token
    });

    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    navigate("/auth/signIn", { replace: true })
  };

  if (isVerifying)
    //here is the page with verifying
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1
              className="text-4xl font-serif dark:text-white
           text-danger"
            >
              Please wait we are verifying your token!
            </h1>
            <CgSpinner className="animate-spin text-4xl" />
          </div>
        </Container>
      </FormContainer>
    );

  if (!isValid)
    //here is the page with verifying
    return (
      <FormContainer>
        <Container>
          <h1
            className="text-4xl font-serif dark:text-white
           text-danger"
          >
            Sorry the token is invalid!
          </h1>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title> Enter your password </Title>
          <FormInput
            value={password.passwordOne}
            onChange={handleChange}
            label="New password"
            placeholder="******"
            name="passwordOne"
            type="password"
          />
          <FormInput
            value={password.passwordTwo}
            onChange={handleChange}
            label="Confirm password"
            placeholder="******"
            name="passwordTwo"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
