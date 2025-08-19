import React from 'react';
import Card from './Card';
import Button from './Button';
import Table from './Table';
import Dropdown from './Dropdown';
import Modal from './Modal';
import Tabs from './Tabs';
import PageHeader from './PageHeader';
import RecentActivities from './RecentActivities';
import Search from './Search';
import DatePicker from './DatePicker';
import Calendar from './Calendar';
import ExpandableTable from './ExpandableTable';
import Holder from './Holder';
import LoadingSpinner from './LoadingSpinner';
import Heading from './Heading';
import TimeRangeSelector from './TimeRangeSelector';
import BarChart from '@graphs/BarChart';
import PieChart from '@graphs/PieChart';
import TopLevelHierarchy from './TopLevelHierarchy';
import Stepper from './Stepper';
import FormContainer from './FormContainer';
import SectionHeader from './SectionHeader';
import Carousel from './Carousel';
import LoginV2 from '@pages/LoginV2';
import { Form } from '@components/Form';
import TicketInfoCard from '@components/Ticket/TicketInfoCard';
import ActivityLogCard from '@components/Ticket/ActivityLogCard';
import ChatComponent from '@components/Ticket/ChatComponent';
import PageInformation from './PageInformation';
import Permissions from './Permissions';
import SummaryInfo from './SummaryInfo';
import TicketConversationPanel from '@components/Ticket/TicketConversationPanel';
import TicketInformationPannel from '../Ticket/TIcketInformationPannel';
import ActivityLog from './ActivityLog';
import ChatApplication from '@components/Ticket/ChatApplication';
import ProfileSidebar from '../../pages/ProfileSidebar';
import ProfileContent from '../../pages/ProfileContent';
import Steps from './Steps';
import OccupancyHeader from './OccupancyHeader';
import ConfirmationPage from '@components/Occupancy-Vacency/ConfirmationPage';
import UsageSummaryPage from '@components/Occupancy-Vacency/UsageSummartPage';
import Payment from '@components/Occupancy-Vacency/Payment';
import FreezeStatus from '@components/Occupancy-Vacency/FreezeStatus';
import ApplicationCard from './ApplicationCard';
import StatusCard from './StatusCard';
import DGCard from '@/pages/DGCard';
import ElectricalMetricsCard from './ElectricalMetricsCard';
import NodeChart from './NodeChart';
import Error from '@components/Error/Error';
const componentMap: Record<string, React.ComponentType<any>> = {
    Card,
    Button,
    Table,
    Dropdown,
    Modal,
    Tabs,
    PageHeader,
    RecentActivities,
    Search,
    DatePicker,
    Calendar,
    ExpandableTable,
    Holder,
    LoadingSpinner,
    Heading,
    TimeRangeSelector,
    BarChart,
    PieChart,
    TopLevelHierarchy,
    Stepper,
    FormContainer,
    Form,
    SectionHeader,
    TicketInfoCard,
    ActivityLogCard,
    ChatComponent,
    Carousel,
    LoginV2,
    PageInformation,
    SummaryInfo,
    TicketConversationPanel,
    TicketInformationPannel,
    ActivityLog,
    ChatApplication,
    Permissions,
    ProfileSidebar,
    ProfileContent,  
    Steps,
    OccupancyHeader,
    ConfirmationPage,
    UsageSummaryPage,
    ElectricalMetricsCard,
    Payment,
    FreezeStatus,
    ApplicationCard,
    StatusCard,
    DGCard,
    NodeChart,
    Error,
};

type LayoutType = 'row' | 'column' | 'grid';

interface RowConfig {
    bg?: string;
    className?: string;
    layout?: 'row' | 'column' | 'grid';
    gridColumns?: number;
    gridRows?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: string;
    span?: number | { col?: number; row?: number };
    columns: Array<
        | string
        | {
              name: string;
              props?: Record<string, unknown>;
              span?: number | { col?: number; row?: number };
              align?: 'start' | 'center' | 'end' | 'stretch';
          }
    >;
}

interface LayoutConfig {
    type: LayoutType;
    columns?: number;
    gridRows?: 1 | 2 | 3 | 4 | 5 | 6;
    gap?: string;
    className?: string;
    bg?: string;
    rows?: RowConfig[];
}

export interface SectionConfig {
    layout: LayoutConfig;
    components?: Array<
        | string
        | {
              name: string;
              props?: Record<string, unknown>;
              span?: number | { col?: number; row?: number };
              align?: 'start' | 'center' | 'end' | 'stretch';
          }
    >;
}

interface PageProps {
    sections: SectionConfig[];
    sectionWrapperClassName?: string;
    style?: React.CSSProperties;
}

const getLayoutClass = (layout?: LayoutConfig) => {
    if (!layout) return '';
    const { type, columns, gridRows, gap, className, bg } = layout;

    let baseClass = '';
    switch (type) {
        case 'row':
            baseClass = `flex flex-row ${gap || 'gap-4'}`;
            break;
        case 'column':
            baseClass = `flex flex-col ${gap || 'gap-4'}`;
            break;
        case 'grid': {
            let gridClass = `grid ${gap || 'gap-4'}`;
            if (columns) {
                const gridColsMap: Record<number, string> = {
                    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
                    5: 'grid-cols-5', 6: 'grid-cols-6', 7: 'grid-cols-7', 8: 'grid-cols-8',
                    9: 'grid-cols-9', 10: 'grid-cols-10', 11: 'grid-cols-11', 12: 'grid-cols-12'
                };
                gridClass += ` ${gridColsMap[columns]}`;
            }
            if (gridRows) {
                const gridRowsMap: Record<number, string> = {
                    1: 'grid-rows-1', 2: 'grid-rows-2', 3: 'grid-rows-3',
                    4: 'grid-rows-4', 5: 'grid-rows-5', 6: 'grid-rows-6'
                };
                gridClass += ` ${gridRowsMap[gridRows]}`;
            }
            baseClass = gridClass;
            break;
        }
        default:
            baseClass = '';
    }

    return `${baseClass} ${className || ''} ${bg || ''}`.trim();
};

const getRowClass = (row: RowConfig) => {
    const { layout = 'row', gridColumns, gridRows, gap, className, bg } = row;

    let baseClass = '';
    switch (layout) {
        case 'row':
            baseClass = `flex flex-row ${gap || 'gap-4'}`;
            break;
        case 'column':
            baseClass = `flex flex-col ${gap || 'gap-4'}`;
            break;
        case 'grid': {
            let gridClass = `grid ${gap || 'gap-4'}`;
            if (gridColumns) {
                const gridColsMap: Record<number, string> = {
                    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
                    5: 'grid-cols-5', 6: 'grid-cols-6', 7: 'grid-cols-7', 8: 'grid-cols-8',
                    9: 'grid-cols-9', 10: 'grid-cols-10', 11: 'grid-cols-11', 12: 'grid-cols-12'
                };
                gridClass += ` ${gridColsMap[gridColumns]}`;
            }
            if (gridRows) {
                const gridRowsMap: Record<number, string> = {
                    1: 'grid-rows-1', 2: 'grid-rows-2', 3: 'grid-rows-3',
                    4: 'grid-rows-4', 5: 'grid-rows-5', 6: 'grid-rows-6'
                };
                gridClass += ` ${gridRowsMap[gridRows]}`;
            }
            baseClass = gridClass;
            break;
        }
        default:
            baseClass = `flex flex-row ${gap || 'gap-4'}`;
    }

    return `${baseClass} ${className || ''} ${bg || ''}`.trim();
};

const getSpanClasses = (
    span: number | { col?: number; row?: number } | undefined
) => {
    if (!span) return '';

    if (typeof span === 'number') {
        // Handle number span (col-span only)
        switch (span) {
            case 1: return 'col-span-1';
            case 2: return 'col-span-2';
            case 3: return 'col-span-3';
            case 4: return 'col-span-4';
            case 5: return 'col-span-5';
            case 6: return 'col-span-6';
            case 7: return 'col-span-7';
            case 8: return 'col-span-8';
            case 9: return 'col-span-9';
            case 10: return 'col-span-10';
            case 11: return 'col-span-11';
            case 12: return 'col-span-12';
            default: return '';
        }
    }

    const classes = [];
    if (span.col) {
        // Handle col span with any number
        switch (span.col) {
            case 1: classes.push('col-span-1'); break;
            case 2: classes.push('col-span-2'); break;
            case 3: classes.push('col-span-3'); break;
            case 4: classes.push('col-span-4'); break;
            case 5: classes.push('col-span-5'); break;
            case 6: classes.push('col-span-6'); break;
            case 7: classes.push('col-span-7'); break;
            case 8: classes.push('col-span-8'); break;
            case 9: classes.push('col-span-9'); break;
            case 10: classes.push('col-span-10'); break;
            case 11: classes.push('col-span-11'); break;
            case 12: classes.push('col-span-12'); break;
        }
    }
    if (span.row) {
        // Handle row span with any number
        switch (span.row) {
            case 1: classes.push('row-span-1'); break;
            case 2: classes.push('row-span-2'); break;
            case 3: classes.push('row-span-3'); break;
            case 4: classes.push('row-span-4'); break;
            case 5: classes.push('row-span-5'); break;
            case 6: classes.push('row-span-6'); break;
        }
    }

    return classes.join(' ');
};

const getAlignClasses = (
    align?: 'start' | 'center' | 'end' | 'stretch',
    isGrid: boolean = false
) => {
    if (!align) return '';

    if (isGrid) {
        switch (align) {
            case 'start':
                return 'justify-self-start';
            case 'center':
                return 'justify-self-center';
            case 'end':
                return 'justify-self-end';
            case 'stretch':
                return 'justify-self-stretch';
            default:
                return '';
        }
    } else {
        switch (align) {
            case 'start':
                return 'self-start';
            case 'center':
                return 'self-center';
            case 'end':
                return 'self-end';
            case 'stretch':
                return 'self-stretch';
            default:
                return '';
        }
    }
};

const Page: React.FC<PageProps> = ({
    sections,
    sectionWrapperClassName = '',
    style = {},
}) => {
    return (
        <div className={`w-full h-full  flex flex-col gap-4 grid-cols- 5  `} style={style}>
            {sections.map((section, idx) => {
                if (section.layout && section.layout.rows) {
                    const sectionClass = getLayoutClass(section.layout);
                    return (
                        <section
                            key={idx}
                            className={`${sectionClass} ${sectionWrapperClassName}`.trim()}>
                            {section.layout.rows.map((row, rowIdx) => {
                                const rowClass = getRowClass(row);
                                const rowSpanClasses = getSpanClasses(row.span);
                                const rowElement = (
                                    <div
                                        key={rowIdx}
                                        className={`${rowClass}`}>
                                        {row.columns.map((comp, cidx) => {
                                            let name: string;
                                            let props: Record<string, unknown> =
                                                {};
                                            let span:
                                                | number
                                                | { col?: number; row?: number }
                                                | undefined;
                                            let align:
                                                | 'start'
                                                | 'center'
                                                | 'end'
                                                | 'stretch'
                                                | undefined;

                                            if (typeof comp === 'string') {
                                                name = comp;
                                            } else {
                                                name = comp.name;
                                                props = comp.props || {};
                                                span = comp.span;
                                                align = comp.align;
                                            }

                                            const Component =
                                                componentMap[name];
                                            if (!Component) {
                                                return (
                                                    <div
                                                        key={cidx}
                                                        className="text-red-500">
                                                        Unknown component:{' '}
                                                        {name}
                                                    </div>
                                                );
                                            }

                                            // Optimize Modal rendering - only render when needed
                                            const shouldRenderComponent = name === 'Modal' ? props.isOpen : true;
                                            
                                            const componentElement = shouldRenderComponent ? (
                                                <Component
                                                    key={cidx}
                                                    {...props}
                                                />
                                            ) : null;
                                            const spanClasses =
                                                getSpanClasses(span);
                                            const alignClasses =
                                                getAlignClasses(
                                                    align,
                                                    row.layout === 'grid'
                                                );

                                            if (
                                                spanClasses &&
                                                row.layout === 'grid'
                                            ) {
                                                return (
                                                    <div
                                                        key={cidx}
                                                        className={`${spanClasses} ${alignClasses}`.trim()}>
                                                        {componentElement}
                                                    </div>
                                                );
                                            }

                                            if (alignClasses) {
                                                return (
                                                    <div
                                                        key={cidx}
                                                        className={
                                                            alignClasses
                                                        }>
                                                        {componentElement}
                                                    </div>
                                                );
                                            }

                                            return componentElement;
                                        })}
                                    </div>
                                );

                                if (rowSpanClasses) {
                                    return (
                                        <div
                                            key={rowIdx}
                                            className={rowSpanClasses}>
                                            {rowElement}
                                        </div>
                                    );
                                }

                                return rowElement;
                            })}
                        </section>
                    );
                }

                return (
                    <section
                        key={idx}
                        className={`${getLayoutClass(
                            section.layout
                        )} ${sectionWrapperClassName}`.trim()}>
                        {section.components?.map((comp, cidx) => {
                            let name: string;
                            let props: Record<string, unknown> = {};
                            let span:
                                | number
                                | { col?: number; row?: number }
                                | undefined;
                            let align:
                                | 'start'
                                | 'center'
                                | 'end'
                                | 'stretch'
                                | undefined;

                            if (typeof comp === 'string') {
                                name = comp;
                            } else {
                                name = comp.name;
                                props = comp.props || {};
                                span = comp.span;
                                align = comp.align;
                            }

                            const Component = componentMap[name];
                            if (!Component) {
                                return (
                                    <div key={cidx} className="text-red-500">
                                        Unknown component: {name}
                                    </div>
                                );
                            }

                            // Optimize Modal rendering - only render when needed
                            const shouldRenderComponent = name === 'Modal' ? props.isOpen : true;
                            
                            const componentElement = shouldRenderComponent ? (
                                <Component key={cidx} {...props} />
                            ) : null;
                            const spanClasses = getSpanClasses(span);
                            const alignClasses = getAlignClasses(
                                align,
                                section.layout.type === 'grid'
                            );

                            if (spanClasses && section.layout.type === 'grid') {
                                return (
                                    <div
                                        key={cidx}
                                        className={`${spanClasses} ${alignClasses}`.trim()}>
                                        {componentElement}
                                    </div>
                                );
                            }

                            if (alignClasses) {
                                return (
                                    <div key={cidx} className={alignClasses}>
                                        {componentElement}
                                    </div>
                                );
                            }

                            return componentElement;
                        })}
                    </section>
                );
            })}
        </div>
    );
};

export default Page;
