import React from 'react';

const Terms = () => (
    <div className="min-h-screen bg-[#f4f8f7] px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-[#0a4f56]/12 bg-white p-6 text-sm text-[#33585d]">
            <h1 className="mb-4 text-2xl font-semibold text-[#09343a]">Terms of Service</h1>
            
            <p className="text-xs text-[#5a7a7f]">Last updated: February 2026</p>
            
            <p>
                By accessing or using Orca, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use Orca.
            </p>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Service Description</h2>
                <p>
                    Orca is an automated scheduling service that helps you coordinate meetings without back-and-forth communication. The service is provided "as-is" to help you automate scheduling workflows.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Google API Services</h2>
                <p>
                    If you connect Google Calendar, you authorize Orca to access and process Google user data required for requested scheduling features. This includes reading your calendar events, checking availability, and creating new events on your behalf.
                </p>
                <p>
                    Orca's use and transfer of information received from Google APIs adheres to the{' '}
                    <a 
                        className="underline underline-offset-2" 
                        href="https://developers.google.com/terms/api-services-user-data-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Google API Services User Data Policy
                    </a>, including the Limited Use requirements.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Your Account and Responsibilities</h2>
                <p>
                    You are responsible for:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Maintaining the security of your account credentials</li>
                    <li>The accuracy of account data, meeting details, and scheduling preferences you provide</li>
                    <li>All activities that occur under your account</li>
                    <li>Ensuring recipients you share scheduling links with are appropriate and authorized</li>
                    <li>Using the service in compliance with applicable laws and regulations</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Acceptable Use</h2>
                <p>
                    You agree not to:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Use Orca for any unlawful purpose or in violation of these terms</li>
                    <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                    <li>Interfere with or disrupt the service or servers</li>
                    <li>Use automated systems to access the service in a manner that sends more requests than a human could reasonably produce</li>
                    <li>Transmit spam, chain letters, or other unsolicited communications through the service</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Account Access and Revocation</h2>
                <p>
                    You can revoke Orca's access to your Google Calendar at any time through:
                </p>
                <ul className="ml-5 list-disc space-y-1">
                    <li>Orca account settings (Calendar page)</li>
                    <li>Your Google account permissions page at{' '}
                        <a 
                            className="underline underline-offset-2" 
                            href="https://myaccount.google.com/permissions"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            myaccount.google.com/permissions
                        </a>
                    </li>
                </ul>
                <p>
                    Revoking access will immediately stop Orca from accessing your Google Calendar data and may limit service functionality.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Service Availability and Modifications</h2>
                <p>
                    We reserve the right to modify, suspend, or discontinue the service (or any part thereof) at any time with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the service.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Disclaimers and Limitation of Liability</h2>
                <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p>
                    TO THE FULLEST EXTENT PERMITTED BY LAW, ORCA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Termination</h2>
                <p>
                    We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Changes to Terms</h2>
                <p>
                    We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the service after changes constitutes acceptance of the modified Terms.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-[#09343a]">Contact</h2>
                <p>
                    Questions about these Terms of Service can be sent to <a className="underline underline-offset-2" href="mailto:contact@getorca.in">contact@getorca.in</a>.
                </p>
            </section>
        </div>
    </div>
);

export default Terms;