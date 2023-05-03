export interface ISampleConfig {
    outputPath: string;
    inputPath: string;
}

export interface ISample {
    name: string;
    run: (config: ISampleConfig) => Promise<void>;
}
