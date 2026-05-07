export default function SupplierInquirySection() {
  return (
    <section className="overflow-hidden rounded-md border border-[#e3e6eb] transition-shadow duration-200 hover:shadow-sm">
      <div
        className="grid min-h-[320px] grid-cols-1 gap-4 bg-[url('/images/banners/supplier-quote-banner.png')] bg-cover bg-center p-4 sm:p-6 lg:grid-cols-[1.1fr_420px] lg:items-center lg:p-8"
      >
        <div className="rounded-md bg-gradient-to-r from-[#127fff]/85 to-[#127fff]/30 p-6 text-white backdrop-blur-[1px] transition-all duration-200 hover:-translate-y-[1px] hover:brightness-105 sm:p-8">
          <h3 className="max-w-[560px] text-[30px] font-semibold leading-tight sm:text-[46px]">
            An easy way to send requests to all suppliers
          </h3>
          <p className="mt-4 max-w-[560px] text-[16px] text-white/90 sm:text-[18px]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <form className="rounded-md border border-[#e3e6eb] bg-white p-4 shadow-lg transition-all duration-200 hover:shadow-xl sm:p-6">
          <h4 className="mb-4 text-[22px] font-semibold text-[#1c1c1c] sm:text-[26px]">Send quote to suppliers</h4>

          <label htmlFor="item-name" className="sr-only">
            Item name
          </label>
          <input
            id="item-name"
            type="text"
            placeholder="What item you need?"
            className="mb-3 h-11 w-full rounded-md border border-[#d9dfe7] px-3 text-[16px] text-[#1c1c1c] placeholder:text-[#8b96a5] transition-colors hover:border-[#a9c7f1] focus:outline-none focus:ring-2 focus:ring-[#127fff]/25"
          />

          <label htmlFor="item-details" className="sr-only">
            Item details
          </label>
          <textarea
            id="item-details"
            placeholder="Type more details"
            rows={4}
            className="mb-3 w-full resize-none rounded-md border border-[#d9dfe7] px-3 py-2 text-[16px] text-[#1c1c1c] placeholder:text-[#8b96a5] transition-colors hover:border-[#a9c7f1] focus:outline-none focus:ring-2 focus:ring-[#127fff]/25"
          />

          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_96px]">
            <label htmlFor="quantity" className="sr-only">
              Quantity
            </label>
            <input
              id="quantity"
              type="text"
              placeholder="Quantity"
              className="h-11 rounded-md border border-[#d9dfe7] px-3 text-[16px] text-[#1c1c1c] placeholder:text-[#8b96a5] transition-colors hover:border-[#a9c7f1] focus:outline-none focus:ring-2 focus:ring-[#127fff]/25"
            />

            <label htmlFor="unit" className="sr-only">
              Unit
            </label>
            <select
              id="unit"
              className="h-11 rounded-md border border-[#d9dfe7] px-3 text-[16px] text-[#505050] transition-colors hover:border-[#a9c7f1] focus:outline-none focus:ring-2 focus:ring-[#127fff]/25"
            >
              <option>Pcs</option>
              <option>Kg</option>
              <option>Set</option>
            </select>
          </div>

          <button
            type="button"
            className="rounded-md bg-gradient-to-b from-[#2f8ef6] to-[#0d6efd] px-5 py-2 text-[20px] font-medium text-white transition-all duration-150 hover:-translate-y-[1px] hover:from-[#2a86ee] hover:to-[#0b63d8] hover:shadow-sm"
          >
            Send inquiry
          </button>
        </form>
      </div>
    </section>
  );
}
