import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="min-h-screen pt-20 lg:pt-24">
      <div className="container mx-auto px-4 py-16">
        
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-foreground">
            ✦ Legal
          </p>
          <h1 className="mb-6 font-display text-3xl font-bold tracking-wider lg:text-5xl">
            TERMS & <span className="text-glow-purple">CONDITIONS</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Please read our terms carefully before placing an order with AN1ME PARADISE.
            These policies ensure transparency and a smooth experience for all our customers.
          </p>
        </motion.div>

        {/* Terms Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 mx-auto max-w-3xl rounded-2xl border border-border/50 bg-card p-8 lg:p-10"
        >
          <h2 className="mb-4 font-display text-xl font-bold tracking-wider">
            ORDER AVAILABILITY
          </h2>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            After order confirmation, there may be rare cases where a product is unavailable
            due to stock not being updated in real time.
          </p>

          <p className="mb-2 text-sm font-semibold text-foreground">
            In such situations:
          </p>

          <ul className="mb-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>We will first try to arrange the product for you.</li>
            <li>
              If the product cannot be arranged or is out of stock, your order will be cancelled
              from our side.
            </li>
            <li>
              A full refund will be issued to your original payment method.
            </li>
          </ul>

          <p className="text-sm leading-relaxed text-muted-foreground">
            Please note that such cases are minimal, and we appreciate your understanding and support.
          </p>

          <p className="mt-4 text-sm font-semibold text-primary">
            – Team An1me Paradise
          </p>
        </motion.div>

        {/* Policy Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-hero p-8 lg:p-10"
        >
          <h2 className="mb-4 font-display text-xl font-bold tracking-wider">
            REPLACEMENT, REFUND & COMPENSATION POLICY
          </h2>

          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Replacement, refund, or compensation will only be applicable under the following conditions:
          </p>

          <ul className="list-disc space-y-3 pl-5 text-sm text-muted-foreground">
            <li>
              A complete 360° video of the package must be recorded before opening the box.
            </li>
            <li>
              A full unboxing video must be provided, clearly showing the product from start to finish.
            </li>
            <li>
              The video must be continuous, with no pauses, cuts, or edits.
            </li>
            <li>
              Only after verifying the above proof, we will proceed with replacement, refund, or compensation, as applicable.
            </li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
};

export default TermsPage;