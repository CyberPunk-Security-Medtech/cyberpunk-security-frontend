// "use client";

// import { useState } from "react";

// interface Props {
//   onNext: (data: any) => void;
//   defaultValues?: {
//     name?: string;
//     address?: string;
//     type?: string;
//   };
// }

// export default function HospitalInfoStep({ onNext, defaultValues }: Props) {
//   const [name, setName] = useState(defaultValues?.name || "");
//   const [address, setAddress] = useState(defaultValues?.address || "");
//   const [type, setType] = useState(defaultValues?.type || "");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name || !address || !type) {
//       alert("Please fill all fields");
//       return;
//     }
//     onNext({ name, address, type });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-5">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Hospital Information
//         </h2>
//         <p className="text-gray-500 text-sm mt-1">Hospital setup</p>
//       </div>

//       {/* Fields */}
//       <div>
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Hospital Name
//         </label>
//         <input
//           type="text"
//           placeholder="Enter hospital name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Hospital Address
//         </label>
//         <input
//           type="text"
//           placeholder="Enter hospital address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div>
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           Type of Hospital
//         </label>
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Select hospital type</option>
//           <option value="General">General</option>
//           <option value="Specialist">Specialist</option>
//           <option value="Clinic">Clinic</option>
//           <option value="Teaching">Teaching</option>
//         </select>
//       </div>

//       <button
//         type="submit"
//         className="w-full  bg-[#1A2380]  text-white py-3 rounded-xl font-medium"
//       >
//         Continue
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";

type Props = {
  onNext: (data: { name: string; image_url?: string }) => void;
  defaultValues?: { name?: string; image_url?: string };
};

export default function HospitalInfoStep({ onNext, defaultValues }: Props) {
  const [name, setName] = useState(defaultValues?.name || "");
  const [preview, setPreview] = useState(defaultValues?.image_url || null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const base64 = await convertFileToBase64(selectedFile);
    setPreview(base64);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Organization name is required");

    setLoading(true);
    try {
      const image_url = file ? await convertFileToBase64(file) : preview || undefined;
      onNext({ name, image_url });
    } catch (err) {
      console.error(err);
      alert("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Organization Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
          placeholder="Enter organization name"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Organization Logo (Optional)</label>
        <div className="flex items-center gap-4">
          {preview ? (
            <img src={preview} className="w-20 h-20 object-cover rounded-xl border" />
          ) : (
            <div className="w-20 h-20 border rounded-xl flex items-center justify-center text-gray-400 text-xs">
              No Logo
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100">
            {loading ? "Processing..." : "Upload Logo"}
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-[#1A2380] text-white hover:opacity-90 transition disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </form>
  );
}