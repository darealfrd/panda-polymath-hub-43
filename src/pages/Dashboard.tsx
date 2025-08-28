import { useBusinessData } from '@/hooks/useBusinessData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OverviewCard } from '@/components/dashboard/OverviewCard';
import { BusinessCard } from '@/components/dashboard/BusinessCard';

const Dashboard = () => {
  const { businesses, getCurrentEntry, updateCurrentEntry, saveData, getOverallHealth, getBusinessMetrics } = useBusinessData();
  
  const overallHealth = getOverallHealth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DashboardHeader onSave={saveData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <OverviewCard health={overallHealth} />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  currentEntry={getCurrentEntry(business.id)}
                  metrics={getBusinessMetrics(business.id)}
                  onUpdateEntry={(updates) => updateCurrentEntry(business.id, updates)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;