import siteLogo from "../../assets/codelingo.png";
export default function Footer() {
  return (
    <footer className="border-t-2 border-line px-6 py-9 mt-5">
      <div className="max-w-[1180px] mx-auto flex justify-between items-center flex-wrap gap-3 text-ink-soft text-sm">
        <div className="flex items-center font-display font-extrabold text-base text-indigo-dark">
          <img className="w-10" src={siteLogo} alt="" />
          CodeLingo
        </div>
        <span>
          A prototype e-learning site. Accounts &amp; chat are stored locally on
          this device.
        </span>
      </div>
    </footer>
  );
}
