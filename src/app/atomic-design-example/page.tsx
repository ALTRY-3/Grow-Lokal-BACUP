"use client";

import React, { useState } from "react";
import { Button, Input, Label, Badge } from "@/components/atoms";
import { FormField, Card, SearchBar, Pagination } from "@/components/molecules";
import { Form, ProductCard, Header, Footer } from "@/components/organisms";
import { Layout, PageLayout } from "@/components/templates";
import { FormFieldData } from "@/interfaces/atomic.interface";

export default function AtomicDesignExamplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Example form fields
  const formFields: FormFieldData[] = [
    {
      name: "productName",
      type: "text",
      label: "Product Name",
      placeholder: "Enter product name",
      validation: { required: true, minLength: 3, maxLength: 50 },
    },
    {
      name: "price",
      type: "number",
      label: "Price (₱)",
      placeholder: "Enter price",
      validation: { required: true },
    },
    {
      name: "description",
      type: "text",
      label: "Description",
      placeholder: "Enter product description",
      validation: { required: true, minLength: 10 },
    },
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    console.log("Form submitted:", data);
    alert("Form submitted! Check console for data.");
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const example_products = [
    {
      productId: "1",
      name: "Pure Honey",
      price: "₱369",
      image: "/food6.png",
      artist: "Rei Bustamante",
      craftType: "Cooking",
      category: "Food",
      rating: 4.8,
      inStock: true,
    },
    {
      productId: "2",
      name: "Rice Grooved Kuksa Mug",
      price: "₱449",
      image: "/home6.png",
      artist: "Ben Yap",
      craftType: "Woodwork",
      category: "Handicrafts",
      rating: 4.6,
      inStock: true,
    },
    {
      productId: "3",
      name: "Embroidered Shawls",
      price: "₱699",
      image: "/fashion5.png",
      artist: "David Delo Santos",
      craftType: "Embroidery",
      category: "Fashion",
      rating: 4.5,
      inStock: false,
    },
  ];

  return (
    <Layout
      header={{
        title: "Grow Lokal",
        navigation: [
          { label: "Home", href: "/" },
          { label: "Marketplace", href: "/marketplace" },
          { label: "Profile", href: "/profile" },
        ],
      }}
      footer={{
        companyName: "Grow Lokal",
        links: [
          { label: "About Us", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Privacy Policy", href: "#" },
        ],
        socialLinks: [
          { platform: "Facebook", url: "#" },
          { platform: "Instagram", url: "#" },
        ],
        contactInfo: {
          email: "info@growlokal.com",
          phone: "+63 (0) 123 456 7890",
          address: "Olongapo City, Philippines",
        },
      }}
    >
      <PageLayout
        title="Atomic Design System Demo"
        subtitle="Comprehensive showcase of all atomic design components"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Demo" },
        ]}
      >
        {/* ATOMS SECTION */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Atoms
          </h2>

          {/* Button Examples */}
          <Card
            title="Button Component"
            subtitle="Different variants and sizes"
            className="atomic-example-card"
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button label="Primary" variant="primary" />
              <Button label="Secondary" variant="secondary" />
              <Button label="Success" variant="success" />
              <Button label="Danger" variant="danger" />
              <Button label="Disabled" disabled />
              <Button label="Small" size="small" />
              <Button label="Large" size="large" />
            </div>
          </Card>

          {/* Input Examples */}
          <Card
            title="Input Component"
            subtitle="Form input field with validation"
            className="atomic-example-card"
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Input placeholder="Normal input" />
              <Input
                placeholder="Error input"
                error="This field has an error"
              />
              <Input placeholder="Disabled input" disabled />
            </div>
          </Card>

          {/* Label Examples */}
          <Card
            title="Label Component"
            subtitle="Form labels with optional required indicator"
            className="atomic-example-card"
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Label label="Optional Field" />
              <Label label="Required Field" required />
            </div>
          </Card>

          {/* Badge Examples */}
          <Card
            title="Badge Component"
            subtitle="Small labels for categorization"
            className="atomic-example-card"
          >
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Badge label="Primary" variant="primary" />
              <Badge label="Secondary" variant="secondary" />
              <Badge label="Success" variant="success" />
              <Badge label="Warning" variant="warning" />
              <Badge label="Danger" variant="danger" />
              <Badge label="Small" size="small" variant="primary" />
              <Badge label="Large" size="large" variant="success" />
            </div>
          </Card>
        </section>

        {/* MOLECULES SECTION */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Molecules
          </h2>

          {/* FormField Example */}
          <Card title="FormField Component" subtitle="Combined Label + Input">
            <FormField
              label="Email Address"
              required
              inputProps={{
                id: "email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
              }}
              helpText="We'll never share your email."
            />
          </Card>

          {/* Card Examples */}
          <Card
            title="Card Component"
            subtitle="Versatile content container"
            className="atomic-example-card"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              <Card
                title="Card Title"
                subtitle="Card Subtitle"
                image="/food6.png"
                footer={<Button label="Learn More" size="small" />}
              >
                This is a card with an image and footer action.
              </Card>
              <Card title="Simple Card" className="atomic-example-card">
                A simple card without image.
              </Card>
            </div>
          </Card>

          {/* SearchBar Example */}
          <Card title="SearchBar Component" subtitle="Search with input">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </Card>

          {/* Pagination Example */}
          <Card title="Pagination Component" subtitle="Navigation for pages">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </Card>
        </section>

        {/* ORGANISMS SECTION */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "0.5rem",
            }}
          >
            Organisms
          </h2>

          {/* Form Example */}
          <Card title="Form Component" subtitle="Complete form with validation">
            <Form
              title="Add New Product"
              fields={formFields}
              onSubmit={handleFormSubmit}
              submitButtonLabel="Add Product"
            />
          </Card>

          {/* ProductCard Examples */}
          <Card title="ProductCard Component" subtitle="Product display cards">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {example_products.map((product) => (
                <ProductCard
                  key={product.productId}
                  {...product}
                  onViewDetails={() =>
                    alert(`View details for ${product.name}`)
                  }
                  onAddToCart={() => alert(`Added ${product.name} to cart`)}
                  onToggleWishlist={() =>
                    alert(`Toggled ${product.name} in wishlist`)
                  }
                  isInWishlist={false}
                />
              ))}
            </div>
          </Card>
        </section>

        {/* USAGE GUIDE */}
        <Card title="Integration Guide" className="atomic-example-card">
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h3>How to Use These Components</h3>
            <ol style={{ lineHeight: "1.8" }}>
              <li>
                <strong>Import components:</strong>
                <pre
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#e5e7eb",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    overflow: "auto",
                  }}
                >
                  {`import { Button, Badge } from '@/components/atoms';
import { Card, FormField } from '@/components/molecules';
import { Form, ProductCard } from '@/components/organisms';
import { Layout, PageLayout } from '@/components/templates';`}
                </pre>
              </li>
              <li>
                <strong>Use in your components:</strong>
                <pre
                  style={{
                    backgroundColor: "#1f2937",
                    color: "#e5e7eb",
                    padding: "0.5rem",
                    borderRadius: "0.25rem",
                    overflow: "auto",
                  }}
                >
                  {`<Layout header={{...}} footer={{...}}>
  <PageLayout title="My Page">
    <Card title="Example">
      <Button label="Click me" onClick={handleClick} />
    </Card>
  </PageLayout>
</Layout>`}
                </pre>
              </li>
              <li>
                <strong>Check interfaces:</strong> All props are fully typed in{" "}
                <code>@/interfaces/atomic.interface.ts</code>
              </li>
            </ol>
          </div>
        </Card>
      </PageLayout>
    </Layout>
  );
}
