## Slackmin v4.0.0
- Republished package under True Sparrow organisation.

## Slackmin v3.0.0
- Multi-workspace support added. Now the slack apps can be from different slack workspaces / domains.
- Validators functions exposed for easy integration with non Express frameworks like Koa, Fastify, etc.
- Whitelisted channels validation made optional. Pass `whiteListedChannels` as an empty array when initializing Slackmin to skip this validation.
- Whitelisted users validation made optional. Pass `whitelistedUsers` as an empty array when initializing Slackmin to skip this validation.

## Slackmin v2.1.2
- Typo in the readme demo video corrected.

## Slackmin v2.1.1
- Readme changed to include Business and Developer benefit sections.
- Middleware for reading request raw body added in common middlewares.
- Removed un-necessary logs.

## Slackmin v2.1.0
- Added functionality of adding placeholder (helper) text and initial value in Modal text input field. 
- Added functionality of checkboxes to be checked on initial Modal page load.

## Slackmin v2.0.2
- Removed usage of deprecated `slack` npm package and replaced it with `@slack/bolt` npm package.

## Slackmin v2.0.1
- LICENSE changes.

## Slackmin v2.0.0
- `whitelistedChannels` Map was changed to `whitelistedChannelIds` Array in the constructor of Slackmin.
- Readme file was refactored with much more explanation and examples.

## Slackmin v1.0.0
- This is the very first release of this package.
- Middleware functions needed for implementation of slash commands and interactive endpoints are exposed.
- Message and Modal helper wrappers exposed.
