// // src/components/ui/PageBreadcrumb.tsx

// import { Link, useLocation } from "react-router-dom";
// import React from "react";

// const PageBreadcrumb: React.FC = () => {
//   const location = useLocation();

//   // Split pathname into segments: "/gallery-category/edit/3" → ["gallery-category", "edit", "3"]
//   const pathParts = location.pathname.split("/").filter(Boolean);

//   // Build a breadcrumb trail
//   const breadcrumbs = pathParts.map((part, index) => {
//     const path = "/" + pathParts.slice(0, index + 1).join("/");
//     const isLast = index === pathParts.length - 1;

//     // Convert kebab-case or slugs into readable titles
//     const label = part
//       .replace(/-/g, " ")
//       .replace(/\b\w/g, (char) => char.toUpperCase());

//     return { label, path, isLast };
//   });

//   // Optional: Define a readable top title (usually the last breadcrumb)
//   const pageTitle =
//     breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Home";

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
//       {/* Page Title */}
//       {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
//         {pageTitle}
//       </h2> */}

//       {/* Breadcrumb Navigation */}
//       <nav>
//         <ol className="flex items-center gap-1.5">
//           <li>
//             <Link
//               className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
//               to="/"
//             >
//               Home
//               <svg
//                 className="stroke-current"
//                 width="17"
//                 height="16"
//                 viewBox="0 0 17 16"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
//                   stroke=""
//                   strokeWidth="1.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </Link>
//           </li>

//           {breadcrumbs.map((crumb) => (
//             <li key={crumb.path}>
//               {!crumb.isLast ? (
//                 <Link
//                   to={crumb.path}
//                   className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400"
//                 >
//                   {crumb.label}
//                 </Link>
//               ) : (
//                 <span className="text-sm text-gray-800 dark:text-white/90">
//                   {crumb.label}
//                 </span>
//               )}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default PageBreadcrumb;

// import { Link, useLocation } from "react-router-dom";
// import React from "react";

// const labelMap: Record<string, string> = {
//   "gallery-category": "Gallery Categories",
//   "category": "Categories",
//   "retreat": "Retreats",
//   "new": "New",
//   "edit": "Edit",
// };

// const PageBreadcrumb: React.FC = () => {
//   const location = useLocation();
//   const pathParts = location.pathname.split("/").filter(Boolean);

//   const breadcrumbs = pathParts.map((part, index) => {
//     const path = "/" + pathParts.slice(0, index + 1).join("/");
//     const isLast = index === pathParts.length - 1;

//     const label =
//       labelMap[part] ||
//       part.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

//     return { label, path, isLast };
//   });

//   return (
//     <div className="flex flex-wrap items-center gap-2 mb-6">
//       <nav>
//         <ol className="flex items-center gap-1.5 text-sm">
//           {/* Home link */}
//           <li className="flex items-center gap-1.5">
//             <Link
//               className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
//               to="/"
//             >
//               Home
//             </Link>
//             {breadcrumbs.length > 0 && (
//               <svg
//                 className="w-4 h-4 text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             )}
//           </li>

//           {/* Dynamic breadcrumbs */}
//           {breadcrumbs.map((crumb, index) => (
//             <li key={crumb.path} className="flex items-center gap-1.5">
//               {!crumb.isLast ? (
//                 <>
//                   <Link
//                     to={crumb.path}
//                     className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
//                   >
//                     {crumb.label}
//                   </Link>
//                   <svg
//                     className="w-4 h-4 text-gray-400"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </>
//               ) : (
//                 <span className="text-gray-800 dark:text-white/90">
//                   {crumb.label}
//                 </span>
//               )}
//             </li>
//           ))}
//         </ol>
//       </nav>
//     </div>
//   );
// };

// export default PageBreadcrumb;
import { Link, useLocation } from "react-router-dom";
import React from "react";

const labelMap: Record<string, string> = {
  "gallery-category": "Gallery Categories",
  "category": "Categories",
  "retreat": "Retreats",
  "new": "New",
  "edit": "Edit",
};

const PageBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  
  // Limit breadcrumb segments to max 3 (excluding the last if more than 3 parts)
  let visibleParts = pathParts;
  if (pathParts.length > 2) {
    // Take first 3 parts and exclude last one if total parts > 3
    visibleParts = pathParts.slice(0, 2);
  }

  const breadcrumbs = visibleParts.map((part, index) => {
    const path = "/" + pathParts.slice(0, index + 1).join("/");
    const isLast = index === visibleParts.length - 1;

    const label =
      labelMap[part] ||
      part.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

    return { label, path, isLast };
  });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <nav>
        <ol className="flex items-center gap-1.5 text-sm">
          {/* Home link */}
          <li className="flex items-center gap-1.5">
            <Link
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
              to="/"
            >
              Home
            </Link>
            {breadcrumbs.length > 0 && (
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </li>

          {/* Dynamic breadcrumbs */}
          {breadcrumbs.map((crumb) => (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {!crumb.isLast ? (
                <>
                  <Link
                    to={crumb.path}
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
                  >
                    {crumb.label}
                  </Link>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <span className="text-gray-800 dark:text-white/90">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
