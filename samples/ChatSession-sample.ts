import { SAMPLE_API_KEY } from "./Config";
import { ChatSession, ModerationError} from "../index";

/*
 * Chat sample that asks basic questions.
*/ 
(async () => {
    const session = new ChatSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    session.addMessage({ role: "user", content: "I am a dog." });
    session.addMessage({ role: "assistant", content: "What type of dog are you?" });
    session.addMessage({ role: "user", content: "I am a small dog." });
    session.addMessage({ role: "user", content: "What noises do I make?" });
    const responses = await session.getResponses({
        n: 2
    });

    session.addMessage(responses.choices[0].message);
    session.addMessage({ role: "user", content: "What color do you think I am?" });
    const finalResult = await session.getResponses({});

    console.log(JSON.stringify(finalResult, undefined, 4));
})().catch((e) => {
    console.error(`Failure with chat`, e);
});

/*
 * Chat sample that asks basic questions but gets moderated.
*/ 
(async () => {
    const session = new ChatSession({
        apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
    });

    session.addMessage({ role: "user", content: "Test moderation request. I am going to punch you in the face." });

    try {
        await session.getResponses();
    } catch (e) {
        if (e instanceof ModerationError) {
            console.log("Expected moderation failure", e);
        }
    }
})().catch((e) => {
    console.error(`Failure with chat`, e);
});
