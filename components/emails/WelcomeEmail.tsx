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
} from '@react-email/components';

interface WelcomeEmailProps {
    name?: string;
}

export const WelcomeEmail = ({ name = 'User' }: WelcomeEmailProps) => {
    const previewText = `Welcome to ScriptGo, ${name}!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to <strong>Script GO</strong>
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {name},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We're excited to have you on board! Script GO is your AI-powered companion for creating amazing scripts for YouTube, LinkedIn, Instagram, and more.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                            >
                                Go to Dashboard
                            </Button>
                        </Section>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Start generating your first script today!
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
