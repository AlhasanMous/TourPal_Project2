import { useEffect, useState } from 'react';

import transportService from '../../services/transportService';

import DataTable from '../../components/tables/DataTable';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
} from 'lucide-react';

export default function TransportCompanies() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');

    const fetchCompanies = async () => {
        setLoading(true);
        setError('');

        try {
            const data =
                await transportService.getCompanies();

            setCompanies(data.companies ?? []);
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to load transport companies.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDelete = async (company) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${company.name_en}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await transportService.deleteCompany(
                company.id
            );

            fetchCompanies();
        } catch (err) {
            setError(
                err.response?.data?.message ??
                'Failed to delete company.'
            );
        }
    };

    const filteredCompanies = companies.filter((company) => {
        const value = search.toLowerCase();

        return (
            company.name_ar?.toLowerCase().includes(value) ||
            company.name_en?.toLowerCase().includes(value) ||
            company.phone?.toLowerCase().includes(value)
        );
    });

    const columns = [
        {
            key: 'name',
            label: 'Company',
            render: (company) => (
                <div>
                    <div className="font-medium text-slate-900">
                        {company.name_en}
                    </div>

                    <div className="text-sm text-slate-400">
                        {company.name_ar}
                    </div>
                </div>
            ),
        },

        {
            key: 'phone',
            label: 'Phone',
            render: (company) => (
                <span className="text-slate-600">
                    {company.phone || '-'}
                </span>
            ),
        },

        {
            key: 'routes_count',
            label: 'Routes',
            render: (company) => (
                <span className="font-medium text-slate-700">
                    {company.routes_count ?? 0}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Status',
            render: (company) => (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        company.is_active
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : 'bg-rose-50 text-rose-700 ring-rose-200'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            company.is_active
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                        }`}
                    />

                    {company.is_active
                        ? 'Active'
                        : 'Inactive'}
                </span>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 sm:max-w-md">
                    <Input
                        label="Search"
                        placeholder="Search company..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

               <Link to="/transport/companies/create">
    <Button>
        <Plus className="mr-1.5 inline-block h-4 w-4" />
        Add Company
    </Button>
</Link>
            </div>

            <ErrorMessage message={error} />

            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredCompanies}
                        emptyMessage="No transport companies found."
                        actions={(company) => (
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/transport/companies/${company.id}/edit`}>
    <Button variant="secondary">
        <Pencil className="mr-1.5 h-4 w-4 text-indigo-600" />
        Edit
    </Button>
</Link>

                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDelete(company)
                                    }
                                >
                                    <Trash2 className="mr-1.5 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
