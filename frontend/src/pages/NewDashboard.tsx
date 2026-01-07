import React from 'react';
import Page from '@/components/global/PageC';

const NewDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <Page
                sections={[
                    {
                        layout: {
                            type: 'column',
                            gap: 'gap-4',
                            rows: [
                                {
                                    layout: 'grid',
                                    gap: 'gap-4',
                                    gridColumns: 1,
                                    columns: [
                                        {
                                            name: 'Heading',
                                            props: {
                                                text: 'Dashboard',
                                                level: 1,
                                                size: 'xl',
                                                variant: 'primary',
                                                weight: 'bold',
                                                align: 'left',
                                            },
                                        },
                                    ],
                                },
                                {
                                    layout: 'column',
                                    gap: 'gap-4',
                                    columns: [
                                        {
                                            name: 'Card',
                                            props: {
                                                title: 'Welcome to Your Dashboard',
                                                content: 'This is an empty dashboard page. You can customize it by adding components like charts, tables, and other widgets.',
                                                variant: 'default',
                                                size: 'lg',
                                                bg: "bg-stat-icon-gradient",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
        </div>
    );
};

export default NewDashboard; 