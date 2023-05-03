import { SessionType } from "./SessionType";

export interface ISummarizer {
    needsSummary(input: string, type: SessionType): boolean;
    getSummary(input: string, type: SessionType): Promise<string>;
}
