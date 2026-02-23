import React from 'react';

const Vision = () => (
    <div className="min-h-screen bg-[#f4f8f7] px-4 py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl space-y-8 rounded-2xl border border-[#0a4f56]/12 bg-white p-6 text-sm text-[#33585d] shadow-sm lg:p-8">
            <header className="space-y-3 border-b border-[#0a4f56]/10 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5a7a7f]">Our Vision</p>
                <h1 className="text-2xl font-semibold leading-tight text-[#09343a] lg:text-3xl">
                    Vision: Agent-to-Agent Negotiation Infrastructure
                </h1>
            </header>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">1. Problem Statement</h2>
                <p>Today&apos;s personal agents operate as vertical silos:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Scheduling agent optimizes time</li>
                    <li>Finance agent optimizes cost</li>
                    <li>Health agent optimizes wellbeing</li>
                    <li>Travel agent optimizes logistics</li>
                    <li>Shopping agent optimizes convenience</li>
                </ul>
                <p>Conflicts emerge because optimization domains overlap:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Free time vs workout commitments</li>
                    <li>Budget limits vs travel plans</li>
                    <li>Sleep schedule vs early meetings</li>
                </ul>
                <p>The user becomes the arbitration layer, manually reconciling competing recommendations.</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">2. Core Insight</h2>
                <p>Shift coordination responsibility from the human to the agents:</p>
                <blockquote className="rounded-xl border border-[#0a4f56]/15 bg-[#f8fcfb] p-4 text-[#09343a]">
                    Agents should <strong>negotiate constraints, priorities, and tradeoffs directly</strong>.
                </blockquote>
                <p>Instead of independent outputs, agents participate in a shared decision economy.</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">3. Vision</h2>
                <p>Create an infrastructure where:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Agents are autonomous but interoperable</li>
                    <li>Each agent exposes goals, constraints, flexibility ranges, and priority weights</li>
                    <li>Agents resolve conflicts via machine negotiation protocols</li>
                    <li>The user acts as policy setter and final approver</li>
                </ul>
                <p>Outcome:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Coherent, cross-domain decisions</li>
                    <li>Reduced cognitive load</li>
                    <li>Higher quality optimization</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#09343a]">4. System Model</h2>
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#09343a]">Agents</h3>
                    <p>Self-contained optimizers with domain expertise:</p>
                    <ul className="ml-5 list-disc space-y-1">
                        <li>Calendar / Scheduling</li>
                        <li>Finance / Budgeting</li>
                        <li>Health / Fitness / Medical</li>
                        <li>Travel / Mobility</li>
                        <li>Commerce / Purchases</li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-[#09343a]">Negotiation Layer</h3>
                    <p>A neutral coordination substrate providing:</p>
                    <div className="overflow-x-auto rounded-xl border border-[#0a4f56]/12">
                        <table className="min-w-full divide-y divide-[#0a4f56]/12">
                            <thead className="bg-[#f8fcfb]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#5a7a7f]">Capability</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#5a7a7f]">Purpose</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0a4f56]/10 bg-white">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-[#09343a]">Constraint Exchange</td>
                                    <td className="px-4 py-3">Share hard/soft limits</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-[#09343a]">Preference Signaling</td>
                                    <td className="px-4 py-3">Communicate utility functions</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-[#09343a]">Conflict Detection</td>
                                    <td className="px-4 py-3">Identify incompatible plans</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-[#09343a]">Tradeoff Resolution</td>
                                    <td className="px-4 py-3">Evaluate compromises</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-[#09343a]">Arbitration Logic</td>
                                    <td className="px-4 py-3">Apply user policies</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#09343a]">5. Example Scenario</h2>
                <div className="space-y-3 rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                    <h3 className="text-base font-semibold text-[#09343a]">Inputs</h3>
                    <ul className="ml-5 list-disc space-y-1">
                        <li>Scheduling agent: &quot;Free slot 6-7 AM&quot;</li>
                        <li>Health agent: &quot;Exercise recommended&quot;</li>
                        <li>Finance agent: &quot;Premium gym class costs &#8377;800&quot;</li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h3 className="text-base font-semibold text-[#09343a]">Negotiation Flow</h3>
                    <ol className="ml-5 list-decimal space-y-1">
                        <li>Health agent proposes workout</li>
                        <li>Finance agent flags budget friction</li>
                        <li>Health agent offers alternatives (home workout)</li>
                        <li>Scheduling agent checks time flexibility</li>
                        <li>System converges on optimal solution</li>
                    </ol>
                </div>
                <div className="rounded-xl border border-[#0a4f56]/15 bg-[#f8fcfb] p-4 text-[#09343a]">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5a7a7f]">User Experience</p>
                    <p className="mt-2 font-medium">&quot;Proposed: Home workout 6:30-7 AM. Approve?&quot;</p>
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">6. Key Principles</h2>
                <ul className="space-y-3">
                    <li className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <p className="font-semibold text-[#09343a]">Decentralized intelligence</p>
                        <p className="mt-1">No single super-agent; coordination emerges.</p>
                    </li>
                    <li className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <p className="font-semibold text-[#09343a]">Constraint-first architecture</p>
                        <p className="mt-1">Decisions shaped by limits before actions.</p>
                    </li>
                    <li className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <p className="font-semibold text-[#09343a]">Negotiation over command</p>
                        <p className="mt-1">Agents persuade, not override.</p>
                    </li>
                    <li className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <p className="font-semibold text-[#09343a]">Human as governor, not operator</p>
                        <p className="mt-1">Sets rules, approves outcomes.</p>
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-[#09343a]">7. Value Proposition</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <h3 className="text-base font-semibold text-[#09343a]">For Users</h3>
                        <ul className="ml-5 mt-2 list-disc space-y-1">
                            <li>Fewer micro-decisions</li>
                            <li>Reduced friction between life domains</li>
                            <li>Consistent, rational planning</li>
                        </ul>
                    </div>
                    <div className="rounded-xl border border-[#0a4f56]/12 bg-[#fbfdfd] p-4">
                        <h3 className="text-base font-semibold text-[#09343a]">For Ecosystem</h3>
                        <ul className="ml-5 mt-2 list-disc space-y-1">
                            <li>Agents become composable</li>
                            <li>New categories of cross-agent apps</li>
                            <li>Emergence of decision markets</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">8. Why This Matters</h2>
                <p>This transforms agents from:</p>
                <p className="font-medium text-[#09343a]">Tools -&gt; Participants</p>
                <p>and systems from:</p>
                <p className="font-medium text-[#09343a]">Automation -&gt; Coordination Intelligence</p>
                <p>The breakthrough is not smarter individual agents, but structured interaction between them.</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">9. Long-Term Implications</h2>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Personal operating systems driven by agent consensus</li>
                    <li>Economic models of agent utility and negotiation</li>
                    <li>Inter-agent standards analogous to HTTP for decisions</li>
                    <li>Entire categories of conflict-resolution AI middleware</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">10. Starting Point</h2>
                <p>Orca (Scheduling) is the ideal entry use case:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Naturally intersects with all domains</li>
                    <li>High frequency of conflicts</li>
                    <li>Clear measurable improvements (time efficiency)</li>
                </ul>
                <p>From scheduling to finance to health to travel to commerce.</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-lg font-semibold text-[#09343a]">11. End State</h2>
                <p>A world where:</p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Agents collaborate continuously</li>
                    <li>Decisions emerge from negotiation</li>
                    <li>Humans supervise strategy, not logistics</li>
                </ul>
                <blockquote className="rounded-xl border border-[#0a4f56]/15 bg-[#f8fcfb] p-4 font-medium text-[#09343a]">
                    The true leap is from intelligent agents to intelligent systems of agents.
                </blockquote>
            </section>

            <div className="border-t border-[#0a4f56]/10 pt-6">
                <a
                    href="https://wa.me/+919036303552"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-[#0a4f56] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083b42]"
                >
                    Talk to creator
                </a>
            </div>
        </div>
    </div>
);

export default Vision;
