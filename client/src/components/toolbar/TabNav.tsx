import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TabType } from '@shared/schema';

interface TabNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabType)}>
      <TabsList data-testid="tabs-status">
        <TabsTrigger value="new" data-testid="tab-new">
          New pairs
        </TabsTrigger>
        <TabsTrigger value="final" data-testid="tab-final">
          Final Stretch
        </TabsTrigger>
        <TabsTrigger value="migrated" data-testid="tab-migrated">
          Migrated
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
