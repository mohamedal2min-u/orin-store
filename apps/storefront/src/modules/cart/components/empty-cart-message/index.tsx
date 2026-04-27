import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <h1 className="text-[2rem] font-light tracking-kv-wide text-kv-primary">
        Varukorg
      </h1>
      <p className="text-[15px] text-kv-secondary mt-4 mb-6 max-w-[32rem]">
        Din varukorg är tom. Utforska våra klockor och hitta din favorit.
      </p>
      <LocalizedClientLink
        href="/store"
        className="text-[13px] tracking-[0.04em] text-kv-secondary hover:text-kv-primary underline underline-offset-4 transition-colors duration-200"
      >
        Utforska klockor
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
