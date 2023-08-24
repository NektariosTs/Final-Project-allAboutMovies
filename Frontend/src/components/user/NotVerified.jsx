import React from 'react'
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';


export default function NotVerified() {
 
    const { authInfo } = useAuth();
    const { isLoggedIn } = authInfo;
    const isVerified = authInfo.profile?.isVerified;
  
    const navigate = useNavigate();
  
    const navigateToVerification = () => {
      navigate("/auth/verification", { state: { user: authInfo.profile } });
    };

    return (
      <div>
        {isLoggedIn && !isVerified ? (
          <p className="text-lg text-center bg-blue-50 p-2">
            you haven t verify your account ,
            <button
              onClick={navigateToVerification}
              className="text-blue-500 font-serif hover:underline"
            >
              Click here to verify it
            </button>
          </p>
        ) : null}
      </div>
    );
  }
  //if this user is loggedin and isnot verified only then we are render it this (Container) otherwise we render null(this Container has no value)
  
  
