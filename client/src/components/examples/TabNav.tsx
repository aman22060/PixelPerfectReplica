import TabNav from '../toolbar/TabNav';
import { useState } from 'react';
import type { TabType } from '@shared/schema';

export default function TabNavExample() {
  const [activeTab, setActiveTab] = useState<TabType>('new');

  return (
    <div className="p-4">
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <p className="mt-2 text-sm text-muted-foreground">Active tab: {activeTab}</p>
    </div>
  );
}
