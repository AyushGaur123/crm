// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// function Analytics({ stats, sources }) {
//   const statusData = [
//     {
//       name: "New",
//       value: stats.new || 0,
//     },
//     {
//       name: "Contacted",
//       value: stats.contacted || 0,
//     },
//     {
//       name: "Converted",
//       value: stats.converted || 0,
//     },
//   ];

//   const sourceData = (sources || []).map(
//     (item) => ({
//       name: item._id || "Unknown",
//       leads: item.count,
//     })
//   );

//   return (
//     <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

//       {/* Status Chart */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//         <div className="mb-6">
//           <h2 className="font-semibold">
//             Lead Status
//           </h2>

//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Current distribution of your leads
//           </p>
//         </div>

//         <div className="h-[300px]">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 innerRadius={60}
//                 paddingAngle={4}
//               >
//                 <Cell />
//                 <Cell />
//                 <Cell />
//               </Pie>

//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="grid grid-cols-3 gap-3">
//           {statusData.map((item) => (
//             <div
//               key={item.name}
//               className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800"
//             >
//               <p className="text-xs text-slate-500">
//                 {item.name}
//               </p>

//               <p className="mt-1 text-lg font-bold">
//                 {item.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Sources */}
//       <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

//         <div className="mb-6">
//           <h2 className="font-semibold">
//             Lead Sources
//           </h2>

//           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//             Where your leads are coming from
//           </p>
//         </div>

//         <div className="h-[300px]">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <BarChart
//               data={sourceData}
//               margin={{
//                 top: 10,
//                 right: 10,
//                 left: -20,
//                 bottom: 5,
//               }}
//             >
//               <CartesianGrid
//                 strokeDasharray="3 3"
//               />

//               <XAxis
//                 dataKey="name"
//                 tick={{ fontSize: 12 }}
//               />

//               <YAxis
//                 allowDecimals={false}
//                 tick={{ fontSize: 12 }}
//               />

//               <Tooltip />

//               <Bar
//                 dataKey="leads"
//                 radius={[6, 6, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//     </div>
//   );
// }

// export default Analytics;