import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function PageHeader({ title, subtitle, actionLabel, actionTo, onAction }) {
    return (
        <div className="mb-6 flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
            </div>

            {actionLabel && (
                <>
                    {actionTo ? (
                        <Link to={actionTo}>
                            <Button>{actionLabel}</Button>
                        </Link>
                    ) : (
                        <Button onClick={onAction}>{actionLabel}</Button>
                    )}
                </>
            )}
        </div>
    );
}
