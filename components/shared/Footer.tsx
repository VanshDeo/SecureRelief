export function Footer() {
    return (
        <footer className="bg-gray-950 py-12 text-gray-400">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-white">
                            <span className="text-xl font-bold">Secure Relief</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Immediate, transparent, and direct disaster relief powered by blockchain technology.
                            100% of public donations go directly to beneficiaries.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Active Campaigns</a></li>
                            <li><a href="#" className="hover:text-white">Impact Reports</a></li>
                            <li><a href="#" className="hover:text-white">Apply for Aid</a></li>
                            <li><a href="#" className="hover:text-white">For Vendors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-semibold text-white">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row text-xs">
                    <p>&copy; 2026 Secure Relief Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">Discord</a>
                        <a href="#" className="hover:text-white">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
