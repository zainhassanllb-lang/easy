
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
    const faqs = [
        {
            question: "How do I book a professional?",
            answer: "Simply search for the service you need, browse through verified worker profiles, and click 'Contact' or 'Book Now' to get in touch directly.",
        },
        {
            question: "Are the workers verified?",
            answer: "Yes, we verify the identity (CNIC) of all workers on our platform. We also encourage users to leave reviews to help maintain high service standards.",
        },
        {
            question: "Is there a fee to use the platform?",
            answer: "Browsing and contacting workers is free for customers. We charge a nominal subscription fee to workers to be listed on the platform.",
        },
        {
            question: "What if I am not satisfied with the service?",
            answer: "We recommend discussing the issue with the worker first. You can also leave a review reflecting your experience. For serious issues, please contact our support team.",
        },
        {
            question: "Can I register as a worker?",
            answer: "Absolutely! If you offer a service, click on 'Register' and select 'Join as Worker' to create your profile and start getting clients.",
        },
    ]

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">
                        Have questions? We're here to help.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
