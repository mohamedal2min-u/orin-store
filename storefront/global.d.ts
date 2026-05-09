import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "klarna-placement": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "data-key"?: string;
        "data-locale"?: string;
        "data-purchase-amount"?: string | number;
        "data-theme"?: string;
      };
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "klarna-placement": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "data-key"?: string;
        "data-locale"?: string;
        "data-purchase-amount"?: string | number;
        "data-theme"?: string;
      };
    }
  }
}
