import React from "react";
import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";
import { useNotification } from "../../hooks";
import { useState } from "react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value); // i update the email here
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // did not "reload the page"
    if (!isValidEmail(email)) return updateNotification("error", "wrong email"); //we checking for email and rendering this error
    const { error, message } = await forgetPassword(email); //axios post
    if (error) return updateNotification("error", error);
    updateNotification("success", message); //updating with success method
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email </Title>
          <FormInput
            onChange={handleChange} //handling on change inside the input field
            value={email}
            label="Email"
            placeholder="Email address"
            name="email"
          />
          <Submit value="Send Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signIn">Sign in</CustomLink>
            <CustomLink to="/auth/signUp">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
