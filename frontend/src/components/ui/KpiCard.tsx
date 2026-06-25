export function KpiCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex-1 rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-kyn-dark">
        {value}
        {unit ? <span className="ml-1 text-base font-medium text-gray-500">{unit}</span> : null}
      </p>
    </div>
  );
}
