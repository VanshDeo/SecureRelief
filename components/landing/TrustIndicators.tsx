'use client';

import React from 'react';

const brands = ["Global Aid", "Med Corp", "Clean Water", "Rebuild"];

export function TrustIndicators() {
    return (
        <section className="py-16 border-t bg-muted/20">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-widest">Trusted by Global Aid Organizations & Governments</p>
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center gap-3 group cursor-default">
                            <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                                <div className="h-4 w-4 bg-primary rounded-full" />
                            </div>
                            <span className="text-xl font-bold text-foreground/80">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
