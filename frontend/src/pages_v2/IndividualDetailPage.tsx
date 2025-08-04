import React from 'react';
import PageC from '../components/global/PageC';

const IndividualDetailPage: React.FC = () => {
    return (
        <PageC
            sections={[
                {
                    layout: {
                        type: 'column',
                        gap: 'gap-6',
                        className: 'p-6'
                    },
                    components: [
                        {
                            name: 'PageHeader',
                            props: {
                                title: 'Individual Details',
                                subtitle: 'View and manage individual information',
                                showBackButton: true,
                                actions: [
                                    {
                                        label: 'Edit',
                                        variant: 'primary',
                                        onClick: () => console.log('Edit clicked')
                                    },
                                    {
                                        label: 'Delete',
                                        variant: 'danger',
                                        onClick: () => console.log('Delete clicked')
                                    }
                                ]
                            }
                        },
                        {
                            name: 'Card',
                            props: {
                                title: 'Basic Information',
                                className: 'w-full'
                            }
                        }
                    ]
                },
                {
                    layout: {
                        type: 'row',
                        gap: 'gap-4',
                        className: 'px-6'
                    },
                    components: [
                        {
                            name: 'Card',
                            props: {
                                title: 'Contact Details',
                                className: 'flex-1'
                            }
                        },
                        {
                            name: 'Card',
                            props: {
                                title: 'Additional Information',
                                className: 'flex-1'
                            }
                        }
                    ]
                }
            ]}
        />
    );
};

export default IndividualDetailPage;
