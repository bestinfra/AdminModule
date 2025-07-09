import Card from '../../components/global/Card';
import Table from '../../components/global/Table';
import type { Column } from '../../components/global/Table';

interface TableData {
    [key: string]: string | number | boolean | null | undefined;
}

interface TicketData extends TableData {
    id: number;
    ticketNumber: string;
    subject: string;
    status: string;
    priority: string;
    assignedTo: string;
    createdAt: string;
}

interface CardData {
    title: string;
    value: string;
    icon: string;
    showTrend: boolean;
    comparisonValue: number;
    subtitle1: string;
    subtitle2: string;
}

interface TableConfig {
    data: TicketData[];
    columns: Column[];
    heading: string;
}

interface TicketProps {
    data: {
        loading: boolean;
        cards: {
            data: CardData[];
            heading: string;
        };
        tables: TableConfig[];
    };
    onViewTicket: (ticket: TicketData) => void;
    onEditTicket: (ticket: TicketData) => void;
    onDeleteTicket: (ticket: TicketData) => void;
}

export default function Ticket({
    data,
    onViewTicket,
    onEditTicket,
    onDeleteTicket,
}: TicketProps) {
    const handleView = (row: TableData) => onViewTicket(row as TicketData);
    const handleEdit = (row: TableData) => onEditTicket(row as TicketData);
    const handleDelete = (row: TableData) => onDeleteTicket(row as TicketData);

    return (
        <main className="p-6 space-y-6">
            <section
                className="space-y-4 border border-secondary rounded-2xl p-6"
                aria-labelledby="dashboard-heading">
                <h2
                    id="dashboard-heading"
                    className="text-base font-semibold text-gray-800">
                    {data.cards.heading}
                </h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
                    role="list"
                    aria-label="Dashboard statistics">
                    {data.cards.data.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            showTrend={card.showTrend}
                            comparisonValue={card.comparisonValue}
                            subtitle1={card.subtitle1}
                            subtitle2={card.subtitle2}
                            loading={data.loading}
                        />
                    ))}
                </div>
            </section>

            {/* Tables Section */}
            <section className="space-y-8" aria-label="Ticket tables">
                {data.tables.map((table, index) => (
                    <div
                        key={index}
                        className="space-y-4"
                        role="region"
                        aria-labelledby={`table-heading-${index}`}>
                        <h2
                            id={`table-heading-${index}`}
                            className="text-base font-semibold text-gray-800">
                            {table.heading}
                        </h2>
                        <div className="rounded-2xl">
                            <Table
                                data={table.data}
                                columns={table.columns}
                                loading={data.loading}
                                searchable={true}
                                sortable={true}
                                pagination={true}
                                showActions={true}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
