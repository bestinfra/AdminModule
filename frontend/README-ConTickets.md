# ConTickets Component - Module Federation

This document describes how to use the `ConTickets` component from this micro-frontend module in a host application.

## Component Overview

The `ConTickets` component is a fully prop-driven React component that displays a ticketing dashboard with statistics and a table of tickets. The component is designed to be completely controlled by the host application, with all data and handlers passed via props.

## Integration in Host Application

### 1. Add Remote Module to Your Host Application

#### Using Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        federation({
            name: 'host',
            remotes: {
                ticketing: 'http://localhost:3001/assets/remoteEntry.js',
            },
            shared: ['react', 'react-dom'],
        }),
    ],
});
```

#### Using Webpack

```javascript
// webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'host',
            remotes: {
                ticketing: 'ticketing@http://localhost:3001/remoteEntry.js',
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true },
            },
        }),
    ],
};
```

### 2. Import and Use the Component

```typescript
// Import types (for TypeScript)
import type { TicketData, TicketStats, PaginationData } from 'ticketing/index';
// Import component
import { ConTickets } from 'ticketing/index';

// Or if you want to import directly:
// import ConTickets from 'ticketing/ConTickets';

// Your UI components - passed as props
import Table from './components/Table';
import Button from './components/Button';

const TicketingPage = () => {
    // Your state management logic here
    const [tickets, setTickets] = useState<TicketData[]>([
        // Your ticket data
    ]);

    const [ticketStats, setTicketStats] = useState<TicketStats>({
        // Your ticketing statistics
    });

    const [pagination, setPagination] = useState<PaginationData>({
        // Your pagination state
    });

    // Your handlers
    const handleAddTicket = () => {
        // Navigate to add ticket page
    };

    const handleViewTicket = (ticket: TicketData) => {
        // Navigate to view ticket page
    };

    const handlePageChange = (page: number, limit: number) => {
        // Update pagination and fetch new data
    };

    return (
        <ConTickets
            tickets={tickets}
            ticketStats={ticketStats}
            pagination={pagination}
            isLoading={false}
            error={null}
            onAddTicket={handleAddTicket}
            onViewTicket={handleViewTicket}
            onPageChange={handlePageChange}
            TableComponent={Table}
            ButtonComponent={Button}
        />
    );
};

export default TicketingPage;
```

## Props Reference

| Prop            | Type                                  | Description                            |
| --------------- | ------------------------------------- | -------------------------------------- |
| tickets         | TicketData[]                          | Array of ticket objects                |
| ticketStats     | TicketStats                           | Statistics about tickets               |
| pagination      | PaginationData                        | Pagination state for the tickets table |
| isLoading       | boolean                               | Whether data is being fetched          |
| error           | string \| null                        | Error message if any                   |
| onAddTicket     | () => void                            | Handler for adding a new ticket        |
| onViewTicket    | (ticket: TicketData) => void          | Handler for viewing a ticket           |
| onPageChange    | (page: number, limit: number) => void | Handler for changing the page          |
| TableComponent  | React.ComponentType                   | Table component to use                 |
| ButtonComponent | React.ComponentType                   | Button component to use                |

## Type Definitions

```typescript
interface TicketData {
    ticket_id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    last_updated: string;
}

interface TicketStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    lastMonthTotalTickets: number;
    averageResponseTime: string;
    resolutionRate: string;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    total: number;
}
```
