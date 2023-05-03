export interface IModerator {
    checkModerations(input: string | Array<string>): Promise<void>;
}
