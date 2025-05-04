
import Layout from "@/components/Layout";
import ReportInventory from "@/components/ReportInventory";
import Reports from "@/components/Reports";
import React from "react";
import { useParams } from "react-router-dom";

const ReportsPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const reportType = type === "inventory" ? "inventory" : "purchases";
    return (
        <Layout>
            {
                reportType === "purchases" ? (
                    <Reports />
                ) : (
                    <ReportInventory />
                )
            }
        </Layout>
    );
};

export default ReportsPage;
