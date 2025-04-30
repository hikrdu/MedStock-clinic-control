import Layout from "@/components/Layout";
import SectorList from "@/components/SectorList";
import UnityList from "@/components/UnityList";
const UtilsPage: React.FC = () => {
    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-clinic-primary">
                    Utilitários
                </h1>
            </div>
            <SectorList />
            <div className="mb-6" />


            <UnityList />
        </Layout>
    );
}

export default UtilsPage;
