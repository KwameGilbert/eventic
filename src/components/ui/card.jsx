import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const cardVariants = cva(
    "rounded-xl border bg-white text-gray-900 shadow-sm",
    {
        variants: {
            variant: {
                default: "border-gray-100",
                outline: "border-gray-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Card = React.forwardRef(({ className, variant, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-4 pb-0", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight text-gray-900", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-500", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-4 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
