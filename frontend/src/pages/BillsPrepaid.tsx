import React, { useState, useEffect } from "react";
import PageC from "@components/global/PageC";

const BillsPrepaid: React.FC = () => {
  const [cardData, setCardData] = useState<any[]>([]);
  const [rechargeData, setRechargeData] = useState<any[]>([]);
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("Daily");
  const [showTransactions, setShowTransactions] = useState(true);
  const [amountRange, setAmountRange] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const fetchOverviewCardsData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("API not available - using dummy data");
    } catch (error) {
      setCardData([
        {
          title: "Cummulative Current Balance",
          value: "-₹55,163.58",
          icon: "/icons/wallet.svg",
          subtitle1: "Across 4 Consumers",
        },
        {
          title: "Low Balance Consumers",
          value: "3",
          icon: "/icons/low-balance.svg",
          subtitle1: "Consumers Below ₹100",
        },
        {
          title: "Adhoc Credit Issued",
          value: "₹0",
          icon: "/icons/credit-issued.svg",
          subtitle1: "₹0.00 Issued to 12 Consumers",
        },
        {
          title: "Adhoc Credit Recovered",
          value: "₹0",
          icon: "/icons/credit-recovered.svg",
          subtitle1: "₹0.00 Remaining",
        },
      ]);
    }
  };

  const fetchRechargeData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      throw new Error("API not available - using dummy data");
    } catch (error) {
      setRechargeData([
        {
          title: "Total Recharge Collection",
          value: "₹0.00",
          icon: "/icons/total-recharge-collection.svg",
          previousValue: "vs. ₹0.00 Yesterday",
          subtitle2: "0 Recharges Processed",
        },
        {
          title: "Total Units Consumed",
          value: "51.07 kWh",
          icon: "/icons/units-consumed.svg",
          previousValue: "vs. 181.96 kWh Yesterday",
          subtitle2: "Consumed from 4 Meters",
        },
        {
          title: "Total Amount Deducted",
          value: "₹2,201.80",
          icon: "/icons/total-amount-deducted.svg",
          previousValue: "vs. ₹2,249.52 Yesterday",
          subtitle2: "Deducted from 4 Consumers",
        },
        {
          title: "No.of Transactions",
          value: "0",
          icon: "/icons/transactions.svg",
          previousValue: "vs. 0 Yesterday",
          subtitle2: "Transactions From 0 Consumers",
        },
        {
          title: "Alerts Triggered",
          value: "0",
          icon: "/icons/alerts.svg",
          previousValue: "vs. 0 Yesterday",
          subtitle2: "0 sent Today",
        },
        {
          title: "Auto Triggered Disconnects",
          value: "4",
          icon: "/icons/disconnect.svg",
          previousValue: "vs. 2 Yesterday",
          subtitle2: "4 Consumers Today",
        },
      ]);
    }
  };

  const fetchTransactionData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      throw new Error("API not available - using dummy data");
    } catch (error) {
      setTransactionData([
        {
          sNo: 1,
          consumer: "Airborne General Store",
          transactionId: "TXN12345",
          amount: "₹1,000.00",
          date: "2025-07-05",
          status: "Success",
        },
        {
          sNo: 2,
          consumer: "Neo Travels",
          transactionId: "TXN12346",
          amount: "₹2,000.00",
          date: "2025-07-05",
          status: "Success",
        },
        {
          sNo: 3,
          consumer: "Dormitory",
          transactionId: "TXN12347",
          amount: "₹500.00",
          date: "2025-07-05",
          status: "Failed",
        },
        {
          sNo: 4,
          consumer: "Mobikins",
          transactionId: "TXN12348",
          amount: "₹1,500.00",
          date: "2025-07-05",
          status: "Success",
        },
      ]);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchOverviewCardsData(),
          fetchRechargeData(),
          fetchTransactionData(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, []);

  const handleBackClick = () => window.history.back();
  const handleGenerateReport = () =>
    console.log("Generating prepaid report...");
  const handleMenuItemClick = (itemId: string) => {
    console.log(`Filter by: ${itemId}`);
    if (itemId === "transactions") {
      setShowTransactions(true);
    } else if (itemId === "hide-transactions") {
      setShowTransactions(false);
    }
  };
  const handleTimeRangeChange = (range: string) => setSelectedTimeRange(range);
  const handleViewTransaction = (row: any) =>
    alert(`View ${row.transactionId}`);
  const handleDownloadTransaction = (row: any) =>
    alert(`Download ${row.transactionId}`);
  const handleShareTransaction = (row: any) =>
    alert(`Share ${row.transactionId}`);

  const amountRangeOptions = [
    { value: "", label: "Select Amount Range" },
    { value: "0-1000", label: "₹0 - ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000+", label: "₹5,000+" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "Select Payment Status" },
    { value: "success", label: "Success" },
    { value: "failed", label: "Failed" },
    { value: "pending", label: "Pending" },
  ];

  const handleAmountRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmountRange(e.target.value);
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <PageC
      sections={[
        {
          layout: {
            type: "row" as const,
            className: "",
          },
          components: [
            {
              name: "PageHeader",
              props: {
                title: "Prepaid Overview",
                onBackClick: handleBackClick,
                backButtonText: "Back to Dashboard",
                buttonsLabel: "Generate Report",
                variant: "primary",
                onClick: handleGenerateReport,
                // showMenu: true,
                // showDropdown: true,
                // menuItems: [
                //   { id: "all", label: "All Transactions" },
                //   { id: "success", label: "Success" },
                //   { id: "failed", label: "Failed" },
                //   { id: "pending", label: "Pending" },
                //   { id: "low-balance", label: "Low Balance" },
                //   { id: "recharge", label: "Recharge" },
                //   { id: "consumption", label: "Consumption" },
                //   { id: "transactions", label: "Show Transactions" },
                //   { id: "hide-transactions", label: "Hide Transactions" },
                // ],
                onMenuItemClick: handleMenuItemClick,
              },
            },
          ],
        },
        {
          layout: {
            type: "grid" as const,
            columns: 4,
            gap: "gap-4", 
            className: "",
          },
          components: cardData.map((card, index) => ({
            name: "Card",
            props: {
              key: index,
              ...card,
            },
          })),
        },
                 {
           layout: {
             type: "row" as const,
             className: "",
           },
           components: [
             {
               name: "PageHeader",
               props: {
                 title: "Recharge & Usage(Today)",
                 className: "text-md font-bold text-dark-primary",
               },
             },
             {
               name: "TimeRangeSelector",
               props: {
                 availableTimeRanges: ["Daily", "Monthly"],
                 selectedTimeRange: selectedTimeRange,
                 handleTimeRangeChange: handleTimeRangeChange,
               },
             },
           ],
         },
        {
          layout: {
            type: "grid" as const,
            columns: 4,
            gap: "gap-4",
            className: "",
          },
          components: rechargeData.map((card, index) => ({
            name: "Card",
            props: {
              key: index,
              ...card,
            },
          })),
                 },
         ...(showTransactions
           ? [
               {
                 layout: {
                   type: "row" as const,
                   className: "",
                 },
                 components: [
                   {
                     name: "Dropdown",
                     props: {
                       name: "amountRange",
                       value: amountRange,
                       onChange: handleAmountRangeChange,
                       options: amountRangeOptions,
                       className: "w-full",
                     },
                   },
                   {
                     name: "DatePicker",
                     props: {
                       value: selectedDate,
                       onChange: handleDateChange,
                       placeholder: "Select Period",
                       className: "w-full ",
                     },
                   },
                   {
                     name: "Dropdown",
                     props: {
                       name: "paymentStatus",
                       value: paymentStatus,
                       onChange: handlePaymentStatusChange,
                       options: paymentStatusOptions,
                       className: "w-full ",
                     },
                   },
                 ],
               },
               {
                 layout: {
                   type: "column" as const,
                   className: "pb-4",
                 },
                 components: [
                   {
                     name: "Table",
                     props: {
                       data: transactionData,
                       columns: [
                         { key: "sNo", label: "S.No" },
                         { key: "consumer", label: "Consumer" },
                         { key: "transactionId", label: "Transaction ID" },
                         { key: "amount", label: "Amount" },
                         { key: "date", label: "Date" },
                         { key: "status", label: "Status" },
                       ],
                       actions: [
                         {
                           label: "View",
                           icon: "/icons/eye.svg",
                           onClick: handleViewTransaction,
                         },
                         {
                           label: "Download",
                           icon: "/icons/download.svg",
                           onClick: handleDownloadTransaction,
                         },
                         {
                           label: "Share",
                           icon: "/icons/share.svg",
                           onClick: handleShareTransaction,
                         },
                       ],
                       showActions: true,
                       pagination: true,
                       searchable: true,
                       emptyMessage: "No transactions found",
                     },
                   },
                 ],
               },
             ]
           : []),
      ]}
    />
  );
};

export default BillsPrepaid;
