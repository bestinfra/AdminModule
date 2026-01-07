import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Page from "@/components/global/PageC";

const dummyCardData = [
  {
    title: "Total Bill Amount",
    value: "N/A",
    icon: "/icons/total-recharge-collection.svg",
    subtitle2: "N/A",
    previousValue: "N/A",
  },
  {
    title: "Outstanding Amount",
    value: "N/A",
    icon: "/icons/wallet.svg",
    subtitle2: "N/A",
    previousValue: "N/A",
  },
  {
    title: "Overdue Amount",
    value: "N/A",
    icon: "/icons/credit-issued.svg",
    subtitle2: "N/A",
    previousValue: "N/A",
  },
  {
    title: "Total Amount Paid",
    value: "N/A",
    icon: "/icons/paid.svg",
    subtitle2: "N/A",
    previousValue: "N/A",
  },
  {
    title: "Realization Rate",
    value: "N/A",
    icon: "/icons/average.svg",
    subtitle2: "N/A",
    previousValue: "N/A",
  },
];

const dummyTableData = [
  {
    billNo: "N/A",
    consumerName: "N/A",
    uid: "N/A",
    meterNo: "N/A",
    billDate: "N/A",
    units: "N/A",
    billAmount: "N/A",
    dueDate: "N/A",
    status: "N/A",
  },
];

const tableColumns = [
  { key: "billNo", label: "Bill No" },
  { key: "consumerName", label: "Consumer Name" },
  { key: "uid", label: "UID" },
  { key: "meterNo", label: "Meter SI No" },
  { key: "billDate", label: "Bill Date" },
  { key: "units", label: "No. of Units" },
  { key: "billAmount", label: "Bill Amount" },
  { key: "dueDate", label: "Due Date" },
  {
    key: "status",
    label: "Status",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "Paid"
            ? "bg-positive-light text-positive"
            : value === "Overdue"
            ? "bg-danger-light text-danger"
            : "bg-warning-light text-warning"
        }`}
      >
        {value}
      </span>
    ),
  },
];

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

export default function Postpaid() {
  const navigate = useNavigate();
  const [amountRange, setAmountRange] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [_errorMessgae, _setErrors] = useState<any[]>([]);

  // State for tracking failed APIs
  const [failedApis, setFailedApis] = useState<
    Array<{
      id: string;
      name: string;
      retryFunction: () => Promise<void>;
      errorMessage: string;
    }>
  >([]);

  // ⬇ State for API data
  const [cardData, setCardData] = useState(dummyCardData);
  const [tableData, setTableData] = useState(dummyTableData);
  const [filteredData, setFilteredData] = useState(dummyTableData);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isBillsLoading, setIsBillsLoading] = useState(true);

  // Simple retry function for Cards API
  const retryCardsAPI = async () => {
    setIsCardsLoading(true);
    try {
      const res = await fetch("/api/postpaid/cards");

      if (!res.ok) {
        throw new Error(`Cards API failed with status ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Cards API returned non-JSON response");
      }

      const data = await res.json();
      setCardData(data?.data || dummyCardData);

      // Remove from failed APIs on success
      setFailedApis((prev) => prev.filter((api) => api.id !== "cards"));
    } catch (err: any) {
      console.error("Error in Bills Cards:", err);
      // Set dummy data on retry failure
      setCardData(dummyCardData);
      // Keep the error in failedApis for retry
    } finally {
      setIsCardsLoading(false);
    }
  };

  // Simple retry function for Bills API
  const retryBillsAPI = async () => {
    setIsBillsLoading(true);
    try {
      const res = await fetch("/api/postpaid/bills");

      if (!res.ok) {
        throw new Error(`Bills API failed with status ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Bills API returned non-JSON response");
      }

      const data = await res.json();
      const billsData = data?.data || dummyTableData;
      setTableData(billsData);
      setFilteredData(billsData);

      // Remove from failed APIs on success
      setFailedApis((prev) => prev.filter((api) => api.id !== "bills"));
    } catch (err: any) {
      console.error("Error in Bills Table:", err);
      // Set dummy data on retry failure
      setTableData(dummyTableData);
      setFilteredData(dummyTableData);
      // Keep the error in failedApis for retry
    } finally {
      setIsBillsLoading(false);
    }
  };

  // Fetch Cards Data
  useEffect(() => {
    const fetchCards = async () => {
      setIsCardsLoading(true);
      try {
        const res = await fetch("/api/postpaid/cards");

        if (!res.ok) {
          throw new Error(`Cards API failed with status ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Cards API returned non-JSON response");
        }

        const data = await res.json();
        setCardData(data?.data || dummyCardData);
      } catch (err: any) {
        console.error("Error in Bills Cards:", err);

        // Set N/A data from dummy data
        setCardData(dummyCardData);

        // Add to failed APIs
        setFailedApis((prev) => {
          if (!prev.find((api) => api.id === "cards")) {
            return [
              ...prev,
              {
                id: "cards",
                name: "Bill Data",
                retryFunction: retryCardsAPI,
                errorMessage: "Failed to load Bills Cards. Please try again.",
              },
            ];
          }
          return prev;
        });
      } finally {
        setIsCardsLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Fetch Bills Table Data
  useEffect(() => {
    const fetchBills = async () => {
      setIsBillsLoading(true);
      try {
        const res = await fetch("/api/postpaid/bills");

        if (!res.ok) {
          throw new Error(`Bills API failed with status ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Bills API returned non-JSON response");
        }

        const data = await res.json();
        const billsData = data?.data || dummyTableData;
        setTableData(billsData);
        setFilteredData(billsData);
      } catch (err: any) {
        console.error("Error in Bills Table:", err);

        // Set N/A data from dummy data
        setTableData(dummyTableData);
        setFilteredData(dummyTableData);

        // Add to failed APIs
        setFailedApis((prev) => {
          if (!prev.find((api) => api.id === "bills")) {
            return [
              ...prev,
              {
                id: "bills",
                name: "Bill Data",
                retryFunction: retryBillsAPI,
                errorMessage: "Failed to load Bills Table. Please try again.",
              },
            ];
          }
          return prev;
        });
      } finally {
        setIsBillsLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Retry specific API
  const retrySpecificAPI = (apiId: string) => {
    const api = failedApis.find((a) => a.id === apiId);
    if (api) {
      api.retryFunction();
    }
  };

  const handleAddBill = () => {
    console.log("Adding new bill...");
  };

  const handleFilterChange = (itemId: string) => {
    console.log(`Filter by: ${itemId}`);
    // Apply filters based on selection
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

  const handlePaymentStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentStatus(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    // Filter data based on search
    const filtered = tableData.filter(
      (item) =>
        item.consumerName.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.uid.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.billNo.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.meterNo.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  // Initialize filtered data
  useEffect(() => {
    setFilteredData(tableData);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page
        sections={[
          // Page Header Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "column",
                  columns: [
                    // Show stacked error effect when there are failed APIs
                    ...(failedApis.length > 0
                      ? [
                          {
                            name: "Error",
                            props: {
                              visibleErrors: failedApis.map(
                                (api) => api.errorMessage
                              ),
                              showRetry: true,
                              maxVisibleErrors: 3, // Show max 3 errors at once
                              failedApis: failedApis, // Pass all failed APIs for individual retry
                              onRetrySpecific: retrySpecificAPI, // Pass the retry function
                            },
                          },
                        ]
                      : []),
                    {
                      name: "PageHeader",
                      props: {
                        title: "Bills Postpaid",
                        onBackClick: () => navigate("/dashboard"),
                        backButtonText: "Back to Dashboard",
                        buttonsLabel: "Add Bill",
                        variant: "primary",
                        onClick: handleAddBill,
                        showMenu: true,
                        showDropdown: true,
                        menuItems: [
                          {
                            id: "all",
                            label: "All Bills",
                          },
                          {
                            id: "paid",
                            label: "Paid",
                          },
                          {
                            id: "unpaid",
                            label: "Unpaid",
                          },
                          {
                            id: "overdue",
                            label: "Overdue",
                          },
                          {
                            id: "pending",
                            label: "Pending",
                          },
                          {
                            id: "high-amount",
                            label: "High Amount",
                          },
                          {
                            id: "low-amount",
                            label: "Low Amount",
                          },
                        ],
                        onMenuItemClick: handleFilterChange,
                      },
                    },
                  ],
                },
              ],
            },
          },
          // Overview Cards Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "grid",
                  gridColumns: 4,
                  gap: "gap-4",
                  columns: cardData.slice(0, 4).map((card) => ({
                    name: "Card",
                    props: {
                      ...card,
                      bg: "bg-stat-icon-gradient",
                      loading: isCardsLoading,
                    },
                  })),
                },
              ],
            },
          },
          // Realization Rate Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "grid",
                  gridColumns: 4,
                  gap: "gap-4",
                  columns: [
                    {
                      name: "Card",
                      props: {
                        ...cardData[4],
                        bg: "bg-stat-icon-gradient",
                        loading: isCardsLoading,
                      },
                    },
                  ],
                },
              ],
            },
          },
          // Filters Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "row",
                  className:
                    "flex flex-col md:flex-row md:items-center md:gap-4 gap-4",
                  columns: [
                    {
                      name: "Dropdown",
                      props: {
                        name: "amountRange",
                        value: amountRange,
                        onChange: handleAmountRangeChange,
                        options: amountRangeOptions,
                        className: "w-full md:w-1/3",
                      },
                    },
                    {
                      name: "DatePicker",
                      props: {
                        value: selectedDate,
                        onChange: handleDateChange,
                        placeholder: "Select Date",
                        className: "w-full md:w-1/3",
                      },
                    },
                    {
                      name: "Dropdown",
                      props: {
                        name: "paymentStatus",
                        value: paymentStatus,
                        onChange: handlePaymentStatusChange,
                        options: paymentStatusOptions,
                        className: "w-full md:w-1/3",
                      },
                    },
                  ],
                },
              ],
            },
          },
          // Search Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "row",
                  columns: [
                    {
                      name: "Search",
                      props: {
                        value: search,
                        onChange: handleSearchChange,
                        placeholder:
                          "Search bills by consumer name, UID, or bill number...",
                        className: "w-full ",
                        showShortcut: true,
                        isLoading: false,
                        name: "billSearch",
                      },
                    },
                  ],
                },
              ],
            },
          },
          // Bills Table Section
          {
            layout: {
              type: "column",
              gap: "gap-4",
              rows: [
                {
                  layout: "grid",
                  gridColumns: 1,
                  className: "pb-4",
                  columns: [
                    {
                      name: "Table",
                      props: {
                        data: filteredData,
                        columns: tableColumns,
                        searchable: true,
                        pagination: true,
                        rowsPerPageOptions: [5, 10, 15, 25],
                        search: true,
                        initialRowsPerPage: 10,
                        emptyMessage: search
                          ? "No bills found matching your search"
                          : "No Bills Found",
                        showHeader: true,
                        headerTitle: `Bills Management ${
                          search ? `(${filteredData.length} results)` : ""
                        }`,
                        dateRange: "Jan 2024 - Dec 2024",
                        isLoading: isBillsLoading,
                      },
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
    </Suspense>
  );
}
