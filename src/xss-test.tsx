// "use client";

// import { useEffect, useState } from "react";

// // Simulasi kerentanan XSS: menggunakan innerHTML dari parameter URL
// export default function XssTestPage() {
//   const [input, setInput] = useState<string>("");

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const name = params.get("name");
//     if (name) {
//       setInput(name); // Tidak ada sanitasi — berpotensi XSS
//     }
//   }, []);

//   return (
//     <div>
//       <h1>Test XSS Page</h1>
//       <p>Di bawah ini adalah output dari parameter URL:</p>
//       <div
//         dangerouslySetInnerHTML={{ __html: input }}
//         style={{ border: "1px solid red", padding: "10px" }}
//       />
//     </div>
//   );
// }
