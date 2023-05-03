import * as fs from "fs";
import * as path from "path";
import { SAMPLE_API_KEY } from "./Config";
import { ISample, ISampleConfig } from "./ISample";
import { ChatSession, ModerationError} from "../index";

const getSamples = (): Array<ISample> => {
    return [{
        name: "ChatSession: basic questions",
        run: async (config: ISampleConfig) => {
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
        
            fs.writeFileSync(path.join(config.outputPath, "chatsession-results.txt"), JSON.stringify(finalResult, undefined, 4));
        }
    }, {
        name: "ChatSession: chat moderation",
        run: async (config: ISampleConfig) => {
            const session = new ChatSession({
                apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
            });
        
            session.addMessage({ role: "user", content: "Test moderation request. I am going to punch you in the face." });
        
            try {
                await session.getResponses();
            } catch (e) {
                if (e instanceof ModerationError) {
                    fs.writeFileSync(path.join(config.outputPath, "chatsession-moderation.txt"), JSON.stringify(e, undefined, 4));
                }
            }
        }
    }];
};

export {
    getSamples
};
