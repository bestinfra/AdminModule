import React from "react";
import PageC from "@components/global/PageC";
import type { CarouselSlide } from "@components/global/Carousel";
import { useState } from "react";
import type { FormInputValue } from "@components/Form/types";

const slides: CarouselSlide[] = [
  {
    title: "Welcome to the Sub-App!",
    img: "/images/energy-analytics.jpg",
  },
  {
    title: "Feature Highlight",
    img: "/images/meter-eval.jpg",
  },
  {
    title: "Stay Connected",
    img: "/images/smart-comm.png",
  },
];
const DUMMY_USER = {
  identifier: "admin@example.com",
  password: "password",
};

const SubLogin: React.FC = () => {
  const [_error, setError] = useState("");
  const [_loading, setLoading] = useState(false);

  const handleDummyLogin = async (data: Record<string, FormInputValue>) => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (
        data.identifier === DUMMY_USER.identifier &&
        data.password === DUMMY_USER.password
      ) {
        localStorage.setItem("token", "dummy-token");
        window.location.href = "/";
      } else {
        setError("Invalid credentials");
      }
    }, 1000);
  };

  return (
    <PageC
      sections={[
        {
          layout: {
            type: "grid",
            className: "border rounded-lg",
            columns:5,
            gridRows: 2,
            rows: [
              {
                layout: "row",
                className: "border rounded-lg",
                // gridColumns: 1,
                // gridRows: 2,
                span:{col:3,row:1},
                columns: [
                  {
                    name: "Carousel",
                    props: { slides },
                    span: { col: 3, row: 1 },
                  },
                ],
              },
              {
                layout: "grid",
                className: "border rounded-lg",
                // gridColumns: 1,
                // gridRows: 2,
                span:{col:2,row:1},
                columns: [
                  {
                    name: "SectionHeader",
                    props: {
                      title: "Distribution Transformer (DTR) Statistics",
                      titleLevel: 2,
                      titleSize: "md",
                      titleVariant: "primary",
                      rightContent: {
                        name: "Button",
                        props: {
                          label: "Sign In",
                          onClick: handleDummyLogin,
                        },
                    
                      },
                    },
                  },
                  {
                    name: "LoginV2",  
                    span: { col: 2, row: 1 },
                    props: {
                      buttonLabel: "Sign In",
                      rememberMeLabel: "Keep me signed in",
                      minPasswordLength: 8,
                      identifierPlaceholder: "Email or Username",
                      passwordPlaceholder: "Enter your password",
                      inputs: [
                        // Default login fields below
                        {
                          name: "identifier",
                          type: "text",
                          placeholder: "Email or Username",
                          required: true,
                          row: 2,
                          col: 1,
                          colSpan: 2,
                          validation: {
                            custom: (value: FormInputValue) =>
                              !value ? "Username or email is required" : null,
                          },
                        },
                        {
                          name: "password",
                          type: "password",
                          placeholder: "Enter your password",
                          required: true,
                          showPasswordToggle: true,
                          row: 3,
                          col: 1,
                          colSpan: 2,
                          validation: {
                            minLength: 8,
                            custom: (value: FormInputValue) => {
                              if (!value) return "Password is required";
                              if (typeof value === "string" && value.length < 8)
                                return `Password must be at least 8 characters`;
                              return null;
                            },
                          },
                        },
                        // {
                        //   name: 'rememberMe',
                        //   type: 'checkbox',
                        //   label: 'Keep me signed in',
                        //   defaultValue: false,
                        //   row: 4,
                        //   col: 1,
                        //   colSpan: 1,
                        //   className: 'justify-start',
                        // },
                      ],
                      onSubmit: handleDummyLogin,
                      //             // Optionally, you can pass loading and error to LoginV2 for UI feedback
                      //             // loading,
                      //             // error,
  
                    },
                  },
                ],
              },
            ],
          },
        },
      ]}
    />
  );
};

export default SubLogin;
