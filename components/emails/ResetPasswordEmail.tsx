import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Section,
    Button,
    Tailwind,
} from '@react-email/components';

interface ResetPasswordEmailProps {
    resetLink: string;
}

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => {
    const previewText = `Reset your Script GO password`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Reset Your Password
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We received a request to refresh your password for your Script GO account. If you didn't make this request, you can safely ignore this email.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#2563EB] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={resetLink}
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This link will expire in 1 hour.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
