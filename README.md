# openai-nobs - OpenAI NodeJS library
OpenAI no BS. An OpenAI NodeJS library written in TypeScript without all of the bloatware. No dependencies, all the fun.

NOTE: This library is meant for server-side usage only within a NodeJS environment.

## Installation

```bash
$ npm install openai-nobs
```

## Features
Although this library exposes [raw access](#raw-openai-api-usage) to the OpenAI API, it also provides an easier to use interface that handles many common developer scenarios.
* Automatic model detection
    * The session objects have built in model detection that allow you to use them without needing to know which models are required to be used.
    * The sessions can still be provided a specific model, but will by default find a working one for the usage
* Automatic moderation
    * Moderation is the developers responsibility and the session libraries make this easy
    * Enabled by default, can be disabled with `autoModeration: false`
    * Rejections with `ModerationError` will be thrown if inputs are flagged
* Automatic summery
    * Summarize inputs to fit within token limits of model
    * Enabled by default, can be disabled with `autoSummarize: false`


## Usage
It is recommended to use the [AudioSession](#audiosession) / [ChatSession](#chatsession) / [CompletionsSession](#completionssession) / [EditsSession](#editssession) / [ImagesSession](#imagessession) modules for basic usage of this library. For advanced or raw access to the OpenAI API see the [next section](#raw-openai-api-usage).

### Sessions
The session objects are designed to be easier to use objects which contain out of the box features missing from the raw APIs. 
They all can be created with the following options:
```typescript
{
    apiKey: string;

    // - default: true
    // - determines if prompts/inputs will be run through moderation endpoint
    autoModeration?: boolean;

    // - default: true
    // - determines if prompts/inputs will be summarized if too large
    autoSummarize?: boolean;
}
```


### CompletionsSession
The CompletionsSession manages request/responses for text completions and can be used in the following way:

```typescript
import { CompletionsSession } from "openai-nobs";
const session = new CompletionsSession({
    apiKey: "--insert api key here--"
});

// make completions request
const result = await session.complete({
    prompt: "Say this is a test",
    max_tokens: 7,
    logprobs: 2,
    n: 2,
});
```

### ChatSession
The ChatSession manages request/responses for chat messages and responses and can be used in the following way:

```typescript
import { ChatSession } from "openai-nobs";
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

session.addMessage(responses[0].message);
session.addMessage({ role: "user", content: "What color do you think I am?" });
const finalResult = await session.getResponses({});
```

### EditsSession
The EditsSession manages request/responses for text edits and can be used in the following way:

```typescript
import { EditsSession } from "openai-nobs";
const session = new EditsSession({
    apiKey: SAMPLE_API_KEY ?? "{{INSERT_API_KEY}}",
});

const result = await session.edit({
    instruction: "Fix the spelling mistakes and make it sound more profound.",
    input: "Waht is the poirpose of lyfe?",
});
```

### ImagesSession
The ImagesSession manages image generations and edits and can be used in the following way:

**Generation example:**
```typescript
import { ImagesSession } from "openai-nobs";
const session = new ImagesSession({
    apiKey: "--insert api key here--"
});

const result = await session.generate({
    prompt: "Picture of a cat's paw.",
    n: 2,
});
```

**Edit with mask example:**
```typescript
import { ImagesSession } from "openai-nobs";
const session = new ImagesSession({
    apiKey: "--insert api key here--"
});

const image = Buffer.from(""); // TODO: read image via fs, etc
const mask = Buffer.from(""); // TODO: read mask via fs, etc
const result = await session.edit({
    image,
    mask,
    prompt: "Make the cats paw have extended translucent claws.",
    n: 2,
});
```

**Variation of image example:**
```typescript
import { ImagesSession } from "openai-nobs";
const session = new ImagesSession({
    apiKey: "--insert api key here--"
});

const image = Buffer.from(""); // TODO: read image via fs, etc
const result = await session.variant({
    image,
    n: 2,
});
```

### AudioSession
The AudioSession manages translating and transcribing audio and can be used in the following way:

**Audio transcription example:**
```typescript
import { AudioSession } from "openai-nobs";
const session = new AudioSession({
    apiKey: "--insert api key here--"
});
const audio = Buffer.from(""); // TODO: read audio via fs, etc
const result = await session.transcribe({
    audio,
    audio_filename: "audio.m4a",
    language: "en"
});
```

**Audio translation example:**
```typescript
import { AudioSession } from "openai-nobs";
const session = new AudioSession({
    apiKey: "--insert api key here--"
});
const audio = Buffer.from(""); // TODO: read audio via fs, etc
const result = await session.translate({
    audio,
    audio_filename: "audio.m4a",
});
```

## Raw OpenAI API Usage
**NOTE: It is recommended to use the [AudioSession](#audiosession) / [ChatSession](#chatsession) / [CompletionsSession](#completionssession) / [EditsSession](#editssession) / [ImagesSession](#imagessession) modules for basic usage of this library. The raw OpenAI access is available as documented below, but enhancements for ease of use and functionality have been built on top via the Session objects.**

The raw source, available on Github, can be used directly within your application.

The published NPM package can be used by configuring a `Client` and making requests.  These provide raw access to OpenAI APIs. This includes Models/Completions/Chat/Edits/Images/Audio/Moderations but does not currently support fine tuning or Embeddings. At this time, the ability to stream responses is also not supported.

The documentation below can be used for reference when using the raw OpenAI API through this module.

### Models
[OpenAI Models API Reference](https://platform.openai.com/docs/api-reference/models)

The Models API can be included by importing `Models` directly or via the main module entry point.  This provides listing and getting of model information through the common `Client` object:

```typescript
import { Client, ModelList, ModelGet } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

// list and get models
const modelList = await client.makeRequest(new ModelList());
const model = await client.makeRequest(new ModelGet(modelList.data[0].id));
```

### Completions
[OpenAI Completions API Reference](https://platform.openai.com/docs/api-reference/completions)

The Completions API can be included by importing `Completions` directly or via the main module entry point. This provides text completion information through the common `Client` object:

```typescript
import { Client, CompletionsGet, ModelList } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

// find an existing curie model id
const modelResult = await client.makeRequest(new ModelList());
const curieModel = modelResult.data.filter((m) => m.id.indexOf("text-curie") !== -1)[0];

// make completions request
const result = await client.makeRequest(new CompletionsGet({
    model: curieModel.id,
    prompt: "Say this is a test",
    max_tokens: 7,
    logprobs: 2,
    n: 2,
}));
```

### Chat
[OpenAI Chat API Reference](https://platform.openai.com/docs/api-reference/chat)

The Chat API can be included by importing `Chat` directly or via the main module entry point. This provides chat responses through the common `Client` object:

```typescript
import { Client, ChatRole, ChatGet, ModelList } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

// find an existing gpt model id
const modelResult = await client.makeRequest(new ModelList());
const gptModel = modelResult.data.filter((m) => m.id.indexOf("gpt-3.5") !== -1)[0];

// make chat request
const result = await client.makeRequest(new ChatGet({
    model: gptModel.id,
    messages: [
        { role: ChatRole.USER, content: "I am a dog." },
        { role: ChatRole.USER, content: "What noises do I make?" },
    ],
    n: 2,
}));
```

### Edits
[OpenAI Edits API Reference](https://platform.openai.com/docs/api-reference/edits)

The Edits API can be included by importing `Edits` directly or via the main module entry point. This provides edit responses through the common `Client` object:

```typescript
import { Client, ModelList, EditGet } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

// get an existing davinci model id
const modelResult = await client.makeRequest(new ModelList());
const editModel = modelResult.data.filter((m) => m.id.indexOf("text-davinci-edit") !== -1)[0];

// make edits request
const result = await client.makeRequest(new EditGet({
    model: editModel.id,
    instruction: "Fix the spelling mistakes",
    input: "Waht is the poirpose of lyfe?",
    n: 2,
}));
```

### Images
[OpenAI Images API Reference](https://platform.openai.com/docs/api-reference/images)

The Images API can be included by importing `Images` directly or via the main module entry point. This provides image generation/editing responses through the common `Client` object.  

NOTE: this library explicitly uses `Buffer` objects for input/output of binary data like images and audio.  This means it is the users responsibility to write/present any returned data and no options for `response_format` are supported for the Images API (becuase everything will be using `b64_json` and returned as Buffer objects to consumer).

**Generation example:**
```typescript
import { Client, ImageGenerate } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

const result = await client.makeRequest(new ImageGenerate({
    prompt: "Picture of a cat's paw.",
    n: 2,
}));
```

**Edit with mask example:**
```typescript
import { Client, ImageEdit } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

const image = Buffer.from(""); // TODO: read image via fs, etc
const mask = Buffer.from(""); // TODO: read mask via fs, etc
const result = await client.makeRequest(new ImageEdit({
    image,
    mask,
    prompt: "Make the cats paw have extended translucent claws.",
    n: 2,
}));
```

**Variation of image example:**
```typescript
import { Client, ImageVariation } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

const image = Buffer.from(""); // TODO: read image via fs, etc
const result = await client.makeRequest(new ImageVariation({
    image,
    n: 2,
}));
```

### Audio
[OpenAI Audio API Reference](https://platform.openai.com/docs/api-reference/audio)

The Audio API can be included by importing `Audio` directly or via the main module entry point. This provides audio transcription/translation responses through the common `Client` object.  

NOTE: this library explicitly uses `Buffer` objects for input of binary data like audio. 

**Audio transcription example:**
```typescript
import { Client, AudioTranscription } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});
const audio = Buffer.from(""); // TODO: read audio via fs, etc
const result = await client.makeRequest(new AudioTranscription({
    audio,
    audio_filename: "audio.m4a",
    model: "whisper-1", // only one available?
    language: "en"
}));
```

**Audio translation example:**
```typescript
import { Client, AudioTranslation } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});
const audio = Buffer.from(""); // TODO: read audio via fs, etc
const result = await client.makeRequest(new AudioTranslation({
    audio,
    audio_filename: "audio.m4a",
    model: "whisper-1", // only one available?
}));
```

### Moderations
[OpenAI Moderations API Reference](https://platform.openai.com/docs/api-reference/moderations)

The Moderations API can be included by importing `Moderations` directly or via the main module entry point. This provides moderation responses through the common `Client` object:

```typescript
import { Client, ModerationCategory, ModerationsGet } from "openai-nobs";
const client = new Client({
    apiKey: "--insert api key here--"
});

const result = await client.makeRequest(new ModerationsGet({
    input: "I am going to punch you in the face."
}));
```
