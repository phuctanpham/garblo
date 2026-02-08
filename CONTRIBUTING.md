# Contributing

## Commit Messages

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This helps us to have a clear and descriptive commit history, and it also allows us to automatically generate changelogs.

### Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and has a special format that includes a **type**, a **scope**, and a **subject**.

### Type

The type must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope

The scope is optional and can be anything specifying the place of the commit change. For example, `(client)`, `(server)`, `(database)`, etc.

### Subject

The subject contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

### Body

The body is optional. Use it to explain _what_ and _why_ vs. _how_.

### Footer

The footer is optional. It can contain information about breaking changes and references to issues that this commit closes. It must end with `by <your code name>` where `<your code name>` is the name you have configured in git user.name (e.g. if your name is Pham Tan Phuc, your codename might be phucpt).

### Example

```text
feat(client): add login page

Adds a new login page to the client application.

Closes #123
by phucpt
```
