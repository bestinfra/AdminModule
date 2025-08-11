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
import OrgChart from './OrgChart';
// import OrgChartAlt from './OrgChartAlt';
import Holder from './Holder';
import LoadingSpinner from './LoadingSpinner';
import Heading from './Heading';
import TimeRangeSelector from './TimeRangeSelector';
import BarChart from '../../graphs/BarChart';
import PieChart from '../../graphs/PieChart';
import TopLevelHierarchy from './TopLevelHierarchy';
import Stepper from './Stepper';
import FormContainer from './FormContainer';
import SectionHeader from './SectionHeader';
import Carousel from './Carousel';
import LoginV2 from '../../pages_v2/LoginV2';
import { Form } from '../Form';
import OrgChartAlt from './OrgChartAlt';
import IssueCardDetails from '../Ticket/IssueCardDetails';
import ChatInput from '../Ticket/ChatInput';
import TicketInfoCard from '../Ticket/TicketInfoCard';
import UnitDetailsCard from '../Ticket/UnitDetailsCard';
import ActivityLogCard from '../Ticket/ActivityLogCard';
import ChatComponent from '../Ticket/ChatComponent';
import PageInformation from './PageInformation';
import Permissions from './Permissions';
import SummaryInfo from './SummaryInfo';
import TicketConversationPanel from '../TicketConversationPanel';
import TicketInformationPannel from './TIcketInformationPannel';
import ActivityLog from './ActivityLog';
import ChatApplication from '../ChatApplication';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';
import Steps from './Steps';
import OccupancyHeader from './OccupancyHeader';
import ConfirmationPage from '../Occupancy-Vacency/ConfirmationPage';
import UsageSummaryPage from '../Occupancy-Vacency/UsageSummartPage';
import Payment from '../Occupancy-Vacency/Payment';
import FreezeStatus from '../Occupancy-Vacency/FreezeStatus';
import ApplicationCard from './ApplicationCard';
import StatusCard from './StatusCard';
import DGCard from '../DG_Modules/DGCard';
import ElectricalMetricsCard from './ElectricalMetricsCard';
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
    OrgChart,
    OrgChartAlt,
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
    IssueCardDetails,
    ChatInput,
    TicketInfoCard,
    UnitDetailsCard,
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
};

type LayoutType = 'row' | 'column' | 'grid';

interface RowConfig {
    bg?: string;
    className?: string;
    layout?: 'row' | 'column' | 'grid';
    gridColumns?: number;
    gridRows?: number;
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
    gridRows?: number;
    gap?: string;
    className?: string;
    bg?: string;
    rows?: RowConfig[];
}

interface SectionConfig {
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
            baseClass = `flex flex-row  ${gap || 'gap-4'}`;
            break;
        case 'column':
            baseClass = `flex flex-col  ${gap || 'gap-4'}`;
            break;
        case 'grid': {
            let gridClass = `grid ${gap || 'gap-4'}`;
            if (columns) gridClass += ` grid-cols-${columns}`;
            if (gridRows) gridClass += ` grid-rows-${gridRows}`;
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
            baseClass = `flex flex-row ${gap || 'gap-4'} `;
            break;
        case 'column':
            baseClass = `flex flex-col ${gap || 'gap-4'} `;
            break;
        case 'grid': {
            let gridClass = `grid ${gap || 'gap-4'} `;
            if (gridColumns) gridClass += ` grid-cols-${gridColumns}`;
            if (gridRows) gridClass += ` grid-rows-${gridRows}`;
            baseClass = gridClass;
            break;
        }
        default:
            baseClass = `flex flex-row ${gap || 'gap-4'} `;
    }

    return `${baseClass} ${className || ''} ${bg || ''}`.trim();
};

const getSpanClasses = (
    span: number | { col?: number; row?: number } | undefined
) => {
    if (!span) return '';

    if (typeof span === 'number') {
        return `col-span-${span}`;
    }

    const classes = [];
    if (span.col) classes.push(`col-span-${span.col}`);
    if (span.row) classes.push(`row-span-${span.row}`);

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
        <div className={`w-full h-full  flex flex-col gap-4`} style={style}>
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
