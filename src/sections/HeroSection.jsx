/**
 * Overlay text placed opposite the rider/bike.
 * On wide screens, text sits on the right; on mobile it stacks.
 * Replace <introduction> with your actual intro paragraph.
 */
export default function HeroSection() {
    return (
        <section className="h-screen flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Empty spacer to keep text opposite the bike/rider */}
                    <div className="lg:col-span-6" />

                    {/* Text block */}
                    <div className="lg:col-span-6 flex items-center">
                        {/*<div>*/}
                        {/*    <h1 className="text-4xl sm:text-5xl font-bold leading-tight">*/}
                        {/*        Moatasim bin Hisham Sayyid*/}
                        {/*    </h1>*/}
                        {/*    <p className="mt-3 text-xl sm:text-2xl opacity-95">*/}
                        {/*        Full stack software engineer*/}
                        {/*    </p>*/}

                        {/*    <p className="mt-6 text-base sm:text-lg max-w-prose opacity-85">*/}
                        {/*        &lt;introduction&gt;*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </section>
    );
}
