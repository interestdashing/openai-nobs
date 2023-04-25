# openai-nobs - OpenAI NodeJS library
OpenAI no BS. An OpenAI NodeJS library written in TypeScript without all of the bloatware. No dependencies, no problem.

Important note: similar to other openai clients, this library is meant for server-side usage only.

## Installation

```bash
$ npm install openai-nobs
```

## Usage
The raw source, available on Github, can be used directly within your application.

The published NPM package can be used by configuring a Client and making requests.

```typescript
import { Client } from "openai-nobs/Client";
import { ChatGet } from "openai-nobs/Chat";
import { ModelList } from "openai-nobs/Models";

const client = new Client({
    apiKey: "--insert api key here--"
});

const modelList = await client.makeRequest(new ModelList());
modelList.data[0].id;
```
