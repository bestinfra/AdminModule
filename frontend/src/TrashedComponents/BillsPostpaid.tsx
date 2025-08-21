import React, { useState, useEffect } from "react";
import PageC from "@components/global/PageC";

const BillsPostpaid: React.FC = () => {
  const [cardData, setCardData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [amountRange, setAmountRange] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");

  const fetchOverviewCardsData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error("API not available - using dummy data");
    } catch (error) {
             setCardData([
         {
           title: "Total Bill Amount",
           value: "₹15,500.00",
           icon: "/icons/total-recharge-collection.svg",
           subtitle2: "4 Total Bills Generated",
           showTrend: true,
           comparisonValue: 2.5,
         },
         {
           title: "Outstanding Amount",
           value: "₹4,300.00",
           icon: "/icons/wallet.svg",
           subtitle2: "2 Pending Bills",
           showTrend: true,
           comparisonValue: -1.2,
         },
         {
           title: "Overdue Amount",
           value: "₹1,000.00",
           icon: "/icons/credit-issued.svg",
           subtitle2: "1 Overdue Bills",
           showTrend: true,
           comparisonValue: 0.8,
         },
         {
           title: "Total Amount Paid",
           value: "₹11,200.00",
           icon: "/icons/paid.svg",
           subtitle2: "2 Consumer Paid",
           showTrend: true,
           comparisonValue: 3.1,
         },
         {
           title: "Realization Rate",
           value: "72.26%",
           icon: "/icons/average.svg",
           subtitle2: "2 Consumer Paid",
           showTrend: true,
           comparisonValue: 1.8,
         },
       ]);
    }
  };

  const fetchTableData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      throw new Error("API not available - using dummy data");
    } catch (error) {
      setTableData([
        {
          billNo: "BILL001",
          consumerName: "Airborne General Store",
          uid: "UID12345",
          meterNo: "MTR001",
          billDate: "2025-07-05",
          units: "150 kWh",
          billAmount: "₹1,500.00",
          dueDate: "2025-07-20",
          status: "Unpaid",
        },
        {
          billNo: "BILL002",
          consumerName: "Neo Travels",
          uid: "UID12346",
          meterNo: "MTR002",
          billDate: "2025-07-05",
          units: "200 kWh",
          billAmount: "₹2,000.00",
          dueDate: "2025-07-20",
          status: "Paid",
        },
        {
          billNo: "BILL003",
          consumerName: "Dormitory",
          uid: "UID12347",
          meterNo: "MTR003",
          billDate: "2025-07-05",
          units: "100 kWh",
          billAmount: "₹1,000.00",
          dueDate: "2025-07-15",
          status: "Overdue",
        },
        {
          billNo: "BILL004",
          consumerName: "Mobikins",
          uid: "UID12348",
          meterNo: "MTR004",
          billDate: "2025-07-05",
          units: "180 kWh",
          billAmount: "₹1,800.00",
          dueDate: "2025-07-20",
          status: "Unpaid",
        },
      ]);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          fetchOverviewCardsData(),
          fetchTableData(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAllData();
  }, []);

  const handleBackClick = () => window.history.back();
  const handleAddBill = () => console.log("Adding new bill...");
  const handleMenuItemClick = (itemId: string) => {
    console.log(`Filter by: ${itemId}`);
    if (itemId === "paid" || itemId === "unpaid" || itemId === "overdue") {
      setPaymentStatus(itemId);
    } else if (itemId === "high-amount") {
      setAmountRange("5000+");
    } else if (itemId === "low-amount") {
      setAmountRange("0-1000");
    } else if (itemId === "all") {
      setPaymentStatus("");
      setAmountRange("");
    }
  };

  const handleAmountRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmountRange(e.target.value);
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentStatus(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleViewBill = (row: any) => alert(`View ${row.billNo}`);
  const handleDownloadBill = (row: any) => alert(`Download ${row.billNo}`);
  const handleShareBill = (row: any) => alert(`Share ${row.billNo}`);

  const amountRangeOptions = [
    { value: "", label: "Select Amount Range" },
    { value: "0-1000", label: "₹0 - ₹1,000" },
    { value: "1000-5000", label: "₹1,000 - ₹5,000" },
    { value: "5000+", label: "₹5,000+" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "Select Payment Status" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "overdue", label: "Overdue" },
  ];

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
                title: "Bills Postpaid",
                onBackClick: handleBackClick,
                backButtonText: "Back to Dashboard",
                buttonsLabel: "Add Bill",
                variant: "primary",
                onClick: handleAddBill,
                showMenu: true,
                showDropdown: true,
                menuItems: [
                  { id: "all", label: "All Bills" },
                  { id: "paid", label: "Paid" },
                  { id: "unpaid", label: "Unpaid" },
                  { id: "overdue", label: "Overdue" },
                  { id: "pending", label: "Pending" },
                  { id: "high-amount", label: "High Amount" },
                  { id: "low-amount", label: "Low Amount" },
                ],
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
          components: cardData.slice(0, 4).map((card, index) => ({
            name: "Card",
            props: {
              key: index,
              ...card,
            },
          })),
        },
        {
          layout: {
            type: "grid" as const,
            columns: 4,
            gap: "gap-4",
            className: "",
            
          },
          components: [
            {
              name: "Card",
              props: {
                key: 4,
                ...cardData[4],
              },

              span: {
                col: 1,
                row: 1,
              },
            },
          ],
        },
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
                placeholder: "Select Date",
                className: "w-full",
              },
            },
            {
              name: "Dropdown",
              props: {
                name: "paymentStatus",
                value: paymentStatus,
                onChange: handlePaymentStatusChange,
                options: paymentStatusOptions,
                className: "w-full",
              },
            },
          ],
        },
        {
          layout: {
            type: "row" as const,
            className: "",
          },
          components: [
                         {
               name: "Search",
               props: {
                 value: search,
                 onChange: handleSearchChange,
                 placeholder: "Search bills...",
                 className: "w-full",
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
                data: tableData,
                columns: [
                  { key: "billNo", label: "Bill No" },
                  { key: "consumerName", label: "Consumer Name" },
                  { key: "uid", label: "UID" },
                  { key: "meterNo", label: "Meter SI No" },
                  { key: "billDate", label: "Bill Date" },
                  { key: "units", label: "No. of Units" },
                  { key: "billAmount", label: "Bill Amount" },
                  { key: "dueDate", label: "Due Date" },
                  { key: "status", label: "Status" },
                ],
                actions: [
                  {
                    label: "View",
                    icon: "/icons/eye.svg",
                    onClick: handleViewBill,
                  },
                  {
                    label: "Download",
                    icon: "/icons/download.svg",
                    onClick: handleDownloadBill,
                  },
                  {
                    label: "Share",
                    icon: "/icons/share.svg",
                    onClick: handleShareBill,
                  },
                ],
                showActions: true,
                pagination: true,
                searchable: true,
                emptyMessage: "No Bills Found",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default BillsPostpaid; 