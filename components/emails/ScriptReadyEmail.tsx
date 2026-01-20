import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Section,
    Button,
    Tailwind,
    Hr,
} from '@react-email/components';

interface ScriptReadyEmailProps {
    title: string;
    previewContent: string;
    scriptId: string;
}

export const ScriptReadyEmail = ({ title, previewContent, scriptId }: ScriptReadyEmailProps) => {
    const previewText = `Your script "${title}" is ready!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Your Script is Ready!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Great news! Your script <strong>{title}</strong> has been successfully generated.
                        </Text>
                        <Section className="bg-gray-50 p-4 rounded-md my-4">
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">
                                Preview
                            </Text>
                            <Text className="text-gray-800 text-sm whitespace-pre-line italic">
                                "{previewContent.substring(0, 150)}..."
                            </Text>
                        </Section>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#2563EB] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                            >
                                View Full Script
                            </Button>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            You can verify and edit this script directly in your dashboard.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
