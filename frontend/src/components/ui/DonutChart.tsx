import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "../../constants/colors";
import { formatCurrency } from "../../utils/format";

// Rendu pur — reçoit les montants en props. Bénéfice négatif : coûts en rouge plein.
export function DonutChart({
  margeBrute,
  couts,
  benefice,
  currency = "€",
}: {
  margeBrute: number;
  couts: number;
  benefice: number;
  currency?: string;
}) {
  const negative = benefice < 0;
  const data = negative
    ? [{ name: "Coûts", value: couts, color: CHART_COLORS.danger }]
    : [
        { name: "Coûts", value: couts, color: CHART_COLORS.primary },
        { name: "Bénéfice", value: benefice, color: CHART_COLORS.accent },
      ];

  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="90%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={1}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-syne text-2xl font-bold ${negative ? "text-danger" : "text-primary"}`}
        >
          {formatCurrency(benefice, currency)}
        </span>
        <span className="text-xs uppercase tracking-wide text-primary/60">bénéfice</span>
        <span className="mt-1 text-xs text-primary/60">
          marge {formatCurrency(margeBrute, currency)}
        </span>
      </div>
    </div>
  );
}
