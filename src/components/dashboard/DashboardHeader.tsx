import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Save, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/dashboard-hero.jpg';

interface DashboardHeaderProps {
  onSave: () => void;
}

export function DashboardHeader({ onSave }: DashboardHeaderProps) {
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    toast({
      title: 'Data Saved Successfully',
      description: 'All business data has been saved and calculations updated.',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-8">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
      
      <Card className="relative bg-transparent border-none shadow-none">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Polymath Dashboard
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Track and optimize your business empire
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleSave} 
              size="lg"
              className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow hover:shadow-lg transition-all duration-normal font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              Save All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}