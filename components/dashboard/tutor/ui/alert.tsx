import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-[300px] h-fit rounded-lg border p-4 flex flex-col justify-center top-5 z-80 transition-opacity duration-1000 ease-out",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-b-[#1BC2C2]",
        danger: "border-b-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive border-b-4 border-b-[#c21b1b]",
        warning: "border-b-warning/50 text-warning dark:border-warning [&>svg]:text-warning border-b-4 border-b-[#FFC107]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & { onClose?: () => void }
>(({ className, variant, onClose, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 1000); // Wait for the transition to complete
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className, !isVisible && "opacity-0")}
      {...props}
    />
  );
});
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  )
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  )
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }











