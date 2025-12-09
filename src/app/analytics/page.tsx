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
  const { salesData, productStats, stockLevels, customerMetrics, shopRating } = data;

  insights.push(
    `During ${periodLabel}, your shop generated ${formatCurrency(
      salesData.periodSales
    )} across ${salesData.periodOrders} orders.`
  );

  if (salesData.salesGrowth >= 0) {
    insights.push(
      `Sales grew by ${salesData.salesGrowth.toFixed(1)}% versus the prior period, indicating healthy momentum.`
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
      `Best-performing day: ${bestDay.date} with ${formatCurrency(bestDay.sales)} in revenue.`
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
      `Customer base: ${customerMetrics.totalCustomers} customers with ${customerMetrics.retentionRate.toFixed(
        1
      )}% retention.`
    );
  }

  if (shopRating.totalReviews) {
    insights.push(
      `Reputation: ${shopRating.averageRating.toFixed(1)}★ average rating from ${shopRating.totalReviews} reviews.`
    );
  }

  return insights;
};

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/seller/analytics?period=" + selectedPeriod, {
        credentials: "include",
      });
      
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
            craftType: "Handmade"
          },
          salesData: {
            totalSales: apiData.salesMetrics?.totalSales || 0,
            periodSales: apiData.salesMetrics?.periodSales || 0,
            totalOrders: apiData.salesMetrics?.totalOrders || 0,
            periodOrders: apiData.salesMetrics?.periodOrders || 0,
            averageSaleValue: apiData.salesMetrics?.averageOrderValue || 0,
            salesGrowth: apiData.salesMetrics?.salesGrowth || 0,
            salesTrend: apiData.salesTrend || []
          },
          productStats: {
            totalProducts: apiData.productMetrics?.totalProducts || 0,
            topPerformer: apiData.productMetrics?.topPerformer || null,
            topSellingProducts: apiData.topSellingProducts || [],
            leastSellingProducts: apiData.leastSellingProducts || []
          },
          stockLevels: {
            lowStockCount: apiData.productMetrics?.lowStockCount || 0,
            outOfStockCount: (apiData.stockLevels || []).filter((s: { status: string }) => s.status === 'Out').length,
            lowStockItems: (apiData.stockLevels || []).filter((s: { status: string }) => s.status === 'Low').map((s: { name: string; stock: number }) => ({ name: s.name, stock: s.stock })),
            outOfStockItems: (apiData.stockLevels || []).filter((s: { status: string }) => s.status === 'Out').map((s: { name: string }) => ({ name: s.name }))
          },
          customerMetrics: {
            totalCustomers: apiData.customerMetrics?.totalCustomers || 0,
            newCustomers: apiData.customerMetrics?.newCustomers || 0,
            returningCustomers: apiData.customerMetrics?.returningCustomers || 0,
            retentionRate: apiData.customerMetrics?.retentionRate || 0
          },
          shopRating: apiData.shopRating || {
            averageRating: 0,
            totalReviews: 0
          }
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

  const exportExcel = () => {
    if (!analyticsData) return;
    
    const workbook = XLSX.utils.book_new();
    const periodLabel =
      periodOptions.find((option) => option.value === selectedPeriod)?.label || selectedPeriod;
    const insights = buildInsights(analyticsData, periodLabel);

    const safeAppendSheet = (rows: Record<string, unknown>[], title: string) => {
      const normalizedRows = rows.length ? rows : [{ Note: "No data available" }];
      const worksheet = XLSX.utils.json_to_sheet(normalizedRows);
      XLSX.utils.book_append_sheet(workbook, worksheet, title);
    };

    const { shopInfo, salesData, productStats, stockLevels, customerMetrics, shopRating } =
      analyticsData;
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
      ? Number((salesData.periodOrders / customerMetrics.totalCustomers).toFixed(2))
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
      "Shop Overview"
    );

    safeAppendSheet(
      [
        {
          Period: periodLabel,
          "Report Generated": new Date().toLocaleString(),
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
      "Sales Summary"
    );

    safeAppendSheet(
      [
        { Metric: "Top Product", Value: productStats.topPerformer?.name || "Not available" },
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
            ? `${shopRating.averageRating.toFixed(1)}★ (${shopRating.totalReviews} reviews)`
            : "No reviews yet",
        },
      ],
      "Performance Snapshot"
    );

    safeAppendSheet(
      salesData.salesTrend.map((entry) => ({
        Date: entry.date,
        "Sales (PHP)": entry.sales,
        Orders: entry.orders,
      })),
      "Sales Trend"
    );

    safeAppendSheet(
      productStats.topSellingProducts.map((product, index) => ({
        Rank: index + 1,
        Product: product.name,
        "Units Sold": product.sold,
        Revenue: product.revenue ?? 0,
      })),
      "Top Products"
    );

    safeAppendSheet(
      productStats.leastSellingProducts.map((product, index) => ({
        Rank: index + 1,
        Product: product.name,
        "Units Sold": product.sold,
      })),
      "Watchlist Products"
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
    safeAppendSheet(inventoryRows, "Inventory Health");

    safeAppendSheet(
      [
        {
          "Total Customers": customerMetrics.totalCustomers,
          "New Customers": customerMetrics.newCustomers,
          "Returning Customers": customerMetrics.returningCustomers,
          "Retention Rate (%)": customerMetrics.retentionRate,
        },
      ],
      "Customer Metrics"
    );

    safeAppendSheet(
      [
        {
          "Average Rating": shopRating.averageRating,
          "Total Reviews": shopRating.totalReviews,
        },
      ],
      "Ratings"
    );

    safeAppendSheet(
      insights.map((text, index) => ({ "#": index + 1, Insight: text })),
      "Insights"
    );

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const today = new Date().toISOString().split("T")[0];
    const sanitizedPeriod = periodLabel.replace(/\s+/g, "_").toLowerCase();
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `analytics_${sanitizedPeriod}_${today}.xlsx`
    );
  };

  const exportPDF = () => {
    if (!analyticsData) return;
    
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    const colors = {
      primary: [46, 63, 54] as const,
      accent: [175, 121, 40] as const,
      accentLight: [255, 196, 107] as const,
      muted: [120, 120, 120] as const,
      border: [229, 225, 220] as const,
      card: [250, 248, 244] as const,
      background: [247, 243, 236] as const,
      page: [252, 250, 245] as const,
    } as const;

    const periodLabel =
      periodOptions.find((option) => option.value === selectedPeriod)?.label || selectedPeriod;
    const insights = buildInsights(analyticsData, periodLabel);

    const headerHeight = 72;
    const navBandHeight = 10;
    const footerHeight = 48;
    const contentTop = margin + headerHeight + navBandHeight;
    const contentBottom = pageHeight - margin - footerHeight;

    const setText = (color: readonly [number, number, number]) =>
      doc.setTextColor(color[0], color[1], color[2]);

    let currentPageNumber = 1;

    const drawPageChrome = () => {
      doc.setFillColor(colors.page[0], colors.page[1], colors.page[2]);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, pageWidth, headerHeight, "F");

      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(pageWidth - 160, 0, 160, headerHeight, "F");
      doc.rect(0, headerHeight, pageWidth, navBandHeight, "F");
      doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
      doc.circle(pageWidth - 60, headerHeight / 2, 18, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Grow Lokal Analytics", margin, headerHeight / 2 - 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Seller Performance Report", margin, headerHeight / 2 + 12);
      doc.text(`Period: ${periodLabel}`, margin, headerHeight / 2 + 26);

      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("growlokal.ph", pageWidth - margin - 80, headerHeight / 2 + 12);

      doc.setFillColor(colors.card[0], colors.card[1], colors.card[2]);
      doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(0, pageHeight - footerHeight, pageWidth, 4, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      setText(colors.muted);
      const footerY = pageHeight - footerHeight / 2 + 2;
      doc.text("Generated via Grow Lokal Analytics", margin, footerY);
      doc.text(`Page ${currentPageNumber}`, pageWidth - margin - 50, footerY);
      setText(colors.primary);
    };

    const addNewPage = () => {
      doc.addPage();
      currentPageNumber += 1;
      drawPageChrome();
      y = contentTop;
    };

    const ensureSpace = (needed = 60) => {
      if (y + needed > contentBottom) {
        addNewPage();
      }
    };

    drawPageChrome();
    y = contentTop;

    const drawHero = () => {
      const heroHeight = 150;
      const heroWidth = pageWidth - margin * 2;
      ensureSpace(heroHeight + 24);

      doc.setFillColor(colors.card[0], colors.card[1], colors.card[2]);
      doc.roundedRect(margin, y, heroWidth, heroHeight, 16, 16, "F");
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.roundedRect(margin, y, 10, heroHeight, 8, 8, "F");
      doc.setFillColor(colors.accentLight[0], colors.accentLight[1], colors.accentLight[2]);
      doc.circle(margin + heroWidth - 60, y + 36, 18, "F");
      doc.circle(margin + heroWidth - 24, y + 92, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      setText(colors.primary);
      doc.text(`${analyticsData.shopInfo.name}`, margin + 28, y + 38);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(colors.muted);
      doc.text(`${analyticsData.shopInfo.category || "Artisan"} • ${
        analyticsData.shopInfo.location || "Location not set"
      }`, margin + 28, y + 56);
      doc.text(`Owner: ${analyticsData.shopInfo.owner || "Not set"}`, margin + 28, y + 72);
      doc.text(`Period: ${periodLabel}`, margin + 28, y + 88);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin + 28, y + 104);

      const heroStats = [
        { label: "Period Sales", value: formatCurrency(analyticsData.salesData.periodSales) },
        { label: "Orders", value: `${analyticsData.salesData.totalOrders}` },
        {
          label: "Sales Growth",
          value: `${analyticsData.salesData.salesGrowth >= 0 ? "+" : ""}${
            analyticsData.salesData.salesGrowth.toFixed(1)
          }%`,
        },
      ];

      const chipWidth = 150;
      const chipHeight = 42;
      heroStats.forEach((chip, index) => {
        const chipX = margin + 28 + index * (chipWidth + 12);
        const chipY = y + heroHeight - chipHeight - 20;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 12, 12, "FD");
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(chipX, chipY, chipWidth, 6, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        setText(colors.muted);
        doc.text(chip.label.toUpperCase(), chipX + 12, chipY + 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        setText(colors.primary);
        doc.text(chip.value, chipX + 12, chipY + 34);
      });

      y += heroHeight + 32;
    };

    const sectionTitle = (title: string, subtitle?: string) => {
      ensureSpace(48);
      const baseY = y;
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(margin, baseY, 44, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      setText(colors.primary);
      doc.text(title, margin, baseY + 18);
      if (subtitle) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setText(colors.muted);
        doc.text(subtitle, margin, baseY + 34);
        y = baseY + 44;
      } else {
        y = baseY + 28;
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(colors.primary);
    };

    const drawDivider = () => {
      ensureSpace(20);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;
    };

    const drawStatCards = (
      cards: Array<{ title: string; value: string; hint?: string }>,
      columns = 2
    ) => {
      const gutter = 18;
      const cardWidth = (pageWidth - margin * 2 - gutter * (columns - 1)) / columns;
      const cardHeight = 74;

      for (let i = 0; i < cards.length; i++) {
        if (i % columns === 0) {
          ensureSpace(cardHeight + 16);
        }

        const card = cards[i];
        const col = i % columns;
        const x = margin + col * (cardWidth + gutter);
        const yPos = y;

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.roundedRect(x, yPos, cardWidth, cardHeight, 12, 12, "FD");
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(x, yPos, cardWidth, 6, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        setText(colors.muted);
        doc.text(card.title, x + 14, yPos + 18);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        setText(colors.primary);
        doc.text(card.value, x + 14, yPos + 44);

        if (card.hint) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          setText(colors.muted);
          doc.text(card.hint, x + 14, yPos + 60);
        }

        if (col === columns - 1 || i === cards.length - 1) {
          y += cardHeight + 16;
        }
      }
    };

    const addKeyValueBlock = (items: Array<{ label: string; value: string }>) => {
      items.forEach((item) => {
        ensureSpace(18);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        setText(colors.muted);
        doc.text(item.label.toUpperCase(), margin, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        setText(colors.primary);
        doc.text(item.value, margin, y + 14);
        y += 28;
      });
    };

    const addTable = (
      title: string,
      headers: string[],
      rows: Array<Array<string | number>>
    ) => {
      const rowHeight = 22;
      const tableWidth = pageWidth - margin * 2;

      sectionTitle(title);
      if (!rows.length) {
        ensureSpace(18);
        setText(colors.muted);
        doc.text("No data available", margin, y);
        y += 18;
        return;
      }

      const totalHeight = rowHeight * (rows.length + 1) + 16;
      ensureSpace(totalHeight + 12);
      const startY = y;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.roundedRect(margin, startY, tableWidth, totalHeight, 12, 12, "FD");

      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(margin, startY, tableWidth, rowHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      headers.forEach((header, idx) => {
        doc.text(header, margin + 14 + (tableWidth / headers.length) * idx, startY + 14);
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      setText(colors.primary);
      rows.forEach((row, rowIndex) => {
        const rowY = startY + rowHeight * (rowIndex + 1);
        const zebra = rowIndex % 2 === 0;
        doc.setFillColor(
          zebra ? colors.card[0] : 255,
          zebra ? colors.card[1] : 255,
          zebra ? colors.card[2] : 255
        );
        doc.rect(margin, rowY, tableWidth, rowHeight, "F");
        row.forEach((value, colIndex) => {
          doc.text(String(value), margin + 14 + (tableWidth / headers.length) * colIndex, rowY + 14);
        });
      });

      y = startY + totalHeight + 18;
    };

    const addInsightList = (list: string[]) => {
      if (!list.length) return;
      sectionTitle(
        "Key Insights & Recommendations",
        "Auto-generated highlights for faster decision-making"
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      setText(colors.primary);
      const blockWidth = pageWidth - margin * 2;
      list.forEach((line, index) => {
        const wrapped = doc.splitTextToSize(line, blockWidth - 48);
        const blockHeight = wrapped.length * 14 + 22;
        ensureSpace(blockHeight + 10);
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.roundedRect(margin, y, blockWidth, blockHeight, 12, 12, "FD");
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.circle(margin + 18, y + 18, 6, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        setText(colors.muted);
        doc.text(`#${index + 1}`, margin + 32, y + 12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        setText(colors.primary);
        doc.text(wrapped, margin + 32, y + 26);
        y += blockHeight + 10;
      });
    };

    const { shopInfo, salesData, productStats, stockLevels, customerMetrics, shopRating } =
      analyticsData;

    drawHero();

    sectionTitle("Sales Overview", "Key financial indicators for the selected period");
    drawStatCards([
      { title: "Total Sales", value: formatCurrency(salesData.totalSales) },
      { title: "Period Sales", value: formatCurrency(salesData.periodSales) },
      { title: "Total Orders", value: `${salesData.totalOrders}` },
      { title: "Average Order Value", value: formatCurrency(salesData.averageSaleValue) },
      {
        title: "Sales Growth",
        value: `${salesData.salesGrowth >= 0 ? "+" : ""}${salesData.salesGrowth.toFixed(1)}%`,
        hint:
          salesData.salesTrend.length > 1
            ? "vs previous period"
            : "Growth calculations need more data",
      },
    ]);

    if (salesData.salesTrend.length) {
      const bestDay = salesData.salesTrend.reduce((best, current) =>
        current.sales > best.sales ? current : best
      );
      const busiestOrderDay = salesData.salesTrend.reduce((best, current) =>
        current.orders > best.orders ? current : best
      );
      addKeyValueBlock([
        { label: "Best Sales Day", value: `${bestDay.date} — ${formatCurrency(bestDay.sales)}` },
        { label: "Most Orders Day", value: `${busiestOrderDay.date} — ${busiestOrderDay.orders} orders` },
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
      productStats.topSellingProducts.slice(0, 5).map((product, index) => [
        index + 1,
        product.name,
        product.sold,
        formatCurrency(product.revenue ?? 0),
      ])
    );

    addTable(
      "Products to Monitor",
      ["#", "Product", "Units", "Note"],
      productStats.leastSellingProducts.slice(0, 5).map((product, index) => [
        index + 1,
        product.name,
        product.sold,
        "Consider promotion",
      ])
    );

    const inventoryRows = [
      ...stockLevels.lowStockItems.map((item) => ["Low Stock", item.name, item.stock]),
      ...stockLevels.outOfStockItems.map((item) => ["Out of Stock", item.name, 0]),
    ];
    addTable("Inventory Alerts", ["Status", "Product", "Qty"], inventoryRows);

    drawDivider();

    sectionTitle("Customer & Reputation", "Engagement and satisfaction indicators");
    addKeyValueBlock([
      { label: "Total Customers", value: String(customerMetrics.totalCustomers) },
      {
        label: "New vs Returning",
        value: `${customerMetrics.newCustomers} new / ${customerMetrics.returningCustomers} returning`,
      },
      { label: "Retention Rate", value: `${customerMetrics.retentionRate.toFixed(1)}%` },
      {
        label: "Shop Rating",
        value: shopRating.totalReviews
          ? `${shopRating.averageRating.toFixed(1)} ★ from ${shopRating.totalReviews} reviews`
          : "No reviews yet",
      },
    ]);

    drawDivider();
    addInsightList(insights);

    drawDivider();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    setText(colors.primary);
    doc.text(
      "Keep crafting better experiences — visit growlokal.ph/academy for playbooks.",
      margin,
      Math.min(y + 14, pageHeight - margin)
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

  const { shopInfo, salesData, productStats, stockLevels, customerMetrics, shopRating } = analyticsData;

  const getSalesGrowthClass = () => {
    return salesData.salesGrowth >= 0 ? "sales-tracking-card-value gold" : "sales-tracking-card-value negative";
  };

  return (
    <>
      <Navbar />
      <div className="analytics-page-wrapper">
        <div className="dashboard-card">
          <div className="dashboard-title-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 10px", marginBottom: "0" }}>
            <span style={{ fontWeight: 600, fontSize: "2rem", color: "#2e3f36", fontFamily: "Poppins, sans-serif" }}>
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
              <button onClick={fetchAnalytics} className="refresh-button" disabled={refreshing}>
                <FontAwesomeIcon icon={faSync} spin={refreshing} /> Refresh
              </button>
              <button onClick={exportExcel} className="export-button">
                Export Excel
              </button>
              <button onClick={exportPDF} className="export-button">
                Export PDF
              </button>
            </div>
          </div>

          <div className="analytics-artisan-card">
            <div className="artisan-card-top" style={{ display: "flex", alignItems: "flex-start" }}>
              <img src={shopInfo.picture} alt={shopInfo.owner} className="profile-artisan-avatar" />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: "32px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "18px" }}>
                  <span className="shop-name">{shopInfo.name}</span>
                  <span className="artisan-name">{shopInfo.owner}</span>
                </div>
                <div className="shop-rating-container">
                  <FontAwesomeIcon icon={faStar} className="icon-stable shop-rating-star" />
                  <span className="shop-rating-value">
                    {shopRating.averageRating > 0 ? shopRating.averageRating.toFixed(1) : "No ratings yet"}
                  </span>
                  {shopRating.totalReviews > 0 && (
                    <span className="shop-rating-reviews">
                      ({shopRating.totalReviews} {shopRating.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", margin: "10px 0 0 0", gap: "5px" }}>
                  <span className="analytics-category-type">{shopInfo.category || "Artisan"}</span>
                  <span className="analytics-craft-type">{shopInfo.craftType || "Handmade"}</span>
                </div>
                <div style={{ margin: "12px 0 0 0", color: "#888", fontWeight: 400, fontSize: "0.90rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="icon-stable" style={{ color: "#AF7928", fontSize: "1.1rem" }} />
                  {shopInfo.location || "Location not set"}
                </div>
              </div>
            </div>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0 0 18px 0" }} />
        </div>

        <section className="sales-tracking-section">
          <h2 className="sales-tracking-title">
            <FontAwesomeIcon icon={faPesoSign} className="peso-symbol" /> Sales Tracking
          </h2>
          <div className="sales-tracking-grid">
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Total Sales</span>
              <span className="sales-tracking-card-value">P{salesData.totalSales.toLocaleString()}</span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Period Sales</span>
              <span className="sales-tracking-card-value">P{salesData.periodSales.toLocaleString()}</span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Total Orders</span>
              <span className="sales-tracking-card-value">{salesData.totalOrders}</span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Average Sale Value</span>
              <span className="sales-tracking-card-value">P{salesData.averageSaleValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="sales-tracking-card">
              <span className="sales-tracking-card-title">Sales Growth</span>
              <span className={getSalesGrowthClass()}>
                {salesData.salesGrowth >= 0 ? "+" : ""}{salesData.salesGrowth.toFixed(1)}%
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
                  <Line yAxisId="left" type="monotone" dataKey="sales" name="Sales (P)" stroke="#2e3f36" strokeWidth={3} dot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#af7928" strokeWidth={2} dot={{ r: 4 }} />
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
                  <Bar dataKey="sales" name="Income (P)" fill="#2e3f36" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="product-management-section">
          <h2 className="product-management-title">
            <FontAwesomeIcon icon={faBoxOpen} className="box-symbol" /> Product Management Insights
          </h2>
          <div className="product-management-grid">
            <div className="product-management-card">
              <span className="product-management-card-title">Total Products</span>
              <span className="product-management-card-value">{productStats.totalProducts}</span>
              <span className="product-management-card-subtext">Active listings</span>
            </div>
            <div className="product-management-card">
              <span className="product-management-card-title">Top Performer</span>
              <span className="product-management-card-value">{productStats.topPerformer?.name || "N/A"}</span>
              <span className="product-management-card-subtext">
                {productStats.topPerformer ? productStats.topPerformer.sold + " sold" : "No sales yet"}
              </span>
            </div>
            <div className="product-management-card">
              <span className="product-management-card-title">
                <FontAwesomeIcon icon={faExclamationTriangle} className="warning-symbol" /> Low Stock Alert
              </span>
              <span className="product-management-card-value low-stock">{stockLevels.lowStockCount}</span>
              <span className="product-management-card-subtext">Products need restock</span>
            </div>
          </div>

          <div className="product-insights-row">
            <div className="product-insights-card">
              <h3 className="product-insights-card-title">Top-Selling Products</h3>
              <table className="top-selling-table">
                <thead>
                  <tr><th>Product</th><th>Sales</th><th>Revenue</th></tr>
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
                    <tr><td colSpan={3} style={{ textAlign: "center" }}>No sales data yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="product-insights-card">
              <h3 className="product-insights-card-title">Needs Attention</h3>
              <div className="needs-attention-section">
                <div className="needs-attention-subtitle">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="alert-icon" /> Low Stock Items
                </div>
                <ul className="low-stock-list">
                  {stockLevels.lowStockItems.length > 0 ? (
                    stockLevels.lowStockItems.map((item, index) => (
                      <li key={index}>
                        {item.name} <span className="low-stock-badge">{item.stock} left</span>
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "#45956a" }}>All products well stocked!</li>
                  )}
                </ul>

                {stockLevels.outOfStockItems.length > 0 && (
                  <>
                    <div className="needs-attention-subtitle" style={{ marginTop: "18px", color: "#e74c3c" }}>
                      Out of Stock
                    </div>
                    <ul className="low-stock-list">
                      {stockLevels.outOfStockItems.map((item, index) => (
                        <li key={index} style={{ color: "#e74c3c" }}>{item.name}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="needs-attention-subtitle" style={{ marginTop: "18px" }}>Least-Selling Products</div>
                <div className="least-selling-bars">
                  {productStats.leastSellingProducts.length > 0 ? (
                    productStats.leastSellingProducts.map((product, index) => {
                      const widthPercent = Math.min(100, (product.sold / 10) * 100);
                      return (
                        <div className="least-selling-bar" key={index}>
                          <span className="least-selling-label">{product.name}</span>
                          <div className="least-selling-bar-bg">
                            <div className="least-selling-bar-fill" style={{ width: widthPercent + "%" }}></div>
                          </div>
                          <span className="least-selling-count">{product.sold} sales</span>
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
            <FontAwesomeIcon icon={faUser} className="person-icon" /> Marketing Insights
          </h2>
          <div className="marketing-insights-grid">
            <div className="marketing-card">
              <span className="marketing-card-title">Total Customers</span>
              <span className="marketing-card-value">{customerMetrics.totalCustomers}</span>
              <span className="marketing-card-subtext">All time</span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">
                <FontAwesomeIcon icon={faUserPlus} className="add-person-icon" /> New Customers
              </span>
              <span className="marketing-card-value gold">{customerMetrics.newCustomers}</span>
              <span className="marketing-card-subtext">This period</span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">Returning Customers</span>
              <span className="marketing-card-value">{customerMetrics.returningCustomers}</span>
              <span className="marketing-card-subtext">{customerMetrics.retentionRate.toFixed(0)}% retention rate</span>
            </div>
            <div className="marketing-card">
              <span className="marketing-card-title">
                <FontAwesomeIcon icon={faStar} className="star-icon" /> Average Rating
              </span>
              <span className="marketing-card-value">{shopRating.averageRating > 0 ? shopRating.averageRating.toFixed(1) : "N/A"}</span>
              <span className="marketing-card-subtext">{shopRating.totalReviews} reviews</span>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
