// export default function Layout({ topNav, children }) {
//   return (
//     <div className="flex">
//       {topNav}
//       <main className="flex-1 min-h-screen">
//         <div className="max-w-6xl mx-auto p-4">{children}</div>
//       </main>
//     </div>
//   )
// }
export default function Layout({ topNav, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      {topNav}

      {/* Main Content */}
      <main className="flex-1 px-6 py-4">
        {children}
      </main>
    </div>
  );
}
