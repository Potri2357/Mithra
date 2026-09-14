import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialIcon from "@/components/MaterialIcon";

export default function ConsumerPage() {
  return (
    <div className="app-page font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Hero Header */}
        <div className="space-y-3 text-center sm:text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/70 border border-rose-200/80 dark:border-rose-900/60 text-xs font-bold text-[#DC2626] dark:text-rose-400">
            <MaterialIcon name="shield" size={15} />
            <span>Citizen Protection & Redressal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Consumer Protection <span className="text-[#DC2626] dark:text-rose-400">&amp; Grievance Center</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Verify ISI mark authenticity, report counterfeit certification stamps or substandard goods,
            and understand your statutory rights under the Bureau of Indian Standards Act 2016.
          </p>
        </div>

        {/* Emergency Action Helpline Bar */}
        <div className="bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-[#DC2626] dark:text-rose-400 flex-shrink-0">
              <MaterialIcon name="call" size={24} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#DC2626] dark:text-rose-300">
                National Consumer Toll-Free Helpline
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono leading-tight">
                1800-11-4000
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Operational Monday to Saturday (9:00 AM – 5:30 PM) for immediate citizen complaints.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:1800114000"
              className="h-10 px-5 rounded-full bg-[#DC2626] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MaterialIcon name="call" size={16} />
              <span>Call Helpline</span>
            </a>
            <a
              href="mailto:consumer@bis.gov.in"
              className="h-10 px-5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MaterialIcon name="mail" size={16} />
              <span>Email Grievance Cell</span>
            </a>
          </div>
        </div>

        {/* Visual Guide: How To Spot a Fake vs Genuine ISI Mark */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Anatomy of a Genuine ISI Mark vs. Counterfeit Imprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Every genuine ISI mark in India must display three mandatory components. Missing any component indicates illegal misuse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Genuine Mark Card */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-900/60 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-[#059669] dark:text-emerald-400 flex items-center gap-1.5">
                  <MaterialIcon name="check_circle" size={18} />
                  <span>GENUINE ISI MARK SPECIMEN</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 border border-emerald-200">
                  Legal &amp; Verified
                </span>
              </div>

              {/* Graphical representation */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center space-y-2 font-mono">
                <div className="text-xs text-[#0052CC] dark:text-blue-400 font-bold">IS 16102 (Part 1)</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white py-1">
                  [ ISI ]
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">CM/L - 9512345678</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Standard Number at Top: </strong>
                    Must cite exact IS number, e.g. IS 16102 for LED bulbs or IS 269 for cement.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Iconic ISI Monogram: </strong>
                    Standard geometric proportion mandated in Bureau guidelines.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">7 or 8-Digit License Number (CM/L): </strong>
                    Unique manufacturer license code traceable in the BIS national registry.
                  </div>
                </div>
              </div>
            </div>

            {/* Counterfeit / Fake Mark Card */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200/90 dark:border-rose-900/60 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-[#DC2626] dark:text-rose-400 flex items-center gap-1.5">
                  <MaterialIcon name="cancel" size={18} />
                  <span>COMMON COUNTERFEIT WARNING SIGNS</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 border border-rose-200">
                  Illegal Misuse
                </span>
              </div>

              {/* Graphical fake representation */}
              <div className="p-5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-center space-y-2 font-mono">
                <div className="text-xs text-rose-500 line-through">Missing IS Number</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white py-1">
                  [ ISI ]
                </div>
                <div className="text-xs text-rose-500 line-through">NO CM/L LICENSE CODE</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">No CM/L License Number: </strong>
                    An ISI mark without a 7 or 8 digit CM/L number below it is always fake and unauthorized.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Missing Standard Code: </strong>
                    Without the IS code at the top, consumers cannot determine what standard was claimed.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-[#DC2626] dark:text-rose-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Distorted Proportions: </strong>
                    Distorted lines, blurry prints, or sticker-overlays over non-certified items.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4-Step Grievance Procedure ── */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              4-Step Grievance Redressal Procedure
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How to report substandard goods or unauthorized use of the Standard Mark under BIS Act 2016:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 01</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gather Evidence</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Photograph the product packaging, batch number, bill/cash memo, and clear view of the stamp.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 02</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">File Online via BIS Care</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Download the official BIS Care mobile app or lodge complaint on the national portal.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 03</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enforcement Raid</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                BIS Vigilance wing conducts investigation, testing, and search &amp; seizure operations.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052CC] dark:text-blue-400 block">Step 04</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Statutory Redressal</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Prosecution under Section 29, license revocation, and consumer compensation.
              </p>
            </div>
          </div>
        </section>

        {/* ── Statutory Rights under BIS Act 2016 ── */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <MaterialIcon name="gavel" size={20} className="text-[#0052CC] dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Statutory Consumer Legal Rights (BIS Act, 2016)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 29: Penalties for Misuse of Standard Mark</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Any person who deceives the public with unauthorized ISI mark or falsely represents compliance faces
                imprisonment up to <strong className="text-slate-900 dark:text-white">2 years</strong>, or a fine not less than <strong className="text-slate-900 dark:text-white">₹2,00,000</strong>, extending
                up to 10 times the value of goods.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Section 30: Compensation to Consumers</span>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Where goods bearing the Standard Mark fail to conform to the relevant standard, the licensee or seller
                is liable to compensate the consumer, replace the product, or refund the purchase amount in full.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <Link
              href="/chat?q=How%20do%20I%20file%20a%20formal%20consumer%20complaint%20against%20a%20substandard%20ISI%20marked%20product"
              className="font-bold text-[#0052CC] dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <MaterialIcon name="auto_awesome" size={15} />
              <span>Ask Saathi to draft my complaint details</span>
            </Link>

            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-semibold transition-colors"
            >
              <span>BIS National Portal Guidelines</span>
              <MaterialIcon name="open_in_new" size={13} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
