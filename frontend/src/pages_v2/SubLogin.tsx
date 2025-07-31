import React from "react";
import Page from "@/components/global/PageC";
import type { CarouselSlide } from "@/components/global/Carousel";
import { useState } from "react";
import type { FormInputValue } from "@/components/Form/types";
import { login } from "@api/subAppAuth";

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
const SubLogin: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: Record<string, FormInputValue>) => {
    setError("");
    setLoading(true);
    
    try {
      const result = await login({
        identifier: data.identifier as string,
        password: data.password as string,
        appId: window.location.hostname || 'sub-app'
      });

      if (result.success && result.data) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        window.location.href = "/";
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
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
                          onClick: handleLogin,
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
                      onSubmit: handleLogin,
                      loading,
                      error,
  
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
