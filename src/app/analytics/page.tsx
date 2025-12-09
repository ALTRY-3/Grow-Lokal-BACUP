"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPesoSign,
  faBoxOpen,
  faExclamationTriangle,
  faUser,
  faUserPlus,
  faStar,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import "./analytics.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AnalyticsData {
  shopInfo: {
    name: string;
    owner: string;
    location: string;
    picture: string;
    category: string;
    craftType: string;
  };
  salesData: {
    totalSales: number;
    periodSales: number;
    totalOrders: number;
    periodOrders: number;
    averageSaleValue: number;
    salesGrowth: number;
    salesTrend: Array<{ date: string; sales: number; orders: number }>;
  };
  productStats: {
    totalProducts: number;
    topPerformer: { name: string; sold: number } | null;
    topSellingProducts: Array<{ name: string; sold: number; revenue: number }>;
    leastSellingProducts: Array<{ name: string; sold: number }>;
  };
  stockLevels: {
    lowStockCount: number;
    outOfStockCount: number;
    lowStockItems: Array<{ name: string; stock: number }>;
    outOfStockItems: Array<{ name: string }>;
  };
  customerMetrics: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    retentionRate: number;
  };
  shopRating: {
    averageRating: number;
    totalReviews: number;
  };
}

const periodOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3mo" },
  { label: "Last year", value: "1y" },
];

const formatCurrency = (value: number) =>
  `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const buildInsights = (data: AnalyticsData, periodLabel: string): string[] => {
  const insights: string[] = [];
  const { salesData, productStats, stockLevels, customerMetrics, shopRating } =
    data;

  insights.push(
    `During ${periodLabel}, your shop generated ${formatCurrency(
      salesData.periodSales
    )} across ${salesData.periodOrders} orders.`
  );

  if (salesData.salesGrowth >= 0) {
    insights.push(
      `Sales grew by ${salesData.salesGrowth.toFixed(
        1
      )}% versus the prior period, indicating healthy momentum.`
    );
  } else {
    insights.push(
      `Sales dipped by ${Math.abs(salesData.salesGrowth).toFixed(
        1
      )}% vs the prior period—consider targeted campaigns to re-accelerate.`
    );
  }

  if (salesData.salesTrend.length) {
    const bestDay = salesData.salesTrend.reduce((best, current) =>
      current.sales > best.sales ? current : best
    );
    insights.push(
      `Best-performing day: ${bestDay.date} with ${formatCurrency(
        bestDay.sales
      )} in revenue.`
    );
  }

  if (productStats.topPerformer) {
    insights.push(
      `Top product: ${productStats.topPerformer.name} with ${productStats.topPerformer.sold} units sold.`
    );
  }

  const lowStockTotal = stockLevels.lowStockItems.length;
  const outOfStockTotal = stockLevels.outOfStockItems.length;
  if (lowStockTotal || outOfStockTotal) {
    insights.push(
      `Inventory alerts: ${lowStockTotal} low-stock and ${outOfStockTotal} out-of-stock items need attention.`
    );
  }

  if (customerMetrics.totalCustomers) {
    insights.push(
      `Customer base: ${
        customerMetrics.totalCustomers
      } customers with ${customerMetrics.retentionRate.toFixed(1)}% retention.`
    );
  }

  if (shopRating.totalReviews) {
    insights.push(
      `Reputation: ${shopRating.averageRating.toFixed(
        1
      )}★ average rating from ${shopRating.totalReviews} reviews.`
    );
  }

  return insights;
};

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch(
        "/api/seller/analytics?period=" + selectedPeriod,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your analytics");
        }
        throw new Error("Failed to fetch analytics data");
      }

      const result = await response.json();

      // Map the API response to the expected format
      if (result.success && result.data) {
        const apiData = result.data;
        const mappedData: AnalyticsData = {
          shopInfo: apiData.shopInfo || {
            name: "My Shop",
            owner: "Owner",
            location: "Location not set",
            picture: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
            category: "Artisan",
            craftType: "Handmade",
          },
          salesData: {
            totalSales: apiData.salesMetrics?.totalSales || 0,
            periodSales: apiData.salesMetrics?.periodSales || 0,
            totalOrders: apiData.salesMetrics?.totalOrders || 0,
            periodOrders: apiData.salesMetrics?.periodOrders || 0,
            averageSaleValue: apiData.salesMetrics?.averageOrderValue || 0,
            salesGrowth: apiData.salesMetrics?.salesGrowth || 0,
            salesTrend: apiData.salesTrend || [],
          },
          productStats: {
            totalProducts: apiData.productMetrics?.totalProducts || 0,
            topPerformer: apiData.productMetrics?.topPerformer || null,
            topSellingProducts: apiData.topSellingProducts || [],
            leastSellingProducts: apiData.leastSellingProducts || [],
          },
          stockLevels: {
            lowStockCount: apiData.productMetrics?.lowStockCount || 0,
            outOfStockCount: (apiData.stockLevels || []).filter(
              (s: { status: string }) => s.status === "Out"
            ).length,
            lowStockItems: (apiData.stockLevels || [])
              .filter((s: { status: string }) => s.status === "Low")
              .map((s: { name: string; stock: number }) => ({
                name: s.name,
                stock: s.stock,
              })),
            outOfStockItems: (apiData.stockLevels || [])
              .filter((s: { status: string }) => s.status === "Out")
              .map((s: { name: string }) => ({ name: s.name })),
          },
          customerMetrics: {
            totalCustomers: apiData.customerMetrics?.totalCustomers || 0,
            newCustomers: apiData.customerMetrics?.newCustomers || 0,
            returningCustomers:
              apiData.customerMetrics?.returningCustomers || 0,
            retentionRate: apiData.customerMetrics?.retentionRate || 0,
          },
          shopRating: apiData.shopRating || {
            averageRating: 0,
            totalReviews: 0,
          },
        };
        setAnalyticsData(mappedData);
      } else {
        throw new Error(result.error || "Failed to load analytics data");
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const convertToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // For SVG files, fetch and render as PNG
      if (url.endsWith(".svg")) {
        fetch(url)
          .then((response) => response.text())
          .then((svgText) => {
            const img = new Image();
            const blob = new Blob([svgText], { type: "image/svg+xml" });
            const svgUrl = URL.createObjectURL(blob);

            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (!ctx) return reject("Canvas context error");
              ctx.drawImage(img, 0, 0);
              URL.revokeObjectURL(svgUrl);
              resolve(canvas.toDataURL("image/png"));
            };

            img.onerror = () => {
              URL.revokeObjectURL(svgUrl);
              reject("Failed to render SVG");
            };

            img.src = svgUrl;
          })
          .catch((err) => reject(err));
      } else {
        // For PNG/JPG, use canvas conversion
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas error");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = () => reject("Failed to load logo");
      }
    });
  };

  const exportExcel = () => {
    if (!analyticsData) return;

    const workbook = XLSX.utils.book_new();
    const periodLabel =
      periodOptions.find((option) => option.value === selectedPeriod)?.label ||
      selectedPeriod;
    const insights = buildInsights(analyticsData, periodLabel);
    const today = new Date();
    const reportDate = today.toLocaleString();

    // Color palette
    const brandColors = {
      primaryDark: "2E3F36",
      gold: "AF7928",
      lightGold: "FFC46B",
      lightBg: "F5F3EF",
      border: "E5E1DC",
    };

    // Helper function to set column widths
    const setColumnWidths = (worksheet: XLSX.WorkSheet, widths: number[]) => {
      worksheet["!cols"] = widths.map((w) => ({ wch: w }));
    };

    // Enhanced header styling with automatic detection
    const applyHeaderStyle = (
      worksheet: XLSX.WorkSheet,
      headerRowIndex: number = 0
    ) => {
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });

        if (!worksheet[cell]) continue;

        worksheet[cell].s = {
          fill: { fgColor: { rgb: brandColors.primaryDark } },
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    };

    // Auto-detect header row (looks for "Metric"/"Value" pattern)
    const detectHeaderRow = (worksheet: XLSX.WorkSheet): number => {
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellA = worksheet[XLSX.utils.encode_cell({ r: R, c: 0 })];
        const cellB = worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })];

        if (
          cellA &&
          cellB &&
          (cellA.v === "Metric" || cellA.v === "#") &&
          (cellB.v === "Value" || cellB.v === "Insight")
        ) {
          return R;
        }
      }

      return 0; // Default to first row if pattern not found
    };

    // Apply branding to a specific cell
    const applyCellBranding = (
      worksheet: XLSX.WorkSheet,
      cellRef: string,
      bgColor: string,
      fontSize: number = 11
    ) => {
      if (!worksheet[cellRef]) return;
      worksheet[cellRef].s = {
        fill: { fgColor: { rgb: bgColor } },
        font: { bold: true, color: { rgb: "FFFFFF" }, size: fontSize },
        alignment: { horizontal: "center", vertical: "center" },
      };
    };

    // Create EXECUTIVE SUMMARY sheet first
    const executiveSummary = [
      ["🎨 GrowLokal Analytics Report"],
      ["Powered by GrowLokal • Professional Performance Dashboard"],
      [],
      [`Shop Name: ${analyticsData.shopInfo.name}`],
      [`Owner: ${analyticsData.shopInfo.owner}`],
      [`Category: ${analyticsData.shopInfo.category || "Artisan"}`],
      [`Location: ${analyticsData.shopInfo.location || "Not set"}`],
      [`Report Period: ${periodLabel}`],
      [`Generated: ${reportDate}`],
      [],
      ["EXECUTIVE SNAPSHOT"],
      ["Metric", "Value"],
      [
        "Total Sales (Lifetime)",
        formatCurrency(analyticsData.salesData.totalSales),
      ],
      ["Period Sales", formatCurrency(analyticsData.salesData.periodSales)],
      ["Total Orders", analyticsData.salesData.totalOrders],
      ["Period Orders", analyticsData.salesData.periodOrders],
      [
        "Average Order Value",
        formatCurrency(analyticsData.salesData.averageSaleValue),
      ],
      ["Sales Growth (%)", analyticsData.salesData.salesGrowth.toFixed(2)],
      ["Total Products", analyticsData.productStats.totalProducts],
      ["Total Customers", analyticsData.customerMetrics.totalCustomers],
      ["New Customers", analyticsData.customerMetrics.newCustomers],
      [
        "Retention Rate (%)",
        analyticsData.customerMetrics.retentionRate.toFixed(2),
      ],
      [
        "Shop Rating",
        analyticsData.shopRating.totalReviews
          ? `${analyticsData.shopRating.averageRating.toFixed(1)}★`
          : "No reviews",
      ],
      ["Total Reviews", analyticsData.shopRating.totalReviews],
    ];
    const summaryWs = XLSX.utils.aoa_to_sheet(executiveSummary);
    setColumnWidths(summaryWs, [40, 40]);

    // Apply custom branding to title and subtitle
    applyCellBranding(summaryWs, "A1", brandColors.primaryDark, 14);
    applyCellBranding(summaryWs, "A2", brandColors.gold, 11);

    // Apply header style to actual header row (row 11: "Metric", "Value")
    applyHeaderStyle(summaryWs, 11);

    summaryWs["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(workbook, summaryWs, "Executive Summary");

    // Create SALES OVERVIEW sheet with matching styling
    const salesOverview = [
      ["💰 Sales Overview"],
      ["Key financial indicators for the selected period"],
      [],
      ["Metric", "Value"],
      ["Total Sales", formatCurrency(analyticsData.salesData.totalSales)],
      ["Period Sales", formatCurrency(analyticsData.salesData.periodSales)],
      ["Total Orders", analyticsData.salesData.totalOrders],
      ["Period Orders", analyticsData.salesData.periodOrders],
      [
        "Average Order Value",
        formatCurrency(analyticsData.salesData.averageSaleValue),
      ],
      ["Sales Growth (%)", analyticsData.salesData.salesGrowth.toFixed(2)],
    ];
    const salesOverviewWs = XLSX.utils.aoa_to_sheet(salesOverview);
    setColumnWidths(salesOverviewWs, [40, 40]);

    // Apply custom branding to title and subtitle
    applyCellBranding(salesOverviewWs, "A1", brandColors.primaryDark, 14);
    applyCellBranding(salesOverviewWs, "A2", brandColors.gold, 11);

    // Apply header style to actual header row (row 3: "Metric", "Value")
    applyHeaderStyle(salesOverviewWs, 3);

    salesOverviewWs["!freeze"] = { xSplit: 0, ySplit: 1 };
    XLSX.utils.book_append_sheet(workbook, salesOverviewWs, "Sales Overview");

    // Helper function for safe sheet append with automatic header detection
    const safeAppendSheet = (
      rows: Record<string, unknown>[],
      title: string,
      columnWidths?: number[]
    ) => {
      const normalizedRows = rows.length
        ? rows
        : [{ Note: "No data available" }];
      const worksheet = XLSX.utils.json_to_sheet(normalizedRows);

      if (columnWidths) {
        setColumnWidths(worksheet, columnWidths);
      }

      // Auto-detect and apply header styling to row 0 for json_to_sheet results
      applyHeaderStyle(worksheet, 0);

      worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
    };

    const {
      shopInfo,
      salesData,
      productStats,
      stockLevels,
      customerMetrics,
      shopRating,
    } = analyticsData;
    const bestSalesDay = salesData.salesTrend.length
      ? salesData.salesTrend.reduce((best, current) =>
          current.sales > best.sales ? current : best
        )
      : null;
    const busiestOrderDay = salesData.salesTrend.length
      ? salesData.salesTrend.reduce((best, current) =>
          current.orders > best.orders ? current : best
        )
      : null;
    const lowStockTotal = stockLevels.lowStockItems.length;
    const outOfStockTotal = stockLevels.outOfStockItems.length;
    const avgOrdersPerCustomer = customerMetrics.totalCustomers
      ? Number(
          (salesData.periodOrders / customerMetrics.totalCustomers).toFixed(2)
        )
      : 0;

    safeAppendSheet(
      [
        {
          "Shop Name": shopInfo.name,
          Owner: shopInfo.owner,
          Location: shopInfo.location || "Not set",
          Category: shopInfo.category || "Artisan",
          "Craft Type": shopInfo.craftType || "Handmade",
        },
      ],
      "Shop Overview",
      [25, 20, 25, 20, 20]
    );

    safeAppendSheet(
      [
        {
          Period: periodLabel,
          "Report Generated": reportDate,
          "Total Sales": salesData.totalSales,
          "Period Sales": salesData.periodSales,
          "Total Orders": salesData.totalOrders,
          "Period Orders": salesData.periodOrders,
          "Average Order Value": salesData.averageSaleValue,
          "Sales Growth (%)": salesData.salesGrowth,
          "Best Sales Day": bestSalesDay
            ? `${bestSalesDay.date} (${formatCurrency(bestSalesDay.sales)})`
            : "Not available",
          "Most Orders Day": busiestOrderDay
            ? `${busiestOrderDay.date} (${busiestOrderDay.orders} orders)`
            : "Not available",
        },
      ],
      "Sales Summary",
      [20, 25, 18, 18, 18, 18, 22, 18, 30, 28]
    );

    safeAppendSheet(
      [
        {
          Metric: "Top Product",
          Value: productStats.topPerformer?.name || "Not available",
        },
        {
          Metric: "Top Product Units",
          Value: productStats.topPerformer?.sold ?? "Not available",
        },
        {
          Metric: "Low Stock Alerts",
          Value: `${lowStockTotal} low / ${outOfStockTotal} out`,
        },
        {
          Metric: "Avg Orders per Customer",
          Value: avgOrdersPerCustomer || "Not available",
        },
        {
          Metric: "Customer Mix",
          Value: `${customerMetrics.newCustomers} new / ${customerMetrics.returningCustomers} returning`,
        },
        {
          Metric: "Shop Rating",
          Value: shopRating.totalReviews
            ? `${shopRating.averageRating.toFixed(1)}★ (${
                shopRating.totalReviews
              } reviews)`
            : "No reviews yet",
        },
      ],
      "Performance Snapshot",
      [25, 40]
    );

    safeAppendSheet(
      salesData.salesTrend.map((entry) => ({
        Date: entry.date,
        "Sales (PHP)": entry.sales,
        Orders: entry.orders,
      })),
      "Sales Trend",
      [15, 18, 12]
    );

    safeAppendSheet(
      productStats.topSellingProducts.map((product, index) => ({
        Rank: index + 1,
        Product: product.name,
        "Units Sold": product.sold,
        Revenue: product.revenue ?? 0,
      })),
      "Top Products",
      [8, 25, 15, 15]
    );

    safeAppendSheet(
      productStats.leastSellingProducts.map((product, index) => ({
        Rank: index + 1,
        Product: product.name,
        "Units Sold": product.sold,
      })),
      "Watchlist Products",
      [8, 25, 15]
    );

    const inventoryRows = [
      ...stockLevels.lowStockItems.map((item) => ({
        Product: item.name,
        Status: "Low Stock",
        Stock: item.stock,
      })),
      ...stockLevels.outOfStockItems.map((item) => ({
        Product: item.name,
        Status: "Out of Stock",
        Stock: 0,
      })),
    ];
    safeAppendSheet(inventoryRows, "Inventory Health", [25, 15, 10]);

    safeAppendSheet(
      [
        {
          "Total Customers": customerMetrics.totalCustomers,
          "New Customers": customerMetrics.newCustomers,
          "Returning Customers": customerMetrics.returningCustomers,
          "Retention Rate (%)": customerMetrics.retentionRate,
        },
      ],
      "Customer Metrics",
      [20, 18, 20, 20]
    );

    safeAppendSheet(
      [
        {
          "Average Rating": shopRating.averageRating,
          "Total Reviews": shopRating.totalReviews,
        },
      ],
      "Ratings",
      [20, 15]
    );

    safeAppendSheet(
      insights.map((text, index) => ({ "#": index + 1, Insight: text })),
      "Insights",
      [5, 75]
    );

    // Add Metadata sheet
    const metadata = [
      ["🎨 GrowLokal Analytics - Export Metadata"],
      [],
      ["Branding"],
      ["Brand Name", "GrowLokal"],
      ["Logo File", "logo.svg"],
      ["Logo Location", "/public/logo.svg"],
      ["Brand Colors", "Primary: #2E3F36 | Gold: #AF7928"],
      [],
      ["Shop Information"],
      ["Shop Name", shopInfo.name],
      ["Owner", shopInfo.owner],
      ["Category", shopInfo.category || "Artisan"],
      [],
      ["Report Details"],
      ["Period", periodLabel],
      ["Generated Date", reportDate],
      ["Export Timestamp", new Date().toISOString()],
      [],
      ["Data Source"],
      ["Platform", "GrowLokal Analytics"],
      ["Version", "1.0"],
      ["Report Type", "Comprehensive Performance Report"],
    ];
    const metadataWs = XLSX.utils.aoa_to_sheet(metadata);
    setColumnWidths(metadataWs, [30, 35]);
    XLSX.utils.book_append_sheet(workbook, metadataWs, "Metadata");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const todayStr = today.toISOString().split("T")[0];
    const sanitizedPeriod = periodLabel.replace(/\s+/g, "_").toLowerCase();
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `analytics_${sanitizedPeriod}_${todayStr}.xlsx`
    );
  };

  const exportPDF = async () => {
    if (!analyticsData) return;

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;
    let pageNumber = 0;
    const totalPages = 3; // Approximation; will be updated dynamically

    // Convert real logo to Base64
    let logoImageData: string | null = null;
    try {
      logoImageData = await convertToBase64("/logo.svg");
    } catch {
      console.warn("Logo failed to load, using fallback.");
    }

    const colors = {
      primary: [46, 63, 54] as const,
      accent: [175, 121, 40] as const,
      accentLight: [255, 196, 107] as const,
      muted: [120, 120, 120] as const,
      mutedLight: [180, 180, 180] as const,
      border: [229, 225, 220] as const,
      card: [250, 248, 244] as const,
      background: [247, 243, 236] as const,
      page: [252, 250, 245] as const,
      white: [255, 255, 255] as const,
    } as const;

    const periodLabel =
      periodOptions.find((option) => option.value === selectedPeriod)?.label ||
      selectedPeriod;
    const insights = buildInsights(analyticsData, periodLabel);

    const headerHeight = 72;
    const navBandHeight = 8;
    const footerHeight = 56;
    const contentTop = margin + headerHeight + navBandHeight + 8;
    const contentBottom = pageHeight - margin - footerHeight - 20;

    const setText = (color: readonly [number, number, number]) =>
      doc.setTextColor(color[0], color[1], color[2]);

    // Draw watermark on every page
    const drawWatermark = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(90);
      doc.setTextColor(225, 225, 225); // Very light gray for lower opacity
      // Manually reduce opacity by using light color + light appearance
      const watermarkText = "GrowLokal";
      doc.text(watermarkText, pageWidth / 2 + 10, pageHeight / 2 + 90, {
        align: "center",
        angle: 45,
      });
    };

    // Draw page header
    const drawPageHeader = () => {
      // Background
      doc.setFillColor(colors.page[0], colors.page[1], colors.page[2]);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Primary header band - full width
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      // Logo (left side)
      if (logoImageData) {
        // REAL LOGO - rendered as PNG
        doc.addImage(logoImageData, "PNG", margin - 8, 10, 50, 50);
      } else {
        // FALLBACK PLACEHOLDER
        doc.setFillColor(
          colors.accentLight[0],
          colors.accentLight[1],
          colors.accentLight[2]
        );
        doc.roundedRect(margin - 8, 12, 40, 48, 4, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(
          colors.primary[0],
          colors.primary[1],
          colors.primary[2]
        );
        doc.text("GL", margin + 12, headerHeight / 2 + 6, { align: "center" });
      }

      // Nav band
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(0, headerHeight, pageWidth, navBandHeight, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      setText(colors.white);
      doc.text("GrowLokal Analytics Report", margin + 50, headerHeight / 2 + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setText(colors.accentLight);
      doc.text(
        `${analyticsData.shopInfo.name} • ${periodLabel}`,
        margin + 50,
        headerHeight / 2 + 20
      );

      // Footer band
      doc.setFillColor(colors.card[0], colors.card[1], colors.card[2]);
      doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");

      // Footer accent line
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(0, pageHeight - footerHeight, pageWidth, 3, "F");

      // Footer text
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      setText(colors.mutedLight);
      const footerY = pageHeight - footerHeight / 2 + 4;
      doc.text("Generated via GrowLokal Analytics", margin, footerY);
      doc.text(
        `Page ${pageNumber} of Multiple`,
        pageWidth - margin - 60,
        footerY
      );
      setText(colors.primary);
    };

    const addNewPage = () => {
      doc.addPage();
      pageNumber += 1;
      drawPageHeader();
      drawWatermark();
      y = contentTop;
    };

    const ensureSpace = (needed = 60) => {
      if (y + needed > contentBottom) {
        addNewPage();
      }
    };

    // Initialize first page
    pageNumber = 1;
    drawPageHeader();
    drawWatermark();
    y = contentTop;

    // EXECUTIVE SUMMARY TITLE PAGE
    const drawExecutiveSummaryTitle = () => {
      const titleBlockHeight = 165;
      ensureSpace(titleBlockHeight + 40);

      // White card with border
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(1.5);
      doc.rect(margin, y, pageWidth - margin * 2, titleBlockHeight, "FD");

      // Gold accent bar at top
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(margin, y, pageWidth - margin * 2, 6, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      setText(colors.primary);
      doc.text("Executive Summary", margin + 20, y + 28);

      // Shop name and period
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(colors.muted);
      doc.text(`${analyticsData.shopInfo.name}`, margin + 20, y + 48);
      doc.text(`Period: ${periodLabel}`, margin + 20, y + 62);

      // Key metrics in 2x2 grid
      const metrics = [
        {
          label: "Period Sales",
          value: formatCurrency(analyticsData.salesData.periodSales),
        },
        {
          label: "Orders",
          value: String(analyticsData.salesData.periodOrders),
        },
        {
          label: "Avg Order Value",
          value: formatCurrency(analyticsData.salesData.averageSaleValue),
        },
        {
          label: "Growth",
          value: `${
            analyticsData.salesData.salesGrowth >= 0 ? "+" : ""
          }${analyticsData.salesData.salesGrowth.toFixed(1)}%`,
        },
      ];

      const metricsPerRow = 2;
      const metricWidth = (pageWidth - margin * 2 - 24) / metricsPerRow;
      const metricBoxHeight = 29;

      metrics.forEach((metric, index) => {
        const col = index % metricsPerRow;
        const row = Math.floor(index / metricsPerRow);
        const mx = margin + 12 + col * (metricWidth + 6);
        const my = y + 78 + row * (metricBoxHeight + 8);

        // Light background for metric box
        doc.setFillColor(
          colors.background[0],
          colors.background[1],
          colors.background[2]
        );
        doc.rect(mx, my, metricWidth, metricBoxHeight, "F");

        // Metric label
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        setText(colors.accent);
        doc.text(metric.label, mx + 10, my + 9);

        // Metric value
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        setText(colors.primary);
        doc.text(metric.value, mx + 10, my + 21);
      });

      y += titleBlockHeight + 28;
    };

    drawExecutiveSummaryTitle();

    // MAIN CONTENT SECTIONS
    const sectionTitle = (title: string, subtitle?: string) => {
      ensureSpace(50);
      const baseY = y;

      // Gold accent bar
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(margin, baseY, 6, 28, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setText(colors.primary);
      doc.text(title, margin + 16, baseY + 16);

      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setText(colors.muted);
        doc.text(subtitle, margin + 16, baseY + 30);
        y = baseY + 40;
      } else {
        y = baseY + 28;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(colors.primary);
    };

    const drawDivider = () => {
      ensureSpace(16);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;
    };

    const drawStatCards = (
      cards: Array<{ title: string; value: string; hint?: string }>,
      columns = 2
    ) => {
      const gutter = 16;
      const cardWidth =
        (pageWidth - margin * 2 - gutter * (columns - 1)) / columns;
      const cardHeight = 68;
      let cardIndex = 0;

      for (let i = 0; i < cards.length; i++) {
        if (i % columns === 0) {
          ensureSpace(cardHeight + 16);
        }

        const card = cards[i];
        const col = i % columns;
        const x = margin + col * (cardWidth + gutter);
        const yPos = y;

        // Card background
        doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.roundedRect(x, yPos, cardWidth, cardHeight, 6, 6, "FD");

        // Gold top bar
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(x, yPos, cardWidth, 4, "F");

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setText(colors.muted);
        doc.text(card.title, x + 12, yPos + 14);

        // Value
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        setText(colors.primary);
        doc.text(card.value, x + 12, yPos + 36);

        // Hint
        if (card.hint) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          setText(colors.mutedLight);
          doc.text(card.hint, x + 12, yPos + 54);
        }

        if (col === columns - 1 || i === cards.length - 1) {
          y += cardHeight + 16;
        }
        cardIndex += 1;
      }
    };

    const addKeyValueBlock = (
      items: Array<{ label: string; value: string }>
    ) => {
      ensureSpace(items.length * 20 + 8);
      items.forEach((item) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setText(colors.muted);
        doc.text(item.label.toUpperCase(), margin, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        setText(colors.primary);
        doc.text(item.value, margin, y + 14);
        y += 20;
      });
    };

    const addTable = (
      title: string,
      headers: string[],
      rows: Array<Array<string | number>>
    ) => {
      const rowHeight = 20;
      const tableWidth = pageWidth - margin * 2;
      const colWidth = tableWidth / headers.length;

      sectionTitle(title);

      if (!rows.length) {
        ensureSpace(18);
        setText(colors.muted);
        doc.text("No data available", margin, y);
        y += 18;
        return;
      }

      const totalHeight = rowHeight * (rows.length + 1) + 8;
      ensureSpace(totalHeight + 12);
      const startY = y;

      // Table container
      doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.roundedRect(margin, startY, tableWidth, totalHeight, 6, 6, "FD");

      // Header row
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(margin, startY, tableWidth, rowHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      setText(colors.white);
      headers.forEach((header, idx) => {
        doc.text(header, margin + 10 + colWidth * idx, startY + 13);
      });

      // Data rows with zebra striping
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      rows.forEach((row, rowIndex) => {
        const rowY = startY + rowHeight * (rowIndex + 1);
        const isEvenRow = rowIndex % 2 === 0;

        // Zebra stripe
        if (isEvenRow) {
          doc.setFillColor(
            colors.background[0],
            colors.background[1],
            colors.background[2]
          );
          doc.rect(margin, rowY, tableWidth, rowHeight, "F");
        }

        setText(colors.primary);
        row.forEach((value, colIndex) => {
          doc.text(String(value), margin + 10 + colWidth * colIndex, rowY + 13);
        });
      });

      y = startY + totalHeight + 16;
    };

    const addInsightList = (list: string[]) => {
      if (!list.length) return;
      sectionTitle(
        "Key Insights & Recommendations",
        "Auto-generated highlights for faster decision-making"
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setText(colors.primary);

      list.slice(0, 3).forEach((line, index) => {
        const blockWidth = pageWidth - margin * 2 - 36;
        const wrapped = doc.splitTextToSize(line, blockWidth);
        const blockHeight = wrapped.length * 12 + 16;
        ensureSpace(blockHeight + 8);

        // Insight card
        doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.roundedRect(
          margin,
          y,
          pageWidth - margin * 2,
          blockHeight,
          6,
          6,
          "FD"
        );

        // Number badge
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.circle(margin + 12, y + 12, 6, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        setText(colors.white);
        doc.text(String(index + 1), margin + 12, y + 14, { align: "center" });

        // Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setText(colors.primary);
        doc.text(wrapped, margin + 28, y + 12);
        y += blockHeight + 8;
      });
    };

    const {
      shopInfo,
      salesData,
      productStats,
      stockLevels,
      customerMetrics,
      shopRating,
    } = analyticsData;

    // SALES OVERVIEW - Same size as Executive Summary
    const salesBlockHeight = 165;
    ensureSpace(salesBlockHeight + 40);

    // White card with border
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(1.5);
    doc.rect(margin, y, pageWidth - margin * 2, salesBlockHeight, "FD");

    // Gold accent bar at top
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 6, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    setText(colors.primary);
    doc.text("Sales Overview", margin + 20, y + 28);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setText(colors.muted);
    doc.text(
      "Key financial indicators for the selected period",
      margin + 20,
      y + 43
    );

    // Sales metrics in 2x2 grid (same layout as Executive Summary)
    const salesMetrics = [
      {
        label: "Total Sales",
        value: formatCurrency(salesData.totalSales),
      },
      {
        label: "Period Sales",
        value: formatCurrency(salesData.periodSales),
      },
      {
        label: "Total Orders",
        value: String(salesData.totalOrders),
      },
      {
        label: "Avg Order Value",
        value: formatCurrency(salesData.averageSaleValue),
      },
    ];

    const salesMetricsPerRow = 2;
    const salesMetricWidth = (pageWidth - margin * 2 - 24) / salesMetricsPerRow;
    const salesMetricBoxHeight = 29;

    salesMetrics.forEach((metric, index) => {
      const col = index % salesMetricsPerRow;
      const row = Math.floor(index / salesMetricsPerRow);
      const mx = margin + 12 + col * (salesMetricWidth + 6);
      const my = y + 60 + row * (salesMetricBoxHeight + 8);

      // Light background for metric box
      doc.setFillColor(
        colors.background[0],
        colors.background[1],
        colors.background[2]
      );
      doc.rect(mx, my, salesMetricWidth, salesMetricBoxHeight, "F");

      // Metric label
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setText(colors.accent);
      doc.text(metric.label, mx + 10, my + 9);

      // Metric value
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      setText(colors.primary);
      doc.text(metric.value, mx + 10, my + 21);
    });

    y += salesBlockHeight + 28;

    if (salesData.salesTrend.length) {
      const bestDay = salesData.salesTrend.reduce((best, current) =>
        current.sales > best.sales ? current : best
      );
      const busiestOrderDay = salesData.salesTrend.reduce((best, current) =>
        current.orders > best.orders ? current : best
      );
      addKeyValueBlock([
        {
          label: "Best Sales Day",
          value: `${bestDay.date} — ${formatCurrency(bestDay.sales)}`,
        },
        {
          label: "Most Orders Day",
          value: `${busiestOrderDay.date} — ${busiestOrderDay.orders} orders`,
        },
      ]);
    }

    drawDivider();

    sectionTitle("Product Performance", "Top movers and watchlist products");
    addKeyValueBlock([
      { label: "Total Products", value: String(productStats.totalProducts) },
      {
        label: "Top Performer",
        value: productStats.topPerformer
          ? `${productStats.topPerformer.name} (${productStats.topPerformer.sold} sold)`
          : "Not enough data",
      },
    ]);

    addTable(
      "Top Selling Products",
      ["#", "Product", "Units", "Revenue"],
      productStats.topSellingProducts
        .slice(0, 5)
        .map((product, index) => [
          index + 1,
          product.name,
          product.sold,
          formatCurrency(product.revenue ?? 0),
        ])
    );

    addTable(
      "Products to Monitor",
      ["#", "Product", "Units", "Status"],
      productStats.leastSellingProducts
        .slice(0, 5)
        .map((product, index) => [
          index + 1,
          product.name,
          product.sold,
          "Consider promotion",
        ])
    );

    const inventoryRows = [
      ...stockLevels.lowStockItems.map((item) => [
        "⚠ Low Stock",
        item.name,
        item.stock,
      ]),
      ...stockLevels.outOfStockItems.map((item) => [
        "❌ Out of Stock",
        item.name,
        "0",
      ]),
    ];
    addTable("Inventory Alerts", ["Status", "Product", "Qty"], inventoryRows);

    drawDivider();

    sectionTitle(
      "Customer & Reputation",
      "Engagement and satisfaction indicators"
    );
    addKeyValueBlock([
      {
        label: "Total Customers",
        value: String(customerMetrics.totalCustomers),
      },
      {
        label: "New vs Returning",
        value: `${customerMetrics.newCustomers} new / ${customerMetrics.returningCustomers} returning`,
      },
      {
        label: "Retention Rate",
        value: `${customerMetrics.retentionRate.toFixed(1)}%`,
      },
      {
        label: "Shop Rating",
        value: shopRating.totalReviews
          ? `${shopRating.averageRating.toFixed(1)} ★ from ${
              shopRating.totalReviews
            } reviews`
          : "No reviews yet",
      },
    ]);

    drawDivider();
    addInsightList(insights);

    // Final footer message
    ensureSpace(32);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    setText(colors.accent);
    doc.text(
      "Keep crafting better experiences — visit growlokal.ph/academy for growth playbooks.",
      margin,
      Math.min(y + 12, contentBottom)
    );

    const today = new Date().toISOString().split("T")[0];
    const sanitizedPeriod = periodLabel.replace(/\s+/g, "_").toLowerCase();
    doc.save(`analytics_${sanitizedPeriod}_${today}.pdf`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="analytics-page-wrapper">
          <div className="analytics-loading">
            <div className="loading-spinner"></div>
            <p>Loading your analytics...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="analytics-page-wrapper">
          <div className="analytics-error">
            <h2>Unable to load analytics</h2>
            <p>{error}</p>
            <button onClick={fetchAnalytics} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <Navbar />
        <div className="analytics-page-wrapper">
          <div className="analytics-error">
            <h2>No data available</h2>
            <p>Start selling to see your analytics!</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const {
    shopInfo,
    salesData,
    productStats,
    stockLevels,
    customerMetrics,
    shopRating,
  } = analyticsData;

  const getSalesGrowthClass = () => {
    return salesData.salesGrowth >= 0
      ? "sales-tracking-card-value gold"
      : "sales-tracking-card-value negative";
  };

  return (
    <>
      <Navbar />
      <div className="analytics-page-wrapper">
        <div className="dashboard-card">
          <div
            className="dashboard-title-bar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 10px",
              marginBottom: "0",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: "2rem",
                color: "#2e3f36",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Shop Analytics
            </span>
            <div className="analytics-controls">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="period-selector"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchAnalytics}
                className="refresh-button"
                disabled={refreshing}
              >
                <FontAwesomeIcon icon={faSync} spin={refreshing} /> Refresh
              </button>
              <button onClick={exportExcel} className="export-button">
                Export Excel
              </button>
              <button onClick={() => exportPDF()} className="export-button">
                Export PDF
              </button>
            </div>
          </div>

          <div className="analytics-artisan-card">
            <div
              className="artisan-card-top"
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              <img
                src={shopInfo.picture}
                alt={shopInfo.owner}
                className="profile-artisan-avatar"
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  marginLeft: "32px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "18px",
                  }}
                >
                  <span className="shop-name">{shopInfo.name}</span>
                  <span className="artisan-name">{shopInfo.owner}</span>
                </div>
                <div className="shop-rating-container">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="icon-stable shop-rating-star"
                  />
                  <span className="shop-rating-value">
                    {shopRating.averageRating > 0
                      ? shopRating.averageRating.toFixed(1)
                      : "No ratings yet"}
                  </span>
                  {shopRating.totalReviews > 0 && (
                    <span className="shop-rating-reviews">
                      ({shopRating.totalReviews}{" "}
                      {shopRating.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "10px 0 0 0",
                    gap: "5px",
                  }}
                >
                  <span className="analytics-category-type">
                    {shopInfo.category || "Artisan"}
                  </span>
                  <span className="analytics-craft-type">
                    {shopInfo.craftType || "Handmade"}
                  </span>
                </div>
                <div
                  style={{
                    margin: "12px 0 0 0",
                    color: "#888",
                    fontWeight: 400,
                    fontSize: "0.90rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="icon-stable"
                    style={{ color: "#AF7928", fontSize: "1.1rem" }}
                  />
                  {shopInfo.location || "Location not set"}
                </div>
              </div>
            </div>
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "0 0 18px 0",
            }}
          />
        </div>

        <section className="sales-tracking-section">
          <h2 className="sales-tracking-title">
            <FontAwesomeIcon icon={faPesoSign} className="peso-symbol" /> Sales
            Tracking
          </h2>
          <div className="sales-tracking-grid">
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Total Sales</span>
              <span className="sales-tracking-card-value">
                P{salesData.totalSales.toLocaleString()}
              </span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Period Sales</span>
              <span className="sales-tracking-card-value">
                P{salesData.periodSales.toLocaleString()}
              </span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Total Orders</span>
              <span className="sales-tracking-card-value">
                {salesData.totalOrders}
              </span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">
                Average Sale Value
              </span>
              <span className="sales-tracking-card-value">
                P
                {salesData.averageSaleValue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Sales Growth</span>
              <span className={getSalesGrowthClass()}>
                {salesData.salesGrowth >= 0 ? "+" : ""}
                {salesData.salesGrowth.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="sales-tracking-charts">
            <div className="chart-card">
              <h3>Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    name="Sales (P)"
                    stroke="#2e3f36"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#af7928"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Income Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    name="Income (P)"
                    fill="#2e3f36"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="product-management-section">
          <h2 className="product-management-title">
            <FontAwesomeIcon icon={faBoxOpen} className="box-symbol" /> Product
            Management Insights
          </h2>
          <div className="product-management-grid">
            <div className="product-management-card">
              <span className="product-management-card-title">
                Total Products
              </span>
              <span className="product-management-card-value">
                {productStats.totalProducts}
              </span>
              <span className="product-management-card-subtext">
                Active listings
              </span>
            </div>
            <div className="product-management-card">
              <span className="product-management-card-title">
                Top Performer
              </span>
              <span className="product-management-card-value">
                {productStats.topPerformer?.name || "N/A"}
              </span>
              <span className="product-management-card-subtext">
                {productStats.topPerformer
                  ? productStats.topPerformer.sold + " sold"
                  : "No sales yet"}
              </span>
            </div>
            <div className="product-management-card">
              <span className="product-management-card-title">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="warning-symbol"
                />{" "}
                Low Stock Alert
              </span>
              <span className="product-management-card-value low-stock">
                {stockLevels.lowStockCount}
              </span>
              <span className="product-management-card-subtext">
                Products need restock
              </span>
            </div>
          </div>

          <div className="product-insights-row">
            <div className="product-insights-card">
              <h3 className="product-insights-card-title">
                Top-Selling Products
              </h3>
              <table className="top-selling-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {productStats.topSellingProducts.length > 0 ? (
                    productStats.topSellingProducts.map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.sold}</td>
                        <td>P{product.revenue.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        No sales data yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="product-insights-card">
              <h3 className="product-insights-card-title">Needs Attention</h3>
              <div className="needs-attention-section">
                <div className="needs-attention-subtitle">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="alert-icon"
                  />{" "}
                  Low Stock Items
                </div>
                <ul className="low-stock-list">
                  {stockLevels.lowStockItems.length > 0 ? (
                    stockLevels.lowStockItems.map((item, index) => (
                      <li key={index}>
                        {item.name}{" "}
                        <span className="low-stock-badge">
                          {item.stock} left
                        </span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "#45956a" }}>
                      All products well stocked!
                    </li>
                  )}
                </ul>

                {stockLevels.outOfStockItems.length > 0 && (
                  <>
                    <div
                      className="needs-attention-subtitle"
                      style={{ marginTop: "18px", color: "#e74c3c" }}
                    >
                      Out of Stock
                    </div>
                    <ul className="low-stock-list">
                      {stockLevels.outOfStockItems.map((item, index) => (
                        <li key={index} style={{ color: "#e74c3c" }}>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div
                  className="needs-attention-subtitle"
                  style={{ marginTop: "18px" }}
                >
                  Least-Selling Products
                </div>
                <div className="least-selling-bars">
                  {productStats.leastSellingProducts.length > 0 ? (
                    productStats.leastSellingProducts.map((product, index) => {
                      const widthPercent = Math.min(
                        100,
                        (product.sold / 10) * 100
                      );
                      return (
                        <div className="least-selling-bar" key={index}>
                          <span className="least-selling-label">
                            {product.name}
                          </span>
                          <div className="least-selling-bar-bg">
                            <div
                              className="least-selling-bar-fill"
                              style={{ width: widthPercent + "%" }}
                            ></div>
                          </div>
                          <span className="least-selling-count">
                            {product.sold} sales
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: "#888" }}>No data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-insights-section">
          <h2 className="marketing-insights-title">
            <FontAwesomeIcon icon={faUser} className="person-icon" /> Marketing
            Insights
          </h2>
          <div className="marketing-insights-grid">
            <div className="marketing-card">
              <span className="marketing-card-title">Total Customers</span>
              <span className="marketing-card-value">
                {customerMetrics.totalCustomers}
              </span>
              <span className="marketing-card-subtext">All time</span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="add-person-icon"
                />{" "}
                New Customers
              </span>
              <span className="marketing-card-value gold">
                {customerMetrics.newCustomers}
              </span>
              <span className="marketing-card-subtext">This period</span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">Returning Customers</span>
              <span className="marketing-card-value">
                {customerMetrics.returningCustomers}
              </span>
              <span className="marketing-card-subtext">
                {customerMetrics.retentionRate.toFixed(0)}% retention rate
              </span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">
                <FontAwesomeIcon icon={faStar} className="star-icon" /> Average
                Rating
              </span>
              <span className="marketing-card-value">
                {shopRating.averageRating > 0
                  ? shopRating.averageRating.toFixed(1)
                  : "N/A"}
              </span>
              <span className="marketing-card-subtext">
                {shopRating.totalReviews} reviews
              </span>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
