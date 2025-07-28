import React from 'react';
import PageC from '@components/global/PageC';
import type { CarouselSlide } from '@components/global/Carousel';
import { useState } from 'react';
import type { FormInputValue } from '@components/Form/types';
  
const slides: CarouselSlide[] = [
  {
    title: 'Welcome to the Sub-App!',
    description: 'Manage your tasks efficiently and securely.',
    img: '/images/energy-analytics.png',
  },
  {
    title: 'Feature Highlight',
    description: 'Discover powerful features tailored for you.',
    img: '/images/meter-eval.png',
  },
  {
    title: 'Stay Connected',
    description: 'Access your dashboard from anywhere, anytime.',
    img: '/images/smart-comm.png',
  },
];
const DUMMY_USER = {
  identifier: 'admin@example.com',
  password: 'password',
};

const SubLogin: React.FC = () => {
    const [_error, setError] = useState('');
    const [_loading, setLoading] = useState(false);

    const handleDummyLogin = async (data: Record<string, FormInputValue>) => {
        setError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (
                data.identifier === DUMMY_USER.identifier &&
                data.password === DUMMY_USER.password
            ) {
                localStorage.setItem('token', 'dummy-token');
                window.location.href = '/';
            } else {
                setError('Invalid credentials');
            }
        }, 1000);
    };

    return (
        <PageC
            sections={[
                {
                    layout: {
                        type: 'grid',
                        columns: 5,
                        className: 'min-h-screen',
                    },
                    components: [
                        {
                            name: 'Carousel',
                            props: { slides },
                            span: { col: 3, row: 1 },
                        },
                        {
                            name: 'LoginV2',
                            span:{col:2,row:1},
                            props: {
                                buttonLabel: 'Sign In',
                                rememberMeLabel: 'Keep me signed in',
                                minPasswordLength: 8,
                                identifierPlaceholder: 'Email or Username',
                                passwordPlaceholder: 'Enter your password',
                               
                                // Add extra input fields dynamically
                                inputs: [
                                  // Default login fields below
                                  {
                                    name: 'identifier',
                                    type: 'text',
                                    placeholder: 'Email or Username',
                                    required: true,
                                    row: 2,
                                    col: 1,
                                    colSpan: 2,
                                    validation: {
                                      custom: (value: FormInputValue) => !value ? 'Username or email is required' : null,
                                    },
                                  },
                                  {
                                    name: 'password',
                                    type: 'password',
                                    placeholder: 'Enter your password',
                                    required: true,
                                    showPasswordToggle: true,
                                    row: 3,
                                    col: 1,
                                    colSpan: 2,
                                    validation: {
                                      minLength: 8,
                                      custom: (value: FormInputValue) => {
                                        if (!value) return 'Password is required';
                                        if (typeof value === 'string' && value.length < 8) return `Password must be at least 8 characters`;
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
                                // Optionally, you can pass loading and error to LoginV2 for UI feedback
                                // loading,
                                // error,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default SubLogin;
