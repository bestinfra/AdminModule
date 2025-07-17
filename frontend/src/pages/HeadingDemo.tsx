import React from 'react';
import Heading from '@/components/global/Heading';

const HeadingDemo: React.FC = () => {
    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Basic Headings */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Basic Headings
                    </h2>
                    <div className="space-y-4">
                        <Heading text="Heading Level 1" level={1} />
                        <Heading text="Heading Level 2" level={2} />
                        <Heading text="Heading Level 3" level={3} />
                        <Heading text="Heading Level 4" level={4} />
                        <Heading text="Heading Level 5" level={5} />
                        <Heading text="Heading Level 6" level={6} />
                    </div>
                </section>

                {/* Size Variations */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Size Variations
                    </h2>
                    <div className="space-y-4">
                        <Heading text="Extra Small Heading" size="xs" />
                        <Heading text="Small Heading" size="sm" />
                        <Heading text="Base Heading" size="base" />
                        <Heading text="Large Heading" size="lg" />
                        <Heading text="Extra Large Heading" size="xl" />
                        <Heading text="2XL Heading" size="2xl" />
                        <Heading text="3XL Heading" size="3xl" />
                        <Heading text="4XL Heading" size="4xl" />
                        <Heading text="5XL Heading" size="5xl" />
                        <Heading text="6XL Heading" size="6xl" />
                    </div>
                </section>

                {/* Weight Variations */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Weight Variations
                    </h2>
                    <div className="space-y-4">
                        <Heading text="Light Weight" weight="light" />
                        <Heading text="Normal Weight" weight="normal" />
                        <Heading text="Medium Weight" weight="medium" />
                        <Heading text="Semibold Weight" weight="semibold" />
                        <Heading text="Bold Weight" weight="bold" />
                        <Heading text="Extra Bold Weight" weight="extrabold" />
                    </div>
                </section>

                {/* Color Variants */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Color Variants
                    </h2>
                    <div className="space-y-4">
                        <Heading text="Default Variant" variant="default" />
                        <Heading text="Primary Variant" variant="primary" />
                        <Heading text="Secondary Variant" variant="secondary" />
                        <Heading text="Muted Variant" variant="muted" />
                        <Heading text="Success Variant" variant="success" />
                        <Heading text="Warning Variant" variant="warning" />
                        <Heading text="Danger Variant" variant="danger" />
                    </div>
                </section>

                {/* Alignment */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Alignment
                    </h2>
                    <div className="space-y-4">
                        <div className="border border-gray-200 p-4 rounded">
                            <Heading text="Left Aligned" align="left" />
                        </div>
                        <div className="border border-gray-200 p-4 rounded">
                            <Heading text="Center Aligned" align="center" />
                        </div>
                        <div className="border border-gray-200 p-4 rounded">
                            <Heading text="Right Aligned" align="right" />
                        </div>
                        <div className="border border-gray-200 p-4 rounded">
                            <Heading
                                text="Justify Aligned - This is a longer text to demonstrate justify alignment"
                                align="justify"
                            />
                        </div>
                    </div>
                </section>

                {/* Text Modifiers */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Text Modifiers
                    </h2>
                    <div className="space-y-4">
                        <Heading text="Uppercase Text" uppercase />
                        <Heading text="Underlined Text" underline />
                        <Heading text="Italic Text" italic />
                        <Heading
                            text="Truncated Text - This is a very long text that should be truncated"
                            truncate
                            className="max-w-xs"
                        />
                    </div>
                </section>

                {/* Interactive */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Interactive
                    </h2>
                    <div className="space-y-4">
                        <Heading
                            text="Clickable Heading"
                            onClick={() => alert('Heading clicked!')}
                            className="hover:scale-105 transition-transform"
                        />
                    </div>
                </section>

                {/* Custom Styling */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Custom Styling
                    </h2>
                    <div className="space-y-4">
                        <Heading
                            text="Custom Styled Heading"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                        />
                        <Heading
                            text="With Border"
                            className="border-b-2 border-blue-500 pb-2"
                        />
                        <Heading
                            text="With Background"
                            className="bg-blue-100 px-4 py-2 rounded-lg"
                        />
                    </div>
                </section>

                {/* Real-world Examples */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Real-world Examples
                    </h2>
                    <div className="space-y-6">
                        {/* Page Header */}
                        <div className="border border-gray-200 p-6 rounded-lg">
                            <Heading
                                text="Dashboard Analytics"
                                level={1}
                                size="3xl"
                                variant="primary"
                                weight="bold"
                                className="mb-2"
                            />
                            <Heading
                                text="Track your key metrics and performance indicators"
                                level={3}
                                size="lg"
                                variant="secondary"
                                weight="normal"
                            />
                        </div>

                        {/* Section Header */}
                        <div className="border border-gray-200 p-6 rounded-lg">
                            <Heading
                                text="Revenue Overview"
                                level={2}
                                size="2xl"
                                weight="semibold"
                                className="mb-4"
                            />
                            <p className="text-gray-600">
                                This section shows your revenue metrics and
                                trends.
                            </p>
                        </div>

                        {/* Card Title */}
                        <div className="border border-gray-200 p-4 rounded-lg">
                            <Heading
                                text="Monthly Revenue"
                                level={4}
                                size="lg"
                                weight="medium"
                                className="mb-2"
                            />
                            <p className="text-2xl font-bold text-green-600">
                                $45,678
                            </p>
                        </div>

                        {/* Alert Heading */}
                        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                            <Heading
                                text="Warning: System Maintenance"
                                level={3}
                                size="xl"
                                variant="danger"
                                weight="semibold"
                                className="mb-2"
                            />
                            <p className="text-red-700">
                                Scheduled maintenance will begin in 30 minutes.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HeadingDemo;
