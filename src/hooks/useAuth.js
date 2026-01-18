import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import * as validation from "@/validation/Validation";
import * as initialValue from "@/constants/formInitialValues";

import { fetchUserData as fetchStudentData } from "@/redux/slice/user.slice";
import { fetchUserData as fetchCollegeData } from "@/redux/slice/college.slice";
import { fetchUserData as fetchCompanyData } from "@/redux/slice/company.slice";

import { setMode, setupAuth } from "@/redux/slice/auth.slice";

export const useAuthLogin = (loginFunction) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSubmit = async (values, { setErrors }) => {
    setLoading(true);
    const data = {
      email: values.email.toLowerCase(),
      password: values.password,
    };

    try {
      const response = await loginFunction(data, dispatch);

      if (response.success) {
        // 1️⃣ Setup auth
        dispatch(setupAuth({
          isAuth: true,
          role: response.role,
          token: response.accessToken,
        }));

        // 2️⃣ Fetch user data based on role
        switch (response.role) {
          case "Student":
            await dispatch(fetchStudentData()).unwrap();
            break;
          case "College":
            await dispatch(fetchCollegeData()).unwrap();
            break;
          case "company":
            await dispatch(fetchCompanyData()).unwrap();
            break;
          default:
            console.warn("Unknown role:", response.role);
            break;
        }

        // 3️⃣ Set mode if provided
        if (response.mode) {
          dispatch(setMode({ mode: response.mode }));
        }

        // 4️⃣ Check for return URL and navigate accordingly
        const urlParams = new URLSearchParams(location.search);
        const returnUrl = urlParams.get('return');
        
        if (returnUrl) {
          // Decode and redirect to the original page
          navigate(decodeURIComponent(returnUrl));
        } else {
          // Default navigation to dashboard
          navigate(`/${response.role}/app/home`);
        }
      } else {
        setErrors(response.errors || { general: "Login failed" });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValue.authLogin,
    validationSchema: validation.authLogin,
    onSubmit: handleSubmit,
  });

  return { formik, loading };
};

