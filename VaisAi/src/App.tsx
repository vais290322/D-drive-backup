
import { CiMenuFries } from "react-icons/ci";

const App = () => {
    return (
    <section className="relative min-h-screen bg-slate-200 overflow-hidden">
      {/* Blur circles */}
      <div className="absolute top-[988px] left-[419px] w-[815px] h-[273px] bg-slate-200 blur-[75px]" />
      
      {/* Header */}
      <header className="backdrop-blur-[100px] bg-white/30 rounded-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.2)] mx-[67px] my-10 px-20 py-4 flex justify-between items-center">
        <h1 className="text-purple-900 text-[32px] font-inter">UXnetic.Ai</h1>
        <CiMenuFries className="w-[67px] h-[31px]" />
      </header>

      {/* Large outline text */}
      <h2 className="absolute top-[237px] left-[242px] text-[250px] font-bold font-space-grotesk text-transparent [-webkit-text-stroke:2px_white]">
        FUTURISTIC
      </h2>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-between px-[150px] pt-[500px]">
        <div>
          <h3 className="text-[128px] leading-[92px] font-space-grotesk text-black">
            UX<br/>netic.Ai
          </h3>
        </div>

        {/* Robot image with gradient circle */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-full blur-xl" />
          <img src="/robot.png" alt="AI Robot" className="relative w-[380px] h-[642px] object-cover" />
        </div>

        <div>
          <p className="text-purple-700 text-[40px] font-space-grotesk mb-6">
            Search, analyze, create<br/>AI does it smarter.
          </p>
          <button className="bg-gradient-to-r from-purple-800 to-fuchsia-600 text-white px-6 py-3 rounded-lg text-2xl font-medium">
            Try Now →
          </button>
        </div>
      </div>
    </section>
  );
}

export default App