import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { skill: "React", match: 85 },
  { skill: "Node.js", match: 70 },
  { skill: "MongoDB", match: 65 },
  { skill: "JavaScript", match: 80 },
];

export default function SkillMatchChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="skill" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="match" fill="#1976d2" />
      </BarChart>
    </ResponsiveContainer>
  );
}
