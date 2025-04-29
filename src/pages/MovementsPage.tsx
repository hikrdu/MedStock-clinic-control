
import Layout from "@/components/Layout";
import StockMovements from "@/components/StockMovements";
import React from "react";

const MovementsPage: React.FC = () => {
    return (
        <Layout>
            <StockMovements />
        </Layout>
    );
};

export default MovementsPage;
