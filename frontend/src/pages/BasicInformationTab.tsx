import React from 'react';

interface User {
    name?: string;
    email?: string;
    phone?: string;
    role_title?: string;
    client_name?: string;
    last_active?: string;
    created_at?: string;
}

interface BasicInformationTabProps {
        user: User | null;
    }

    const formatDateSlash = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const BasicInformationTab: React.FC<BasicInformationTabProps> = ({ user }) => {
        if (!user) {
            return (
                <section className="flex items-center justify-center p-8">
                    <p className="text-neutral-darker">No user data available</p>
                </section>
            );
        }

        return (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="flex flex-col gap-2">
                    <dt className="text-sm color-text-secondary">Full Name</dt>
                    <dd className="font-medium color-text-primary">{user.name || '-'}</dd>
                </article>
                <article className="flex flex-col gap-2">
                    <dt className="text-sm color-text-secondary">Email Address</dt>
                <dd className="font-medium color-text-primary">{user.email || '-'}</dd>
            </article>
            <article className="flex flex-col gap-2">
                <dt className="text-sm color-text-secondary">Phone Number</dt>
                <dd className="font-medium color-text-primary">{user.phone || '-'}</dd>
            </article>
            <article className="flex flex-col gap-2">
                <dt className="text-sm color-text-secondary">Role</dt>
                <dd className="font-medium color-text-primary">{user.role_title || '-'}</dd>
            </article>
            <article className="flex flex-col gap-2">
                <dt className="text-sm color-text-secondary">Client</dt>
                <dd className="font-medium color-text-primary">{user.client_name || '-'}</dd>
            </article>
            <article className="flex flex-col gap-2">
                <dt className="text-sm color-text-secondary">Last Active</dt>
                <dd className="font-medium color-text-primary">
                    {user.last_active ? formatDateSlash(user.last_active) : '-'}
                </dd>
            </article>
            <article className="flex flex-col gap-2">
                <dt className="text-sm color-text-secondary">Created Date</dt>
                <dd className="font-medium color-text-primary">
                    {user.created_at ? formatDateSlash(user.created_at) : '-'}
                </dd>
            </article>
        </section>
    );
};

export default BasicInformationTab;
