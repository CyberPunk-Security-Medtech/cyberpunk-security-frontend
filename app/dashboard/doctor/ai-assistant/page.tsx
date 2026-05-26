import { Paperclip, Send } from "lucide-react";
import Image from "next/image";

const chats = [
  {
    title: "Health Tips for Dysentry",
    text: "Lorem ipsum dolor sit amet consectetur. Ullamcorper pharetra iaculis elit. Condimentum tincidunt et aenean iaculis aliquet."
  },
  {
    title: "Prescription for S.Typhi",
    text: "Lorem ipsum dolor sit amet consectetur. Ullamcorper pharetra iaculis elit. Condimentum tincidunt et aenean iaculis aliquet."
  },
  {
    title: "How to Boost T-helper cells",
    text: "Lorem ipsum dolor sit amet consectetur. Ullamcorper pharetra iaculis elit. Condimentum tincidunt et aenean iaculis aliquet."
  }
];

export default function AiAssistantPage() {
  return (
    <main className="flex-1 flex flex-col bg-[#f8fcfb] min-h-screen">
      {/* Chat History */}
      <section className="px-8 pt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Chat history
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chats.map((chat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="border-l-4 border-teal-500 pl-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {chat.title}
                </h3>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {chat.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Prompt */}
      <section className="mt-16 px-6">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2">
            <Image src="/auth_logo.svg" alt="Logo" width={70} height={70} />
          </div>

          <h3 className="text-lg font-medium text-gray-800">
            How can I help you today, Dr Alex
          </h3>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-full shadow-lg px-4 py-3 flex items-center gap-3">
          <Paperclip className="text-gray-400 w-5 h-5 cursor-pointer" />

          <input
            type="text"
            placeholder="How to create a routine health habit for a retro-viral patient"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
          />

          <Send className="text-teal-600 w-5 h-5 cursor-pointer" />
        </div>
      </section>
    </main>
  );
}
