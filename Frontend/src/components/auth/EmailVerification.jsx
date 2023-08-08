import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../Container";
import Title from "../form/Title";
import Submit from "../form/Submit";
import { useState, useEffect, useRef } from "react";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../utils/theme";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

// i use variable for otp length
const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let value of otp) {
    valid = !isNaN(parseInt(value)); // i parse the value in integer value
    if (!valid) break; //i make this break point because if some of the numbers is empty string we want to invalid this empty string, we don t want to continue in the other numbers of otp if one of them is empty
  }

  return valid;
};

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill("")); //i use the otp length with the fill method to fill the boxes with numbers
  const [otpIndex, setOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  // i use refHook to create a reference
  const inputRef = useRef();
  const { updateNotification } = useNotification();

  const { state } = useLocation();
  const user = state?.user;

  const navigate = useNavigate();

  //will handle the next input field
  const focusNextInputField = (index) => {
    setOtpIndex(index + 1);
  };
  //will handle the previous input field
  const focusPreviousInputField = (index) => {
    let nextIndex;
    const difference = index - 1;
    nextIndex = difference !== 0 ? difference : 0; // if the difference is not equal to 0 only then we need to use this difference otherwise we use the zero(it not allowed us to go to the -1)
    setOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp]; //i use all otp
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length); //i use the newOtp and access the value with index and i take the value and i use substring method because i want one number each box and don t want to type many numbers in boxes!

    if (!value) focusPreviousInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);

    setOtp([...newOtp]);
  };

  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id);

    if (error) return updateNotification("error", error);
    updateNotification("success", message);
  };

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPreviousInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) return updateNotification("error", "invalid OTP");

    //submit otp
    //if the otp and the user id is the right one then inside the backend api we sign the token and send it in frontend
    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [otpIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found"); //if is not user navigate to not found
    if (isLoggedIn && isVerified) navigate("/"); //if is logged in and is verified navigate to home page
  }, [user, isLoggedIn , isVerified]);

  // if(!user) return null

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please Enter the OTP to verify your account </Title>
            <p
              className="text-center dark:text-dark-subtle
             text-light-subtle"
            >
              OPT sended to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={otpIndex === index ? inputRef : null} //i pass this useRef in ref hook
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle
               dark:focus:border-white focus:border-primary rounded bg-transparent outline-none text-center dark:text-white text-primary font-serif spin-button-none" //using spin-button-none because i don t want to have arrows for numbers in my boxes for numbers form index.css
                />
              );
            })}
          </div>

          <div>
            <Submit value="Verify Account" />
            <button
              onClick={handleOTPResend}
              type="button"
              className="dark:text-white text to-blue-600 font-serif hover:underline mt-2"
            >
              {" "}
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
