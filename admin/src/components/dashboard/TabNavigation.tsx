/**
 * Tab Navigation Component
 * Displays tabs for different views
 */

import { TabType } from '@/lib/constants/dashboard.constants';

interface Tab {
  id: TabType;
  label: string;
  count: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-6 py-4 font-semibold text-sm transition-colors relative ${
            activeTab === tab.id
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{tab.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          </div>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>
          )}
        </button>
      ))}
    </div>
  );
}
