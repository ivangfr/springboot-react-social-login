# AGENTS.md — Coding Agent Reference

This file documents conventions, commands, and patterns for agentic coding agents working in this repository.

---

## Project Overview

Full-stack social login application:
- **Backend:** `movie-api/` — Spring Boot 4.0.3, Java 25, PostgreSQL
- **Frontend:** `movie-ui/` — React 19, Vite + Vitest, JavaScript (no TypeScript)
- **Infrastructure:** Docker Compose (PostgreSQL 18.0)

Default URLs: backend `http://localhost:8080`, frontend `http://localhost:3000`.
Swagger UI: `http://localhost:8080/swagger-ui.html`.

---

## Build, Run, and Test Commands

### Infrastructure

```bash
# Start PostgreSQL
docker compose up -d

# Stop and remove containers + volumes
docker compose down -v
```

### Backend (`movie-api/`)

All Maven commands must be run from the `movie-api/` directory using the wrapper.

```bash
# Run the application (requires running Postgres)
./mvnw clean spring-boot:run

# Run all tests
./mvnw test

# Build JAR (skip tests)
./mvnw clean package -DskipTests

# Run a single test class
./mvnw test -Dtest=MovieApiApplicationTests

# Run a single test method
./mvnw test -Dtest=MovieApiApplicationTests#contextLoads

# Run tests matching a pattern
./mvnw test -Dtest="*Movie*"
```

Integration smoke tests (requires a running app and `jq`):
```bash
./movie-api/test-endpoints.sh
```

### Frontend (`movie-ui/`)

All npm commands must be run from the `movie-ui/` directory.

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm start

# Production build
npm run build

# Run all tests (non-interactive)
npm test

# Run tests for a specific file
npm test -- src/components/home/Login.test.jsx

# Run tests matching a name pattern
npm test -- --reporter=verbose Login
```

---

## Backend Code Style (Java)

### Formatting
- **Indentation:** 4 spaces (no tabs).
- **Braces:** K&R style — opening brace on the same line as declaration.
- **Blank lines:** Single blank line between methods; no trailing blank lines.
- No Checkstyle or SpotBugs configuration is enforced — follow existing conventions.

### Import Ordering
Group and order imports as follows (blank line between groups):
1. `jakarta.*`
2. `lombok.*`
3. `org.springframework.*`
4. Third-party libraries (`io.*`, `com.*` non-project)
5. `java.*`
6. Static imports last

### Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| JPA entities | `PascalCase`, no suffix | `User`, `Movie` |
| Repositories | `PascalCase` + `Repository` | `MovieRepository` |
| Service interfaces | `PascalCase` + `Service` | `MovieService` |
| Service implementations | interface name + `Impl` | `MovieServiceImpl` |
| REST controllers | domain + `Controller` | `MovieController` |
| Request DTOs (records) | action + domain + `Request` | `CreateMovieRequest` |
| Response DTOs (records) | domain + `Dto` / `Response` | `MovieDto`, `AuthResponse` |
| Custom exceptions | descriptive + `Exception` | `MovieNotFoundException` |
| Config classes | descriptive + `Config` | `SecurityConfig` |
| Enums | `PascalCase`; values `SCREAMING_SNAKE_CASE` | `OAuth2Provider.GITHUB` |
| Constants (fields) | `SCREAMING_SNAKE_CASE` | `TOKEN_TYPE`, `TOKEN_HEADER` |
| Instance fields / methods | `camelCase` | `jwtSecret`, `validateAndGetMovie` |
| Packages | lowercase, domain-scoped | `com.ivanfranchin.movieapi.security.oauth2` |

### Lombok Usage
- `@Data` + `@NoArgsConstructor` on JPA entities.
- `@RequiredArgsConstructor` on Spring beans (controllers, services, filters) — inject `final` fields; never use `@AllArgsConstructor` on beans.
- Exception: `CustomOAuth2UserService` uses a manual constructor (not `@RequiredArgsConstructor`) because Lombok cannot cleanly handle a `List<OAuth2UserInfoExtractor>` generic-collection dependency.
- `@Getter` + `@AllArgsConstructor(access = AccessLevel.PRIVATE)` on immutable non-bean classes (e.g. `CustomUserDetails`); expose construction via named static factory methods, never via the raw constructor.
- `@Slf4j` on any class that logs.

### DTOs
- All request and response DTOs are **Java records** (immutable).
- Use component accessor syntax: `loginRequest.username()` (not getters).
- Static factory: `public static Dto from(DomainObject o)`. Multiple `from()` overloads are allowed when the same DTO can be built from different source types (e.g. `UserDto.from(User)` and `UserDto.from(CustomUserDetails)`).
- Domain mapping: `public DomainObject toDomain()` instance method on the record.

### Package Structure
- Domain packages co-locate entity, repository, service interface, impl, and exceptions: `movie/`, `user/`.
- REST layer is in `rest/` with a `dto/` sub-package.
- Cross-cutting concerns live in `security/`, `config/`, `runner/`.
- Note: `CorsConfig` lives in `security/`, not `config/`, because it is tightly coupled to the security filter chain.

### Error Handling
- Custom domain exceptions extend `RuntimeException` and carry `@ResponseStatus(HttpStatus.*)`.
- There is no `@ControllerAdvice`. Spring Boot's default error attributes mechanism is used via `ErrorAttributesConfig`, which always includes the `message` and `bindingErrors` fields.
- Validation uses `jakarta.validation` annotations (`@NotBlank`, `@Email`) on record components, activated by `@Valid` on controller parameters.
- Service lookup methods follow the `validateAndGet*()` naming convention: return the entity or throw a `*NotFoundException`.
- `Optional<T>` is returned from repositories and consumed with `.orElseThrow(...)` at the service layer; controllers never receive `Optional`.
- Within service-layer helpers, prefer `.map(...).orElseGet(...)` over `if (optional.isEmpty()) { ... } else { ... }` blocks when branching on Optional presence.
- In filters and token providers, catch exceptions per-type, log them with `log.error(...)`, and return a safe fallback (`Optional.empty()`, continue filter chain) rather than propagating.
- Existing domain exceptions: `MovieNotFoundException` (`NOT_FOUND`), `UserNotFoundException` (`NOT_FOUND`), `DuplicatedUserInfoException` (`CONFLICT`), `UserDeletionNotAllowedException` (`BAD_REQUEST`).

### Service Conventions
- Prefer `repository.count()` over fetching a full list and calling `.size()` when only a count is needed (e.g. seed guards, public stats endpoints). Expose this as a `count*()` method on the service interface returning `long`.
- Use `.toList()` (not `Collectors.toList()`) on all stream pipelines.

### Security Principal (`CustomUserDetails`)
- `CustomUserDetails` is immutable: all fields are `final`, the all-args constructor is `private`.
- **Never call the constructor directly.** Use the named static factories:
  - `CustomUserDetails.ofLocalUser(id, username, password, name, email, authorities)` — for form-login / `UserDetailsService`.
  - `CustomUserDetails.ofOAuth2User(username, name, email, avatarUrl, provider, authorities, attributes)` — for OAuth2 extractors.
- Use `customUserDetails.withId(id)` to copy an OAuth2 principal and set the resolved DB id after the user upsert in `CustomOAuth2UserService`.

### Jackson / ObjectMapper
- Uses `tools.jackson.databind.*` (Jackson 3.x, packaged under `tools.jackson`).
- `ObjectMapperConfig` registers a `JsonMapper` bean (`tools.jackson.databind.json.JsonMapper`) built with `JsonMapper.builder()`, not a raw `ObjectMapper`.

---

## Frontend Code Style (JavaScript / React)

### Formatting
- **Indentation:** 2 spaces (no tabs).
- **Quotes:** Single quotes for all strings and imports.
- **Semicolons:** Omitted (no semicolons at end of statements).
- No Prettier configuration; no custom ESLint rules beyond the Vite default (ESLint flat config via `eslint.config.js` using `eslint-plugin-react` and `eslint-plugin-react-hooks`).

### Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Components | `PascalCase` function declaration | `function AdminPage()` |
| Component files | `PascalCase.jsx` | `AdminPage.jsx` |
| Custom hooks | `useX` | `useAuth()` |
| Context objects | `PascalCase` + `Context` | `AuthContext` |
| State variables | `camelCase`; boolean with `is`/`has` prefix | `isLoading`, `isError` |
| Event handlers | `handleX` prefix | `handleSubmit`, `handleDeleteUser` |
| API module | named export object | `export const movieApi = { ... }` |
| Constants | named exports from `Constants.js` | `export const config = ...` |

### Component Patterns
- All components are **function components** — no class components.
- Props are destructured inline in the function signature for presentational components.
- Context: `createContext()` + a `useX()` custom hook exported from the same file.
- One default export per file, matching the component name.

### Error Handling
- Always call `handleLogError(error)` (from `Helpers.js`) first inside every `catch` block.
- Maintain `isError` boolean state (and optionally `errorMessage` string state) for UI feedback.
- Inspect `error.response.data.status` to differentiate 400 (validation) vs 409 (conflict) errors.
- JWT expiry is checked client-side in both `MovieApi.js` (Axios interceptor) and `AuthContext.userIsAuthenticated()`.
- Token is stored in `localStorage` as `JSON.stringify({ data: parsedJwt, accessToken: rawToken })`.

### API Communication
- All HTTP calls use **Axios** via `movieApi` (from `MovieApi.js`).
- Bearer token is injected **per-call** in each function's `headers` option (not via a global Axios interceptor).
- An Axios request interceptor validates JWT expiry before each request; if the token is expired it redirects to `/login` rather than rejecting the promise.

---

## Testing

### Backend (JUnit 5 + Spring Boot Test)
- Test classes use `@SpringBootTest` for integration context tests.
- Unit tests: `@ExtendWith(MockitoExtension.class)` + Mockito mocks.
- Controller slice tests: `@WebMvcTest` + `MockMvc`. Every controller test also adds `@Import(SecurityConfig.class)` to load the security filter chain.
- Use AssertJ (`assertThat(...)`) for assertions.
- `MovieApiApplicationTests` uses `@SpringBootTest(webEnvironment = NONE)` with `@MockitoBean` for all infrastructure beans — it is fully active (not `@Disabled`).
- Use `@MockitoBean` (from `org.springframework.test.context.bean.override.mockito`) — this is the Spring Boot 4.x replacement for the removed `@MockBean`.

### Frontend (Vitest + React Testing Library)
- Test runner: **Vitest** (`vitest run`), jsdom environment, globals mode.
- Test files named `ComponentName.test.jsx` co-located with the component.
- `setupTests.js` uses `import * as matchers from '@testing-library/jest-dom/matchers'` + `expect.extend(matchers)`. Matchers like `toBeInTheDocument()` are available globally.
- `setupTests.js` also installs: an `afterEach(() => cleanup())` call, a `window.matchMedia` mock (required by Mantine), and a complete in-memory `localStorage` mock that replaces jsdom's stub, cleared in `beforeEach`.
- `src/test-utils.jsx` exports a `renderWithProviders` helper (re-exported as `render`) that wraps components with `MantineProvider`, `MemoryRouter`, and `AuthProvider`. All test files import `render` from this file instead of directly from `@testing-library/react`.
- Exception: `AuthContext.test.jsx` imports `render` directly from `@testing-library/react` to avoid double-Router nesting when testing the `AuthProvider` itself.
- Use `@testing-library/user-event` for simulating interactions.
- Mock API calls with `vi.mock('../misc/MovieApi')`. Reset mocks in `beforeEach` with `vi.resetAllMocks()`.
- Simulate authentication by writing a user object to `localStorage` before rendering: `localStorage.setItem('user', JSON.stringify({ data: { exp, name, rol: ['ROLE'] }, accessToken: 'token' }))`.
- `Navbar` requires an `<AppShell>` ancestor — wrap it in `<AppShell header={{ height: 60 }}>` in tests.

---

## No AI/Agent Config Files

There are no `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` files in this repository. This `AGENTS.md` is the sole agent reference document.
