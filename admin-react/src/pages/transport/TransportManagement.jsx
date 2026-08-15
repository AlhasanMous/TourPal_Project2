import { useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';

import TransportCompanies from './TransportCompanies';
import TransportRoutes from './TransportRoutes';

import {
    Building2,
    Route as RouteIcon,
    Bus,
} from 'lucide-react';

// purely visual — tab metadata (label/description/icon), not app state
const TABS = [
    {
        key: 'companies',
        label: 'Transport Companies',
        description: 'Manage registered intercity transport providers.',
        icon: Building2,
        iconClass: 'text-indigo-600',
        activeClass: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200',
    },
    {
        key: 'routes',
        label: 'Transport Routes',
        description: 'Manage routes and connections between cities.',
        icon: RouteIcon,
        iconClass: 'text-teal-600',
        activeClass: 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200',
    },
];

export default function TransportManagement() {
    const [activeTab, setActiveTab] = useState('companies');

    const currentTab = TABS.find((tab) => tab.key === activeTab);

    return (
        <div>
            <PageHeader
                title={(
                    <>
                        <Bus className="mr-3 inline-block h-7 w-7 align-middle text-indigo-600" />
                        Transport Management
                    </>
                )}
                subtitle="Manage transport companies and routes."
            />

            <div className="mb-4 rounded-2xl border border-slate-200/70 bg-white p-2 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;

                        return (
                            <Button
                                key={tab.key}
                                variant={isActive ? 'primary' : 'secondary'}
                                onClick={() => setActiveTab(tab.key)}
                                className="flex-1"
                            >
                                <span
                                    className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md ${
                                        isActive ? 'bg-white/20' : ''
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {currentTab && (
                <p className="mb-6 flex items-center gap-1.5 px-1 text-sm text-slate-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeTab === 'companies' ? 'bg-indigo-500' : 'bg-teal-500'}`} />
                    {currentTab.description}
                </p>
            )}

            {activeTab === 'companies' ? (
                <TransportCompanies />
            ) : (
                <TransportRoutes />
            )}
        </div>
    );
}
