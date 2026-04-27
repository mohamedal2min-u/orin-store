import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "../localized-client-link"
type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className="flex gap-x-1 items-center group"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-kv-accent text-[13px] font-medium tracking-kv-mono hover:text-kv-accent-hover transition-colors duration-200">
        {children}
      </Text>
      <ArrowUpRightMini
        className="group-hover:rotate-45 ease-in-out duration-150 text-kv-accent"
      />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
